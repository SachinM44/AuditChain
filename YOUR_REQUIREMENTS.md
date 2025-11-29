# ChainAudit - Your Complete Requirements (Sachin)

## 🎯 Your Role: Web3 + Backend + Frontend

You're building everything EXCEPT the AI/ML detection engine (that's Shubasis).

---

## 📦 What You Have Now

### ✅ Smart Contracts (3 Move files)

1. **AuditorStaking.move** - Manages auditor registration, staking, reputation
2. **AuditRegistry.move** - Stores immutable audit records on-chain
3. **ConsensusOracle.move** - Aggregates auditor proposals, reaches consensus

**Status:** All compiled successfully ✅

### ✅ CLI Tool (TypeScript)

- Commands: `install`, `audit`, `history`, `config`
- Aptos blockchain integration
- Configuration management
- Ready to test after deployment

**Status:** Code complete, needs testing ✅

---

## 🎯 What You Need to Build

### 1. Auditor Node Backend (Node.js)

**Purpose:** Service that runs 24/7, listens for audit requests, analyzes packages, submits results to blockchain

**Architecture:**

```
auditor-node/
├── src/
│   ├── index.ts              # Main entry point
│   ├── listener.ts           # Watch Aptos for audit requests
│   ├── fetcher.ts            # Download npm packages
│   ├── engine-client.ts      # Call AI engine (Shubasis's part)
│   ├── aptos-client.ts       # Submit proposals to blockchain
│   ├── state-manager.ts      # Track auditor status
│   └── config.ts             # Configuration
├── package.json
└── .env
```

**Key Functions:**

```typescript
// listener.ts - Watch for new audit requests
async function watchAuditRequests() {
  // Poll Aptos events or check ConsensusOracle
  // When new package needs audit, trigger analysis
}

// fetcher.ts - Download package from npm
async function fetchPackage(name: string, version: string) {
  // Download tarball from npm registry
  // Extract and cache locally
  // Return path to extracted files
}

// engine-client.ts - Call AI engine
async function analyzePackage(packagePath: string) {
  // Call Shubasis's AI engine API
  // Input: package files
  // Output: { risk_score, findings }

  // FOR NOW: Return mock data
  return {
    risk_score: Math.floor(Math.random() * 100),
    confidence: 0.85,
    findings: [],
  };
}

// aptos-client.ts - Submit to blockchain
async function submitProposal(
  packageName: string,
  version: string,
  riskScore: number
) {
  // Call ConsensusOracle::submit_proposal
  // Sign transaction with auditor's key
}
```

**Expected Behavior:**

1. Node starts, registers as auditor (if not already)
2. Continuously watches for audit requests
3. When request found:
   - Download package
   - Analyze with AI engine
   - Submit proposal to blockchain
4. Track reputation and audit count

---

### 2. Frontend Dashboard (React + CSS)

**Purpose:** Web interface for viewing audits, managing auditor node, checking reputation

**Pages:**

#### Page 1: Home / Live Audits

```
┌─────────────────────────────────────┐
│  ChainAudit Dashboard               │
├─────────────────────────────────────┤
│  📊 Live Audit Requests             │
│                                     │
│  lodash@4.17.21                     │
│  Status: 3/5 proposals submitted    │
│  [View Details]                     │
│                                     │
│  axios@1.6.0                        │
│  Status: Finalized - Risk: 12/100   │
│  [View Report]                      │
└─────────────────────────────────────┘
```

#### Page 2: Package Search

```
┌─────────────────────────────────────┐
│  Search Package                     │
│  [________________] [Search]        │
│                                     │
│  Results for "express":             │
│                                     │
│  express@4.18.2                     │
│  Risk: 8/100 (LOW)                  │
│  Audited: 2 days ago                │
│  [View Full Report]                 │
└─────────────────────────────────────┘
```

#### Page 3: Auditor Dashboard (Your Node)

