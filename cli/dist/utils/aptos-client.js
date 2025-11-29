"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosClient = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
class AptosClient {
    constructor(network = ts_sdk_1.Network.TESTNET, registryAddress) {
        const config = new ts_sdk_1.AptosConfig({ network });
        this.aptos = new ts_sdk_1.Aptos(config);
        this.registryAddress = registryAddress || process.env.REGISTRY_ADDRESS || '';
    }
    async getLatestAudit(packageName, version) {
        try {
            const functionId = `${this.registryAddress}::AuditRegistry::get_latest_audit`;
            const result = await this.aptos.view({
                payload: {
                    function: functionId,
                    typeArguments: [],
                    functionArguments: [this.registryAddress, packageName, version],
                }
            });
            if (!result || !result[0]) {
                return null;
            }
            return {
                exists: result[0],
                riskScore: Number(result[1]),
                riskCategory: Number(result[2]),
                timestamp: Number(result[3]),
                findingsCount: Number(result[4]),
                auditorCount: Number(result[5]),
            };
        }
        catch (error) {
            console.error('Error fetching audit:', error);
            return null;
        }
    }
    async checkAuditExists(packageName, version) {
        try {
            const functionId = `${this.registryAddress}::AuditRegistry::audit_exists`;
            const result = await this.aptos.view({
                payload: {
                    function: functionId,
                    typeArguments: [],
                    functionArguments: [this.registryAddress, packageName, version],
                }
            });
            return result[0];
        }
        catch (error) {
            return false;
        }
    }
    getRiskCategoryString(category) {
        switch (category) {
            case 0:
                return 'LOW';
            case 1:
                return 'MEDIUM';
            case 2:
                return 'HIGH';
            default:
                return 'UNKNOWN';
        }
    }
    formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const now = Date.now();
        const diff = now - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}
exports.AptosClient = AptosClient;
//# sourceMappingURL=aptos-client.js.map