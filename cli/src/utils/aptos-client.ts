import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export class AptosClient {
  private aptos: Aptos;
  private registryAddress: string;

  constructor(network: Network = Network.TESTNET, registryAddress?: string) {
    const config = new AptosConfig({ network });
    this.aptos = new Aptos(config);
    this.registryAddress = registryAddress || process.env.REGISTRY_ADDRESS || '';
  }

  async getLatestAudit(packageName: string, version: string) {
    try {
      const functionId = `${this.registryAddress}::AuditRegistry::get_latest_audit` as `${string}::${string}::${string}`;
      
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
        exists: result[0] as boolean,
        riskScore: Number(result[1]),
        riskCategory: Number(result[2]),
        timestamp: Number(result[3]),
        findingsCount: Number(result[4]),
        auditorCount: Number(result[5]),
      };
    } catch (error) {
      console.error('Error fetching audit:', error);
      return null;
    }
  }

  async checkAuditExists(packageName: string, version: string): Promise<boolean> {
    try {
      const functionId = `${this.registryAddress}::AuditRegistry::audit_exists` as `${string}::${string}::${string}`;
      
      const result = await this.aptos.view({
        payload: {
          function: functionId,
          typeArguments: [],
          functionArguments: [this.registryAddress, packageName, version],
        }
      });
      return result[0] as boolean;
    } catch (error) {
      return false;
    }
  }

  getRiskCategoryString(category: number): string {
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

  formatTimestamp(timestamp: number): string {
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
