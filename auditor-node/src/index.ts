import dotenv from 'dotenv';
import { AuditorNode } from './auditor-node';

dotenv.config();

async function main() {
  console.log('🚀 Starting ChainAudit Auditor Node...\n');

  const node = new AuditorNode({
    network: (process.env.NETWORK as 'testnet' | 'mainnet') || 'testnet',
    consensusOracleAddress: process.env.CONSENSUS_ORACLE_ADDRESS!,
    auditorStakingAddress: process.env.AUDITOR_STAKING_ADDRESS!,
    aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:8000',
    pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || '10000'),
  });

  await node.start();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    await node.stop();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
