# ChainAudit Auditor Node

Automated service that listens for audit requests, analyzes npm packages, and submits proposals to the blockchain.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Build:

```bash
npm run build
```

## Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Manual Audit Trigger

You can manually trigger an audit using the node REPL:

```bash
npm run dev
# Then in another terminal:
node -e "
const { AuditorNode } = require('./dist/auditor-node');
const node = new AuditorNode({...config});
node.auditPackage('express', '4.18.2');
"
```

## Configuration

See `.env.example` for all configuration options.

Key settings:

- `NETWORK`: testnet or mainnet
- `PRIVATE_KEY`: Your auditor account private key
- `CONSENSUS_ORACLE_ADDRESS`: Deployed ConsensusOracle contract
- `AI_ENGINE_URL`: AI detection engine endpoint (mock for now)
- `POLL_INTERVAL_MS`: How often to check for new requests

## Architecture

```
AuditorNode
├── PackageFetcher    - Downloads npm packages
├── AIEngineClient    - Analyzes packages (mock for now)
└── AptosClient       - Submits proposals to blockchain
```

## How It Works

1. **Listen** - Polls for audit requests (or listens to events)
2. **Fetch** - Downloads package from npm registry
3. **Analyze** - Runs AI detection engine
4. **Submit** - Sends proposal to ConsensusOracle
5. **Finalize** - Triggers consensus check

## Testing

To test the auditor node:

1. Start the node
2. Manually trigger an audit for a package
3. Check that proposal is submitted to blockchain
4. Verify consensus is reached
5. Confirm audit appears in registry

## Integration with AI Engine

Currently uses mock data. To integrate with real AI engine:

1. Get API endpoint from Shubasis
2. Update `AIEngineClient.analyzePackage()`
3. Handle authentication if needed
4. Add error handling and retries

## Troubleshooting

**"PRIVATE_KEY not set"**

- Add your private key to .env file

**"Not an active auditor"**

- Register as auditor first using AuditorStaking contract

**"Transaction failed"**

- Check account has enough APT for gas
- Verify contract addresses are correct

## Security

- Never commit .env file
- Keep private keys secure
- Use separate accounts for testing vs production
- Monitor for suspicious activity