```
┌─────────────────────────────────────┐
│  Your Auditor Node                  │
├─────────────────────────────────────┤
│  Status: 🟢 Active                  │
│  Staked: 100 APT                    │
│  Reputation: 156                    │
│  Total Audits: 47                   │
│                                     │
│  Recent Activity:                   │
│  - Audited lodash@4.17.21           │
│  - Audited axios@1.6.0              │
└─────────────────────────────────────┘
```

#### Page 4: Leaderboard

```
┌─────────────────────────────────────┐
│  Top Auditors                       │
├─────────────────────────────────────┤
│  1. 0x123... - 245 rep - 89 audits  │
│  2. 0x456... - 198 rep - 67 audits  │
│  3. 0x789... - 156 rep - 47 audits  │
└─────────────────────────────────────┘
```

**Tech Stack:**

- React (create-react-app or Vite)
- Plain CSS (no Tailwind since it doesn't work for you)
- Aptos Wallet Adapter for connecting wallet
- Fetch API for calling Aptos RPC

**Key Components:**

```
frontend/
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── PackageCard.js
│   │   ├── AuditorStats.js
│   │   └── RiskBadge.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Search.js
│   │   ├── Dashboard.js
│   │   └── Leaderboard.js
│   ├── utils/
│   │   └── aptos.js
│   └── styles/
│       └── main.css
└── package.json
```

---

## 🔗 Integration with Shubasis

### What Shubasis Delivers:

**AI Detection Engine** - Standalone service (Python/FastAPI probably)

**API Endpoint:** `POST /analyze`

**Request:**

```json
{
  "package_name": "lodash",
  "version": "4.17.21",
  "tarball_path": "/tmp/lodash-4.17.21.tgz"
}
```

**Response:**

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

### Your Integration Code:

```typescript
// auditor-node/src/engine-client.ts
export async function analyzePackage(
  packageName: string,
  version: string,
  tarballPath: string
) {
  // TODO: Replace with actual AI engine URL when Shubasis provides it
  const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${AI_ENGINE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        package_name: packageName,
        version: version,
        tarball_path: tarballPath,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("AI Engine error:", error);
    // Fallback: return safe score
    return {
      risk_score: 50,
      engine_confidence: 0.0,
      findings: [],
    };
  }
}
```

**For Now:** Mock this function to return random scores so you can develop independently.

---

## 📋 Step-by-Step Implementation Plan

### Week 1: Deploy & Test Contracts

**Day 1-2:**

- [ ] Deploy contracts to Aptos testnet
- [ ] Get testnet APT from faucet
- [ ] Initialize all 3 contracts
- [ ] Register yourself as an auditor

**Day 3-4:**

- [ ] Test CLI tool
- [ ] Manually submit proposals using Aptos CLI
- [ ] Verify consensus mechanism works
- [ ] Check audit appears in registry

### Week 2: Build Auditor Node

**Day 1-2:**

- [ ] Set up Node.js project structure
- [ ] Implement package fetcher (download from npm)
- [ ] Create mock AI engine client

**Day 3-4:**

- [ ] Implement Aptos client (submit proposals)
- [ ] Create listener (watch for audit requests)
- [ ] Test end-to-end: request → analyze → submit

**Day 5:**

- [ ] Add state management
- [ ] Add logging and error handling
- [ ] Test with multiple packages

### Week 3: Build Frontend

**Day 1-2:**

- [ ] Set up React project
- [ ] Create basic layout and routing
- [ ] Implement Aptos wallet connection

**Day 3-4:**

- [ ] Build package search page
- [ ] Build auditor dashboard
- [ ] Add CSS styling

**Day 5:**

- [ ] Build home page with live audits
- [ ] Build leaderboard
- [ ] Polish UI

### Week 4: Integration & Testing

**Day 1-2:**

- [ ] Integrate with Shubasis's AI engine
- [ ] Test full flow end-to-end
- [ ] Fix bugs

**Day 3-4:**

- [ ] Run multiple auditor nodes
- [ ] Test consensus with different scores
- [ ] Test dispute scenarios

**Day 5:**

- [ ] Documentation
- [ ] Demo preparation
- [ ] Final polish

---

## 🎯 Expected End Behavior

### User Flow 1: Developer Installing Package

```bash
$ chainaudit install lodash@4.17.21

⠋ Checking package audit status...
✓ Audit found!

📋 Audit Results:
──────────────────────────────────────────────────
  Risk Score:     8/100 (LOW)
  Audited by:     5 nodes
  Last audit:     3 hours ago
  Findings:       0
──────────────────────────────────────────────────

✓ Package passed security check

⠋ Installing lodash@4.17.21...
✓ Installed lodash@4.17.21
```

### User Flow 2: Requesting New Audit

```bash
$ chainaudit audit evil-package@1.0.0

⠋ Checking audit status...
ℹ No audit found for evil-package@1.0.0

📝 Audit Request
──────────────────────────────────────────────────
  This package needs to be audited.
  Auditor nodes will analyze the package and submit findings.
──────────────────────────────────────────────────

💡 Tip: Check back in a few minutes for results
```

**Behind the scenes:**

1. Auditor nodes detect new request
2. Download evil-package@1.0.0
3. Run AI analysis
4. Submit proposals (e.g., 85/100, 87/100, 82/100)
5. Consensus reached: 85/100 (HIGH RISK)
6. Result stored on-chain

```bash
$ chainaudit audit evil-package@1.0.0

✓ Audit found!

📋 Detailed Audit Report
══════════════════════════════════════════════════

Package:        evil-package@1.0.0
Risk Score:     85/100
Risk Category:  HIGH
Audited by:     5 independent nodes
Last audit:     2 minutes ago
Findings:       3

══════════════════════════════════════════════════

⚠️  HIGH RISK: This package may contain malicious code
   Review findings carefully before using
```

---

## 🛠️ Tools & Dependencies You Need

### Already Installed:

- ✅ Node.js v22.19.0
- ✅ npm v10.9.3
- ✅ Rust & Cargo
- ✅ Aptos CLI v7.11.1

### Need to Install:

**For CLI:**

```bash
cd cli
npm install
```

**For Auditor Node:**

```bash
cd auditor-node
npm init -y
npm install @aptos-labs/ts-sdk dotenv node-fetch
npm install -D typescript @types/node ts-node
```

**For Frontend:**

```bash
cd frontend
npx create-react-app . --template minimal
npm install @aptos-labs/wallet-adapter-react
```

---

## 📞 Questions to Clarify with Shubasis

1. **AI Engine API:**

   - What's the endpoint URL?
   - Request/response format?
   - Expected latency per package?

2. **Error Handling:**

   - What if analysis times out?
   - What if package is too large?
   - Fallback behavior?

3. **Testing:**

   - Can you provide mock/test endpoint?
   - Sample malicious packages for testing?

4. **Deployment:**
   - Where will AI engine be hosted?
   - Authentication needed?

---

## 🎉 Success Criteria

You're done when:

1. ✅ Contracts deployed and working on testnet
2. ✅ CLI can check audits and display results
3. ✅ Auditor node runs continuously
4. ✅ Node detects requests, analyzes, submits proposals
5. ✅ Consensus reached and stored on-chain
6. ✅ Frontend displays audits and auditor stats
7. ✅ Full demo works: request → audit → result

---

## 🚀 Start Here

**Right now, do this:**

1. Deploy contracts:

   ```bash
   cd contracts
   ./scripts/deploy.sh
   ```

2. Save the deployed address

3. Test CLI:

   ```bash
   cd cli
   npm install
   npm run build
   npm link
   chainaudit config --set-registry YOUR_ADDRESS
   chainaudit config --show
   ```

4. Read DEVELOPMENT_PLAN.md for detailed next steps

---

**You've got this! The foundation is solid. Now it's execution time.** 🚀
