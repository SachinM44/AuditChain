import { Network } from '@aptos-labs/ts-sdk';
export declare class AptosClient {
    private aptos;
    private registryAddress;
    constructor(network?: Network, registryAddress?: string);
    getLatestAudit(packageName: string, version: string): Promise<{
        exists: boolean;
        riskScore: number;
        riskCategory: number;
        timestamp: number;
        findingsCount: number;
        auditorCount: number;
    } | null>;
    checkAuditExists(packageName: string, version: string): Promise<boolean>;
    getRiskCategoryString(category: number): string;
    formatTimestamp(timestamp: number): string;
}
//# sourceMappingURL=aptos-client.d.ts.map