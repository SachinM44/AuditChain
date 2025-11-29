import dotenv from 'dotenv';
import { AuditorNode } from './src/auditor-node';

dotenv.config();

async function testAudit() {
  const packageName = process.argv[2] || 'axios';
  const version = process.argv[3] || '1.6.0';

  console.log(`\n🧪 Testing audit for ${packageName}@${version}\n`);

  const node = new AuditorNode({
    network: (process.env.NETWORK as 'testnet' | 'mainnet') || 'testnet',
    consensusOracleAddress: process.env.CONSENSUS_ORACLE_ADDRESS!,
    auditorStakingAddress: process.env.AUDITOR_STAKING_ADDRESS!,
    aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:8000',
    pollIntervalMs: 10000,
  });

  try {
    await node.auditPackage(packageName, version);
    console.log('\n✅ Test completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error, '\n');
    process.exit(1);
  }

  process.exit(0);
}

testAudit();
