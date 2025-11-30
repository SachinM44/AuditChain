module chainaudit::AuditorStaking {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    /// Minimum stake required to become an auditor (1 APT for testing)
    const MINIMUM_STAKE: u64 = 1_00000000; // 1 APT with 8 decimals

    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_REGISTERED: u64 = 2;
    const E_INSUFFICIENT_STAKE: u64 = 3;
    const E_NOT_REGISTERED: u64 = 4;
    const E_ALREADY_ACTIVE: u64 = 5;
    const E_NOT_ACTIVE: u64 = 6;
    const E_UNAUTHORIZED: u64 = 7;

    /// Auditor information
    struct AuditorInfo has store, drop, copy {
        staked_amount: u64,
        reputation_score: u64,
        is_active: bool,
        registered_at: u64,
        total_audits: u64,
    }

    /// Global registry of auditors
    struct AuditorRegistry has key {
        auditors: Table<address, AuditorInfo>,
        total_auditors: u64,
    }

    /// Initialize the auditor registry (called once by admin)
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<AuditorRegistry>(admin_addr), E_ALREADY_REGISTERED);
        
        move_to(admin, AuditorRegistry {
            auditors: table::new(),
            total_auditors: 0,
        });
    }

    /// Register as an auditor by staking APT
    public entry fun register_auditor(
        auditor: &signer,
        registry_addr: address,
        stake_amount: u64
    ) acquires AuditorRegistry {
        let auditor_addr = signer::address_of(auditor);
        
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        assert!(stake_amount >= MINIMUM_STAKE, E_INSUFFICIENT_STAKE);
        
        let registry = borrow_global_mut<AuditorRegistry>(registry_addr);
        assert!(!table::contains(&registry.auditors, auditor_addr), E_ALREADY_REGISTERED);
        
        // Transfer stake to registry
        coin::transfer<AptosCoin>(auditor, registry_addr, stake_amount);
        
        // Register auditor
        let auditor_info = AuditorInfo {
            staked_amount: stake_amount,
            reputation_score: 100, // Start with neutral reputation
            is_active: true,
            registered_at: timestamp::now_seconds(),
            total_audits: 0,
        };
        
        table::add(&mut registry.auditors, auditor_addr, auditor_info);
        registry.total_auditors = registry.total_auditors + 1;
    }

    /// Deactivate an auditor (when stake falls below threshold or manual)
    public entry fun deactivate_auditor(
        admin: &signer,
        registry_addr: address,
        auditor_addr: address
    ) acquires AuditorRegistry {
        assert!(signer::address_of(admin) == registry_addr, E_UNAUTHORIZED);
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<AuditorRegistry>(registry_addr);
        assert!(table::contains(&registry.auditors, auditor_addr), E_NOT_REGISTERED);
        
        let auditor_info = table::borrow_mut(&mut registry.auditors, auditor_addr);
        assert!(auditor_info.is_active, E_NOT_ACTIVE);
        
        auditor_info.is_active = false;
    }

    /// Reactivate an auditor
    public entry fun reactivate_auditor(
        admin: &signer,
        registry_addr: address,
        auditor_addr: address
    ) acquires AuditorRegistry {
        assert!(signer::address_of(admin) == registry_addr, E_UNAUTHORIZED);
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<AuditorRegistry>(registry_addr);
        assert!(table::contains(&registry.auditors, auditor_addr), E_NOT_REGISTERED);
        
        let auditor_info = table::borrow_mut(&mut registry.auditors, auditor_addr);
        assert!(!auditor_info.is_active, E_ALREADY_ACTIVE);
        assert!(auditor_info.staked_amount >= MINIMUM_STAKE, E_INSUFFICIENT_STAKE);
        
        auditor_info.is_active = true;
    }

    /// Update auditor reputation (called by consensus module)
    public fun update_reputation(
        registry_addr: address,
        auditor_addr: address,
        delta: u64,
        is_positive: bool
    ) acquires AuditorRegistry {
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<AuditorRegistry>(registry_addr);
        assert!(table::contains(&registry.auditors, auditor_addr), E_NOT_REGISTERED);
        
        let auditor_info = table::borrow_mut(&mut registry.auditors, auditor_addr);
        
        if (is_positive) {
            auditor_info.reputation_score = auditor_info.reputation_score + delta;
        } else {
            if (auditor_info.reputation_score > delta) {
                auditor_info.reputation_score = auditor_info.reputation_score - delta;
            } else {
                auditor_info.reputation_score = 0;
            }
        }
    }

    /// Increment audit count
    public fun increment_audit_count(
        registry_addr: address,
        auditor_addr: address
    ) acquires AuditorRegistry {
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<AuditorRegistry>(registry_addr);
        assert!(table::contains(&registry.auditors, auditor_addr), E_NOT_REGISTERED);
        
        let auditor_info = table::borrow_mut(&mut registry.auditors, auditor_addr);
        auditor_info.total_audits = auditor_info.total_audits + 1;
    }

    /// Check if auditor is active
    #[view]
    public fun is_active(registry_addr: address, auditor_addr: address): bool acquires AuditorRegistry {
        if (!exists<AuditorRegistry>(registry_addr)) {
            return false
        };
        
        let registry = borrow_global<AuditorRegistry>(registry_addr);
        if (!table::contains(&registry.auditors, auditor_addr)) {
            return false
        };
        
        let auditor_info = table::borrow(&registry.auditors, auditor_addr);
        auditor_info.is_active
    }

    /// Get auditor info
    #[view]
    public fun get_auditor_info(
        registry_addr: address,
        auditor_addr: address
    ): (u64, u64, bool, u64, u64) acquires AuditorRegistry {
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global<AuditorRegistry>(registry_addr);
        assert!(table::contains(&registry.auditors, auditor_addr), E_NOT_REGISTERED);
        
        let info = table::borrow(&registry.auditors, auditor_addr);
        (info.staked_amount, info.reputation_score, info.is_active, info.registered_at, info.total_audits)
    }

    /// Get total number of auditors
    #[view]
    public fun get_total_auditors(registry_addr: address): u64 acquires AuditorRegistry {
        assert!(exists<AuditorRegistry>(registry_addr), E_NOT_INITIALIZED);
        let registry = borrow_global<AuditorRegistry>(registry_addr);
        registry.total_auditors
    }

    #[test_only]
    use aptos_framework::account;

    #[test(admin = @chainaudit, auditor = @0x123)]
    public fun test_register_auditor(admin: &signer, auditor: &signer) acquires AuditorRegistry {
        // Setup
        let admin_addr = signer::address_of(admin);
        let auditor_addr = signer::address_of(auditor);
        
        account::create_account_for_test(admin_addr);
        account::create_account_for_test(auditor_addr);
        
        // Initialize registry
        initialize(admin);
        
        // Register auditor would require actual APT transfer in real scenario
        // This is a simplified test
        assert!(exists<AuditorRegistry>(admin_addr), 0);
    }
}
