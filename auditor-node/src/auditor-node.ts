import { PackageFetcher } from './fetcher';
import { AIEngineClient } from './ai-engine-client';
import { AptosClient } from './aptos-client';

export interface AuditorNodeConfig {
  network: 'testnet' | 'mainnet';
  consensusOracleAddress: string;
  auditorStakingAddress: string;
  aiEngineUrl: string;
  pollIntervalMs: number;
}

export class AuditorNode {
  private config: AuditorNodeConfig;
  private fetcher: PackageFetcher;
  private aiClient: AIEngineClient;
  private aptosClient: AptosClient;
  private isRunning: boolean = false;
  private pollTimer?: NodeJS.Timeout;
  private processedPackages: Set<string> = new Set();

  constructor(config: AuditorNodeConfig) {
    this.config = config;
    this.fetcher = new PackageFetcher();
    this.aiClient = new AIEngineClient(config.aiEngineUrl);
    this.aptosClient = new AptosClient(
      config.network,
      config.consensusOracleAddress,
      config.auditorStakingAddress
    );
  }

  async start() {
    console.log('✅ Auditor Node Configuration:');
    console.log(`   Network: ${this.config.network}`);
    console.log(`   Consensus Oracle: ${this.config.consensusOracleAddress}`);
    console.log(`   Poll Interval: ${this.config.pollIntervalMs}ms`);
    console.log('');

    this.isRunning = true;
    
    // Start polling for audit requests
    this.startPolling();
    
    console.log('👂 Listening for audit requests...\n');
  }

  async stop() {
    this.isRunning = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
    }
    console.log('✅ Auditor node stopped');
  }

  private startPolling() {
    const poll = async () => {
      if (!this.isRunning) return;

      try {
        await this.checkForAuditRequests();
      } catch (error) {
        console.error('❌ Error during polling:', error);
      }

      // Schedule next poll
      if (this.isRunning) {
        this.pollTimer = setTimeout(poll, this.config.pollIntervalMs);
      }
    };

    // Start first poll
    poll();
  }

  private async checkForAuditRequests() {
    // For now, we'll manually trigger audits
    // In production, this would listen to blockchain events
    console.log(`[${new Date().toISOString()}] Checking for audit requests...`);
    
    // TODO: Implement event listening or request queue checking
    // For now, this is a placeholder
  }

  async auditPackage(packageName: string, version: string) {
    const packageKey = `${packageName}@${version}`;
    
    if (this.processedPackages.has(packageKey)) {
      console.log(`⏭️  Already processed ${packageKey}, skipping...`);
      return;
    }

    console.log(`\n📦 Processing audit request: ${packageKey}`);
    console.log('─'.repeat(60));

    try {
      // Step 1: Download package
      console.log('1️⃣  Downloading package from npm...');
      const tarballPath = await this.fetcher.fetchPackage(packageName, version);
      console.log(`   ✅ Downloaded to: ${tarballPath}`);

      // Step 2: Analyze with AI engine
      console.log('2️⃣  Analyzing package with AI engine...');
      const analysis = await this.aiClient.analyzePackage(packageName, version, tarballPath);
      console.log(`   ✅ Risk Score: ${analysis.risk_score}/100`);
      console.log(`   ✅ Confidence: ${(analysis.engine_confidence * 100).toFixed(1)}%`);
      console.log(`   ✅ Findings: ${analysis.findings.length}`);

      // Step 3: Submit proposal to blockchain
      console.log('3️⃣  Submitting proposal to blockchain...');
      const txHash = await this.aptosClient.submitProposal(
        packageName,
        version,
        analysis.risk_score
      );
      console.log(`   ✅ Transaction: ${txHash}`);

      // Step 4: Check consensus
      console.log('4️⃣  Checking consensus...');
      await this.aptosClient.checkConsensus(packageName, version);
      console.log(`   ✅ Consensus check triggered`);

      // Mark as processed
      this.processedPackages.add(packageKey);
      
      console.log('─'.repeat(60));
      console.log(`✅ Successfully processed ${packageKey}\n`);

    } catch (error) {
      console.error(`❌ Error processing ${packageKey}:`, error);
      console.log('─'.repeat(60) + '\n');
    }
  }
}
