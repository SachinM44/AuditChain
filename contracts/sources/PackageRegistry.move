module chainaudit::PackageRegistry {
    use std::signer;
    use std::string::String;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use std::vector;

    const TIER_BASIC: u8 = 0;
    const TIER_POPULAR: u8 = 1;
    const TIER_ENTERPRISE: u8 = 2;

    const STATUS_ACTIVE: u8 = 0;
    const STATUS_PAUSED: u8 = 1;

    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_REGISTERED: u64 = 2;
    const E_NOT_FOUND: u64 = 3;
    const E_INSUFFICIENT_BOUNTY: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;

    struct RegisteredPackage has store, drop, copy {
        owner: address,
        npm_name: String,
        tier: u8,
        bounty_pool: u64,
        registration_fee_paid: u64,
        credibility_score: u64,
        total_findings: u64,
        accepted_findings: u64,
        total_rewards_paid: u64,
        created_at: u64,
        status: u8
    }

    struct PackageRegistry has key {
        packages: Table<String, RegisteredPackage>,
        total_packages: u64,
    }

    // Separate resource for package names list (backward compatible)
    struct PackageNamesList has key {
        names: vector<String>,
    }

    public entry fun initialize(admin: &signer) {
        move_to(admin, PackageRegistry {
            packages: table::new(),
            total_packages: 0,
        });
        move_to(admin, PackageNamesList {
            names: vector::empty(),
        });
    }

    public entry fun register_package(
        owner: &signer,
        registry_addr: address,
        npm_name: String,
        tier: u8,
        registration_fee: u64,
        bounty_amount: u64
    ) acquires PackageRegistry, PackageNamesList {
        let owner_addr = signer::address_of(owner);
        let registry = borrow_global_mut<PackageRegistry>(registry_addr);
        
        assert!(!table::contains(&registry.packages, npm_name), E_ALREADY_REGISTERED);
        assert!(bounty_amount >= 20_00000000, E_INSUFFICIENT_BOUNTY);

        coin::transfer<AptosCoin>(owner, registry_addr, registration_fee + bounty_amount);

        let package = RegisteredPackage {
            owner: owner_addr,
            npm_name,
            tier,
            bounty_pool: bounty_amount,
            registration_fee_paid: registration_fee,
            credibility_score: 50,
            total_findings: 0,
            accepted_findings: 0,
            total_rewards_paid: 0,
            created_at: timestamp::now_seconds(),
            status: STATUS_ACTIVE
        };

        // Add to names list
        if (exists<PackageNamesList>(registry_addr)) {
            let names_list = borrow_global_mut<PackageNamesList>(registry_addr);
            vector::push_back(&mut names_list.names, npm_name);
        };

        table::add(&mut registry.packages, package.npm_name, package);
        registry.total_packages = registry.total_packages + 1;
    }

    public entry fun add_to_bounty(
        owner: &signer,
        registry_addr: address,
        npm_name: String,
        amount: u64
    ) acquires PackageRegistry {
        let registry = borrow_global_mut<PackageRegistry>(registry_addr);
        assert!(table::contains(&registry.packages, npm_name), E_NOT_FOUND);
        
        let package = table::borrow_mut(&mut registry.packages, npm_name);
        assert!(package.owner == signer::address_of(owner), E_UNAUTHORIZED);

        coin::transfer<AptosCoin>(owner, registry_addr, amount);
        package.bounty_pool = package.bounty_pool + amount;
    }

    public fun update_package_stats(
        registry_addr: address,
        npm_name: String,
        accepted: bool,
        reward_amount: u64
    ) acquires PackageRegistry {
        let registry = borrow_global_mut<PackageRegistry>(registry_addr);
        let package = table::borrow_mut(&mut registry.packages, npm_name);
        
        package.total_findings = package.total_findings + 1;
        if (accepted) {
            package.accepted_findings = package.accepted_findings + 1;
            package.total_rewards_paid = package.total_rewards_paid + reward_amount;
            package.bounty_pool = package.bounty_pool - reward_amount;
        };
    }

    #[view]
    public fun get_package_info(
        registry_addr: address,
        npm_name: String
    ): (bool, address, u8, u64, u64, u64, u64) acquires PackageRegistry {
        if (!exists<PackageRegistry>(registry_addr)) {
            return (false, @0x0, 0, 0, 0, 0, 0)
        };
        
        let registry = borrow_global<PackageRegistry>(registry_addr);
        if (!table::contains(&registry.packages, npm_name)) {
            return (false, @0x0, 0, 0, 0, 0, 0)
        };
        
        let pkg = table::borrow(&registry.packages, npm_name);
        (true, pkg.owner, pkg.tier, pkg.bounty_pool, pkg.credibility_score, pkg.total_findings, pkg.accepted_findings)
    }

    // Migration function to add existing packages to the names list
    public entry fun add_package_to_list(
        admin: &signer,
        registry_addr: address,
        npm_name: String
    ) acquires PackageRegistry, PackageNamesList {
        // Verify the package exists
        let registry = borrow_global<PackageRegistry>(registry_addr);
        assert!(table::contains(&registry.packages, npm_name), E_NOT_FOUND);
        
        // Add to names list if not already there
        let names_list = borrow_global_mut<PackageNamesList>(registry_addr);
        if (!vector::contains(&names_list.names, &npm_name)) {
            vector::push_back(&mut names_list.names, npm_name);
        };
    }

    #[view]
    public fun get_all_packages(
        registry_addr: address
    ): vector<String> acquires PackageNamesList {
        if (!exists<PackageNamesList>(registry_addr)) {
            return vector::empty()
        };
        
        let names_list = borrow_global<PackageNamesList>(registry_addr);
        names_list.names
    }

    #[view]
    public fun get_package_details(
        registry_addr: address,
        npm_name: String
    ): (String, u8, u64, u64) acquires PackageRegistry {
        let registry = borrow_global<PackageRegistry>(registry_addr);
        let pkg = table::borrow(&registry.packages, npm_name);
        (pkg.npm_name, pkg.tier, pkg.bounty_pool, pkg.total_findings)
    }

    #[view]
    public fun get_total_packages(
        registry_addr: address
    ): u64 acquires PackageRegistry {
        if (!exists<PackageRegistry>(registry_addr)) {
            return 0
        };
        let registry = borrow_global<PackageRegistry>(registry_addr);
        registry.total_packages
    }
}
