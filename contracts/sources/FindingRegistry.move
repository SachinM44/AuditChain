module chainaudit::FindingRegistry {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table::{Self, Table};

    const SEVERITY_LOW: u8 = 0;
    const SEVERITY_MEDIUM: u8 = 1;
    const SEVERITY_HIGH: u8 = 2;
    const SEVERITY_CRITICAL: u8 = 3;

    const STATUS_PENDING: u8 = 0;
    const STATUS_ACCEPTED: u8 = 1;
    const STATUS_REJECTED: u8 = 2;

    const E_NOT_INITIALIZED: u64 = 1;
    const E_NOT_FOUND: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_ALREADY_REVIEWED: u64 = 4;
    const E_INSUFFICIENT_BOUNTY: u64 = 5;

    struct SecurityFinding has store, drop, copy {
        id: u64,
        package_name: String,
        auditor: address,
        severity: u8,
        title: String,
        description: String,
        status: u8,
        reward_amount: u64,
        submitted_at: u64,
        reviewed_at: u64
    }

    struct FindingRegistry has key {
        findings: Table<u64, SecurityFinding>,
        package_findings: Table<String, vector<u64>>,
        auditor_findings: Table<address, vector<u64>>,
        next_finding_id: u64,
    }

    public entry fun initialize(admin: &signer) {
        move_to(admin, FindingRegistry {
            findings: table::new(),
            package_findings: table::new(),
            auditor_findings: table::new(),
            next_finding_id: 1,
        });
    }

    public entry fun submit_finding(
        auditor: &signer,
        finding_registry_addr: address,
        package_name: String,
        severity: u8,
        title: String,
        description: String
    ) acquires FindingRegistry {
        let auditor_addr = signer::address_of(auditor);
        let registry = borrow_global_mut<FindingRegistry>(finding_registry_addr);

        let finding_id = registry.next_finding_id;
        let finding = SecurityFinding {
            id: finding_id,
            package_name,
            auditor: auditor_addr,
            severity,
            title,
            description,
            status: STATUS_PENDING,
            reward_amount: 0,
            submitted_at: timestamp::now_seconds(),
            reviewed_at: 0
        };

        table::add(&mut registry.findings, finding_id, finding);

        if (!table::contains(&registry.package_findings, package_name)) {
            table::add(&mut registry.package_findings, package_name, vector::empty());
        };
        let pkg_findings = table::borrow_mut(&mut registry.package_findings, package_name);
        vector::push_back(pkg_findings, finding_id);

        if (!table::contains(&registry.auditor_findings, auditor_addr)) {
            table::add(&mut registry.auditor_findings, auditor_addr, vector::empty());
        };
        let aud_findings = table::borrow_mut(&mut registry.auditor_findings, auditor_addr);
        vector::push_back(aud_findings, finding_id);

        registry.next_finding_id = finding_id + 1;
    }

    public entry fun review_finding(
        owner: &signer,
        finding_registry_addr: address,
        finding_id: u64,
        accept: bool,
        reward_amount: u64
    ) acquires FindingRegistry {
        let registry = borrow_global_mut<FindingRegistry>(finding_registry_addr);
        
        assert!(table::contains(&registry.findings, finding_id), E_NOT_FOUND);
        let finding = table::borrow_mut(&mut registry.findings, finding_id);
        assert!(finding.status == STATUS_PENDING, E_ALREADY_REVIEWED);

        if (accept) {
            finding.status = STATUS_ACCEPTED;
            finding.reward_amount = reward_amount;
            
            // Transfer reward from owner to auditor
            coin::transfer<AptosCoin>(owner, finding.auditor, reward_amount);
        } else {
            finding.status = STATUS_REJECTED;
        };

        finding.reviewed_at = timestamp::now_seconds();
    }

    #[view]
    public fun get_finding(
        registry_addr: address,
        finding_id: u64
    ): (bool, String, address, u8, String, u8, u64, u64) acquires FindingRegistry {
        if (!exists<FindingRegistry>(registry_addr)) {
            return (false, std::string::utf8(b""), @0x0, 0, std::string::utf8(b""), 0, 0, 0)
        };
        
        let registry = borrow_global<FindingRegistry>(registry_addr);
        if (!table::contains(&registry.findings, finding_id)) {
            return (false, std::string::utf8(b""), @0x0, 0, std::string::utf8(b""), 0, 0, 0)
        };
        
        let finding = table::borrow(&registry.findings, finding_id);
        (true, finding.package_name, finding.auditor, finding.severity, finding.title, 
         finding.status, finding.reward_amount, finding.submitted_at)
    }

    #[view]
    public fun get_package_findings_count(
        registry_addr: address,
        package_name: String
    ): u64 acquires FindingRegistry {
        if (!exists<FindingRegistry>(registry_addr)) {
            return 0
        };
        
        let registry = borrow_global<FindingRegistry>(registry_addr);
        if (!table::contains(&registry.package_findings, package_name)) {
            return 0
        };
        
        let findings = table::borrow(&registry.package_findings, package_name);
        vector::length(findings)
    }
}
