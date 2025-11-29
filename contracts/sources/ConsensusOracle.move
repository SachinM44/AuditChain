module chainaudit::ConsensusOracle {
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use chainaudit::AuditorStaking;
    use chainaudit::AuditRegistry;

    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_NOT_ACTIVE_AUDITOR: u64 = 2;
    const E_ALREADY_SUBMITTED: u64 = 3;
    const E_NOT_FOUND: u64 = 4;
    const E_DISPUTE_WINDOW_CLOSED: u64 = 5;

    /// Consensus threshold (60% agreement)
    const CONSENSUS_THRESHOLD: u64 = 60;
    
    /// Dispute window (24 hours in seconds)
    const DISPUTE_WINDOW: u64 = 86400;

    /// Individual auditor proposal
    struct AuditorProposal has store, drop, copy {
        auditor_addr: address,
        risk_score: u8,
        submitted_at: u64,
        weight: u64, // Based on reputation
    }

    /// Audit request tracking
    struct AuditRequest has store {
        package_name: String,
        version: String,
        proposals: vector<AuditorProposal>,
        total_weight: u64,
        is_finalized: bool,
        finalized_at: u64,
        final_risk_score: u8,
    }

    /// Package identifier
    struct PackageKey has store, drop, copy {
        name: String,
        version: String,
    }

    /// Global consensus manager
    struct ConsensusManager has key {
        requests: Table<PackageKey, AuditRequest>,
        auditor_staking_addr: address,
        audit_registry_addr: address,
        total_requests: u64,
    }

    /// Initialize consensus manager
    public entry fun initialize(
        admin: &signer,
        auditor_staking_addr: address,
        audit_registry_addr: address
    ) {
        let admin_addr = std::signer::address_of(admin);
        assert!(!exists<ConsensusManager>(admin_addr), E_NOT_INITIALIZED);
        
        move_to(admin, ConsensusManager {
            requests: table::new(),
            auditor_staking_addr,
            audit_registry_addr,
            total_requests: 0,
        });
    }

    /// Submit an audit proposal
    public entry fun submit_proposal(
        auditor: &signer,
        manager_addr: address,
        package_name: String,
        version: String,
        risk_score: u8
    ) acquires ConsensusManager {
        let auditor_addr = std::signer::address_of(auditor);
        assert!(exists<ConsensusManager>(manager_addr), E_NOT_INITIALIZED);
        
        let manager = borrow_global_mut<ConsensusManager>(manager_addr);
        
        // Check if auditor is active
        assert!(
            AuditorStaking::is_active(manager.auditor_staking_addr, auditor_addr),
            E_NOT_ACTIVE_AUDITOR
        );
        
        let key = PackageKey { name: package_name, version };
        
        // Get auditor reputation as weight
        let (_, reputation, _, _, _) = AuditorStaking::get_auditor_info(
            manager.auditor_staking_addr,
            auditor_addr
        );
        
        // Create or update request
        if (!table::contains(&manager.requests, key)) {
            // New request
            let request = AuditRequest {
                package_name: key.name,
                version: key.version,
                proposals: vector::empty(),
                total_weight: 0,
                is_finalized: false,
                finalized_at: 0,
                final_risk_score: 0,
            };
            table::add(&mut manager.requests, key, request);
            manager.total_requests = manager.total_requests + 1;
        };
        
        let request = table::borrow_mut(&mut manager.requests, key);
        
        // Check if auditor already submitted
        let i = 0;
        let len = vector::length(&request.proposals);
        while (i < len) {
            let proposal = vector::borrow(&request.proposals, i);
            assert!(proposal.auditor_addr != auditor_addr, E_ALREADY_SUBMITTED);
            i = i + 1;
        };
        
        // Add proposal
        let proposal = AuditorProposal {
            auditor_addr,
            risk_score,
            submitted_at: timestamp::now_seconds(),
            weight: reputation,
        };
        vector::push_back(&mut request.proposals, proposal);
        request.total_weight = request.total_weight + reputation;
        
        // Increment auditor's audit count
        AuditorStaking::increment_audit_count(manager.auditor_staking_addr, auditor_addr);
    }

    /// Check and finalize consensus if threshold reached
    public entry fun check_consensus(
        _caller: &signer,
        manager_addr: address,
        package_name: String,
        version: String
    ) acquires ConsensusManager {
        assert!(exists<ConsensusManager>(manager_addr), E_NOT_INITIALIZED);
        
        let manager = borrow_global_mut<ConsensusManager>(manager_addr);
        let key = PackageKey { name: package_name, version };
        
        assert!(table::contains(&manager.requests, key), E_NOT_FOUND);
        
        let request = table::borrow_mut(&mut manager.requests, key);
        
        // Skip if already finalized
        if (request.is_finalized) {
            return
        };
        
        // Need at least 1 proposal for testing (change to 3 for production)
        if (vector::length(&request.proposals) < 1) {
            return
        };
        
        // Calculate consensus
        let (has_consensus, consensus_score, consensus_weight) = calculate_consensus(request);
        
        if (has_consensus) {
            // Finalize
            request.is_finalized = true;
            request.finalized_at = timestamp::now_seconds();
            request.final_risk_score = consensus_score;
            
            // Collect auditor addresses
            let auditor_addrs = vector::empty<address>();
            let i = 0;
            let len = vector::length(&request.proposals);
            while (i < len) {
                let proposal = vector::borrow(&request.proposals, i);
                // Only include auditors who agreed with consensus
                if (score_similarity(proposal.risk_score, consensus_score)) {
                    vector::push_back(&mut auditor_addrs, proposal.auditor_addr);
                };
                i = i + 1;
            };
            
            // Publish to AuditRegistry
            AuditRegistry::publish_audit(
                manager_addr,
                manager.audit_registry_addr,
                request.package_name,
                request.version,
                consensus_score,
                auditor_addrs,
                vector::empty(), // Findings would come from off-chain
                consensus_weight
            );
        }
    }

    /// Calculate if consensus is reached
    fun calculate_consensus(request: &AuditRequest): (bool, u8, u64) {
        let proposals = &request.proposals;
        let len = vector::length(proposals);
        
        if (len == 0) {
            return (false, 0, 0)
        };
        
        // Calculate weighted average risk score
        let weighted_sum: u64 = 0;
        let i = 0;
        while (i < len) {
            let proposal = vector::borrow(proposals, i);
            weighted_sum = weighted_sum + ((proposal.risk_score as u64) * proposal.weight);
            i = i + 1;
        };
        
        let avg_score = (weighted_sum / request.total_weight as u8);
        
        // Check how many auditors agree (within ±10 points)
        let consensus_weight: u64 = 0;
        i = 0;
        while (i < len) {
            let proposal = vector::borrow(proposals, i);
            if (score_similarity(proposal.risk_score, avg_score)) {
                consensus_weight = consensus_weight + proposal.weight;
            };
            i = i + 1;
        };
        
        // Check if consensus weight exceeds threshold
        let consensus_percentage = (consensus_weight * 100) / request.total_weight;
        let has_consensus = consensus_percentage >= CONSENSUS_THRESHOLD;
        
        (has_consensus, avg_score, consensus_weight)
    }

    /// Check if two scores are similar (within ±10 points)
    fun score_similarity(score1: u8, score2: u8): bool {
        let diff = if (score1 > score2) {
            score1 - score2
        } else {
            score2 - score1
        };
        diff <= 10
    }

    /// Get request status
    #[view]
    public fun get_request_status(
        manager_addr: address,
        package_name: String,
        version: String
    ): (bool, bool, u64, u8) acquires ConsensusManager {
        if (!exists<ConsensusManager>(manager_addr)) {
            return (false, false, 0, 0)
        };
        
        let manager = borrow_global<ConsensusManager>(manager_addr);
        let key = PackageKey { name: package_name, version };
        
        if (!table::contains(&manager.requests, key)) {
            return (false, false, 0, 0)
        };
        
        let request = table::borrow(&manager.requests, key);
        (
            true,
            request.is_finalized,
            vector::length(&request.proposals),
            request.final_risk_score
        )
    }

    #[test_only]
    use aptos_framework::account;

    #[test(admin = @chainaudit)]
    public fun test_initialize(admin: &signer) {
        let admin_addr = std::signer::address_of(admin);
        account::create_account_for_test(admin_addr);
        
        initialize(admin, @0x1, @0x2);
        
        assert!(exists<ConsensusManager>(admin_addr), 0);
    }
}
