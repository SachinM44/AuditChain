export interface ChainAuditConfig {
    riskThreshold: number;
    policy: 'allow' | 'warn' | 'block';
    registryAddress: string;
    network: 'testnet' | 'mainnet';
}
export declare function loadConfig(): ChainAuditConfig;
export declare function saveConfig(config: Partial<ChainAuditConfig>): void;
export declare function getConfigPath(): string;
//# sourceMappingURL=config.d.ts.map