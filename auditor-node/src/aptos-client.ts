import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

export class AptosClient {
  private aptos: Aptos;
  private account: Account;
  private consensusOracleAddress: string;
  private auditorStakingAddress: string;

  constructor(
    network: 'testnet' | 'mainnet',
    consensusOracleAddress: string,
    auditorStakingAddress: string
  ) {
    const config = new AptosConfig({ 
      network: network === 'mainnet' ? Network.MAINNET : Network.TESTNET 
    });
    this.aptos = new Aptos(config);
    this.consensusOracleAddress = consensusOracleAddress;
    this.auditorStakingAddress = auditorStakingAddress;

    // Load account from environment or use default
    // In production, this should be loaded securely
    const privateKeyHex = process.env.PRIVATE_KEY;
    if (privateKeyHex) {
      const privateKey = new Ed25519PrivateKey(privateKeyHex);
      this.account = Account.fromPrivateKey({ privateKey });
    } else {
      // For testing, we'll need to set this up properly
      throw new Error('PRIVATE_KEY environment variable not set');
    }
  }

  async submitProposal(
    packageName: string,
    version: string,
    riskScore: number
  ): Promise<string> {
    const functionId = `${this.consensusOracleAddress}::ConsensusOracle::submit_proposal` as `${string}::${string}::${string}`;

    const transaction = await this.aptos.transaction.build.simple({
      sender: this.account.accountAddress,
      data: {
        function: functionId,
        typeArguments: [],
        functionArguments: [
          this.consensusOracleAddress,
          packageName,
          version,
          riskScore,
        ],
      },
    });

    const committedTxn = await this.aptos.signAndSubmitTransaction({
      signer: this.account,
      transaction,
    });

    await this.aptos.waitForTransaction({
      transactionHash: committedTxn.hash,
    });

    return committedTxn.hash;
  }

  async checkConsensus(packageName: string, version: string): Promise<string> {
    const functionId = `${this.consensusOracleAddress}::ConsensusOracle::check_consensus` as `${string}::${string}::${string}`;

    const transaction = await this.aptos.transaction.build.simple({
      sender: this.account.accountAddress,
      data: {
        function: functionId,
        typeArguments: [],
        functionArguments: [
          this.consensusOracleAddress,
          packageName,
          version,
        ],
      },
    });

    const committedTxn = await this.aptos.signAndSubmitTransaction({
      signer: this.account,
      transaction,
    });

    await this.aptos.waitForTransaction({
      transactionHash: committedTxn.hash,
    });

    return committedTxn.hash;
  }

  async isActiveAuditor(): Promise<boolean> {
    try {
      const functionId = `${this.auditorStakingAddress}::AuditorStaking::is_active` as `${string}::${string}::${string}`;

      const result = await this.aptos.view({
        payload: {
          function: functionId,
          typeArguments: [],
          functionArguments: [
            this.auditorStakingAddress,
            this.account.accountAddress.toString(),
          ],
        },
      });

      return result[0] as boolean;
    } catch (error) {
      return false;
    }
  }

  getAccountAddress(): string {
    return this.account.accountAddress.toString();
  }
}
