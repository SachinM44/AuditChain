module chainaudit::AuditRegistry {
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_EXISTS: u64 = 2;
    const E_NOT_FOUND: u64 = 3;
    const E_UNAUTHORIZED: u64 = 4;

    /// Risk categories
    const RISK_LOW: u8 = 0;
    const RISK_MEDIUM: u8 = 1;
    const RISK_HIGH: u8 = 2;

    /// Individual finding from audit
    struct Finding has store, drop, copy {
        finding_type: String,  // "obfuscation", "network", "crypto_mining", "tampering"
        severity: u8,          // 0=LOW, 1=MEDIUM, 2=HIGH
        description: String,
        file_path: String,
        line_number: u64,
    }

    /// Complete audit record for a package version
    struct PackageAudit has store, drop, copy {
        package_name: String,
        version: String,
        risk_score: u8,        // 0-100
        risk_category: u8,     // 0=LOW, 1=MEDIUM, 2=HIGH
        auditor_addresses: vector<address>,
        timestamp: u64,
        findings_count: u64,
        consensus_weight: u64, // Total weight of auditors who agreed
    }

    /// Detailed findings storage (separate to keep PackageAudit lightweight)
    struct AuditFindings has store, drop {
        findings: vector<Finding>,
    }

    /// Package identifier
    struct PackageKey has store, drop, copy {
        name: String,
        version: String,
    }

    /// Global audit registry
    struct Registry has key {
        audits: Table<PackageKey, PackageAudit>,
        findings: Table<PackageKey, AuditFindings>,
        total_audits: u64,
        authorized_publishers: vector<address>, // ConsensusOracle addresses
    }

    /// Initialize the registry
    public entry fun initialize(admin: &signer) {
        let admin_addr = std::signer::address_of(admin);
        assert!(!exists<Registry>(admin_addr), E_ALREADY_EXISTS);
        
        move_to(admin, Registry {
            audits: table::new(),
            findings: table::new(),
            total_audits: 0,
            authorized_publishers: vector::empty(),
        });
    }

    /// Add authorized publisher (ConsensusOracle)
    public entry fun add_authorized_publisher(
        admin: &signer,
        registry_addr: address,
        publisher_addr: address
    ) acquires Registry {
        assert!(std::signer::address_of(admin) == registry_addr, E_UNAUTHORIZED);
        assert!(exists<Registry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<Registry>(registry_addr);
        vector::push_back(&mut registry.authorized_publishers, publisher_addr);
    }

    /// Publish a new audit (only callable by authorized publishers)
    public fun publish_audit(
        publisher_addr: address,
        registry_addr: address,
        package_name: String,
        version: String,
        risk_score: u8,
        auditor_addresses: vector<address>,
        findings: vector<Finding>,
        consensus_weight: u64
    ) acquires Registry {
        assert!(exists<Registry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<Registry>(registry_addr);
        
        // Check authorization
        assert!(vector::contains(&registry.authorized_publishers, &publisher_addr), E_UNAUTHORIZED);
        
        // Determine risk category
        let risk_category = if (risk_score < 30) {
            RISK_LOW
        } else if (risk_score < 70) {
            RISK_MEDIUM
        } else {
            RISK_HIGH
        };
        
        let key = PackageKey {
            name: package_name,
            version: version,
        };
        
        // Create audit record
        let audit = PackageAudit {
            package_name: key.name,
            version: key.version,
            risk_score,
            risk_category,
            auditor_addresses,
            timestamp: timestamp::now_seconds(),
            findings_count: vector::length(&findings),
            consensus_weight,
        };
        
        // Store audit
        if (table::contains(&registry.audits, key)) {
            // Update existing audit
            *table::borrow_mut(&mut registry.audits, key) = audit;
            *table::borrow_mut(&mut registry.findings, key) = AuditFindings { findings };
        } else {
            // Add new audit
            table::add(&mut registry.audits, key, audit);
            table::add(&mut registry.findings, key, AuditFindings { findings });
            registry.total_audits = registry.total_audits + 1;
        }
    }

    /// Get latest audit for a package version
    #[view]
    public fun get_latest_audit(
        registry_addr: address,
        package_name: String,
        version: String
    ): (bool, u8, u8, u64, u64, u64) acquires Registry {
        if (!exists<Registry>(registry_addr)) {
            return (false, 0, 0, 0, 0, 0)
        };
        
        let registry = borrow_global<Registry>(registry_addr);
        let key = PackageKey { name: package_name, version };
        
        if (!table::contains(&registry.audits, key)) {
            return (false, 0, 0, 0, 0, 0)
        };
        
        let audit = table::borrow(&registry.audits, key);
        (
            true,
            audit.risk_score,
            audit.risk_category,
            audit.timestamp,
            audit.findings_count,
            vector::length(&audit.auditor_addresses)
        )
    }

    /// Check if audit exists
    #[view]
    public fun audit_exists(
        registry_addr: address,
        package_name: String,
        version: String
    ): bool acquires Registry {
        if (!exists<Registry>(registry_addr)) {
            return false
        };
        
        let registry = borrow_global<Registry>(registry_addr);
        let key = PackageKey { name: package_name, version };
        table::contains(&registry.audits, key)
    }

    /// Get total number of audits
    #[view]
    public fun get_total_audits(registry_addr: address): u64 acquires Registry {
        assert!(exists<Registry>(registry_addr), E_NOT_INITIALIZED);
        let registry = borrow_global<Registry>(registry_addr);
        registry.total_audits
    }

    /// Get risk category as string
    public fun risk_category_to_string(category: u8): String {
        if (category == RISK_LOW) {
            string::utf8(b"LOW")
        } else if (category == RISK_MEDIUM) {
            string::utf8(b"MEDIUM")
        } else {
            string::utf8(b"HIGH")
        }
    }

    #[test_only]
    use aptos_framework::account;

    #[test(admin = @chainaudit)]
    public fun test_initialize(admin: &signer) acquires Registry {
        let admin_addr = std::signer::address_of(admin);
        account::create_account_for_test(admin_addr);
        
        initialize(admin);
        
        assert!(exists<Registry>(admin_addr), 0);
        assert!(get_total_audits(admin_addr) == 0, 1);
    }
}
