# ChainAudit Development Plan - Your Part (Sachin)

## ✅ Completed So Far

### Smart Contracts (Move)

- ✅ AuditorStaking.move - Auditor registration and stake management
- ✅ AuditRegistry.move - Immutable audit storage
- ✅ ConsensusOracle.move - Proposal aggregation and consensus
- ✅ All contracts compile successfully

### CLI Tool (TypeScript)

- ✅ Project structure created
- ✅ Commands: install, audit, history, config
- ✅ Aptos client integration
- ✅ Configuration management
- ✅ Package.json and TypeScript setup

## 🚧 Next Steps

### Phase 1: Deploy & Test Smart Contracts (Priority 1)

1. **Deploy to Testnet**

   ```bash
   cd contracts
   aptos move publish --dev
   ```

   - Save the deployed address
   - Initialize contracts (call initialize functions)
   - Fund your account with testnet APT

2. **Test Contract Functions**
   - Register yourself as an auditor
   - Submit test proposals
   - Verify consensus mechanism works

### Phase 2: Complete CLI Tool (Priority 2)

1. **Install Dependencies**

   ```bash
   cd cli
   npm install
   ```

2. **Configure Registry Address**

   - Update CLI config with deployed contract address
   - Test all commands

3. **Build and Test**
   ```bash
   npm run build
   npm link
   chainaudit config --show
   ```

### Phase 3: Build Auditor Node (Priority 3)

**Location:** `auditor-node/`

**What it needs:**

- Node.js/TypeScript service
- Modules:
  - Task Listener (watch Aptos events)
  - Package Fetcher (download npm packages)
  - Engine Runner (call Shubasis's AI engine - mock for now)
  - Aptos Client (submit proposals)
  - State Manager (track auditor status)

**Mock AI Engine Response:**

```typescript
interface AIEngineResponse {
  risk_score: number; // 0-100
  engine_confidence: number; // 0.0-1.0
  findings: Array<{
    type: string; // "obfuscation" | "network" | "crypto_mining"
    severity: string; // "LOW" | "MEDIUM" | "HIGH"
    description: string;
    file: string;
    line: number;
  }>;
}
```

### Phase 4: Build Frontend Dashboard (Priority 4)

**Location:** `frontend/`

**Tech Stack:**

- React (no TypeScript needed if you prefer)
- Plain CSS (no Tailwind)
- Aptos Wallet Adapter

**Pages:**

1. **Home** - Live audit requests
2. **Package Search** - Search and view audit results
3. **Auditor Dashboard** - Your node status, reputation
4. **Leaderboard** - Top auditors by reputation

### Phase 5: Integration Testing (Priority 5)

**End-to-End Flow:**

1. Deploy contracts
2. Run auditor node
3. Use CLI to request audit
4. Auditor node picks up request
5. Submits proposal to chain
6. Consensus reached
7. Result stored in registry
8. CLI displays result

## 📋 What You Need Right Now

### Immediate Actions:

1. **Deploy Contracts**

   ```bash
   cd contracts
   aptos move publish --dev
   # Save the address that gets printed
   ```

2. **Initialize Contracts**

   ```bash
   # Initialize AuditorStaking
   aptos move run \
     --function-id 'YOUR_ADDRESS::AuditorStaking::initialize' \
     --args address:YOUR_ADDRESS

   # Initialize AuditRegistry
   aptos move run \
     --function-id 'YOUR_ADDRESS::AuditRegistry::initialize' \
     --args address:YOUR_ADDRESS

   # Initialize ConsensusOracle
   aptos move run \
     --function-id 'YOUR_ADDRESS::ConsensusOracle::initialize' \
     --args address:YOUR_ADDRESS address:YOUR_ADDRESS address:YOUR_ADDRESS
   ```

3. **Test CLI**
   ```bash
   cd cli
   npm install
   npm run build
   npm link
   chainaudit config --set-registry YOUR_DEPLOYED_ADDRESS
   chainaudit audit lodash@4.17.21
   ```

## 🤝 Integration with Shubasis (AI/ML Part)

### What Shubasis Needs to Deliver:

**AI Detection Engine** - Standalone service/library

**Input:**

```json
{
  "package_name": "lodash",
  "version": "4.17.21",
  "tarball_url": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz"
}
```

**Output:**

```json
{
  "risk_score": 15,
  "engine_confidence": 0.92,
  "findings": [
    {
      "type": "network",
      "severity": "LOW",
      "description": "HTTP request to known CDN",
      "file": "lib/fetch.js",
      "line": 42
    }
  ]
}
```

### Integration Point:

Your auditor node will call Shubasis's engine:

```typescript
// In auditor-node/src/engine-client.ts
async function analyzePackage(packageName: string, version: string) {
  // Call Shubasis's AI engine API
  const response = await fetch("http://ai-engine:8000/analyze", {
    method: "POST",
    body: JSON.stringify({ package_name: packageName, version }),
  });
  return response.json();
}
```

## 📦 Project Structure Summary

```
chainaudit/
├── contracts/              ✅ DONE - 3 Move contracts
│   ├── sources/
│   │   ├── AuditorStaking.move
│   │   ├── AuditRegistry.move
│   │   └── ConsensusOracle.move
│   └── Move.toml
│
├── cli/                    ✅ DONE - Ready to test
│   ├── src/
│   │   ├── commands/
│   │   │   ├── install.ts
│   │   │   ├── audit.ts
│   │   │   ├── history.ts
│   │   │   └── config.ts
│   │   ├── utils/
│   │   │   ├── aptos-client.ts
│   │   │   └── config.ts
│   │   └── index.ts
│   └── package.json
│
├── auditor-node/           🚧 TODO - Build this next
│   ├── src/
│   │   ├── listener.ts
│   │   ├── fetcher.ts
│   │   ├── engine-client.ts
│   │   ├── aptos-client.ts
│   │   └── index.ts
│   └── package.json
│
└── frontend/               🚧 TODO - Build after auditor node
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.js
    └── package.json
```

## 🎯 Success Criteria

By the end, you should be able to:

1. ✅ Deploy contracts to Aptos testnet
2. ✅ Register as an auditor with staked APT
3. ✅ Run CLI to check package audits
4. ✅ Run auditor node that listens for requests
5. ✅ Submit proposals and reach consensus
6. ✅ View results in frontend dashboard

## 💡 Tips

- **Start small**: Deploy contracts first, test manually
- **Mock the AI**: Use random risk scores until Shubasis delivers
- **Test locally**: Use Aptos devnet for faster iteration
- **Document everything**: Keep notes on contract addresses, test accounts

## 🆘 If You Get Stuck

Common issues:

- **Compilation errors**: Check Move syntax, ensure all types have required abilities
- **Transaction fails**: Check account has enough APT, function arguments are correct
- **CLI not working**: Verify registry address is set, network is reachable

## 📞 Questions to Ask Shubasis

1. What's the API endpoint for the AI engine?
2. What's the expected response time per package?
3. How do we handle timeouts or errors?
4. Can we get a mock/test version to develop against?

---

**Current Status:** Smart contracts ready, CLI ready, need to deploy and test!

**Next Action:** Deploy contracts to testnet and get the address.
