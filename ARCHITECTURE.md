# ChainAudit System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVELOPER                                │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │  CLI Tool    │         │ IDE Extension│                     │
│  │ chainaudit   │         │   (Future)   │                     │
│  └──────┬───────┘         └──────────────┘                     │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          │ Query/Request Audit
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APTOS BLOCKCHAIN                            │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ AuditorStaking   │  │  AuditRegistry   │  │ ConsensusOracle│
│  │                  │  │                  │  │                │ │
│  │ - Register       │  │ - Store audits   │  │ - Aggregate    │ │
│  │ - Stake APT      │  │ - Query results  │  │   proposals    │ │
│  │ - Track rep      │  │ - Immutable      │  │ - Reach        │ │
│  │                  │  │   history        │  │   consensus    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
          ▲                                        │
          │                                        │
          │ Submit Proposal                        │ Watch Events
          │                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUDITOR NETWORK                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Auditor Node 1 (Your Node)                │    │
│  │                                                         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│    │
│  │  │ Listener │→ │ Fetcher  │→ │  Engine  │→ │ Submit ││    │
│  │  │          │  │          │  │  Client  │  │        ││    │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘│    │
│  │                                     │                  │    │
│  └─────────────────────────────────────┼──────────────────┘    │
│                                        │                        │
│  ┌────────────────────────────────────┼──────────────────┐    │
│  │              Auditor Node 2        │                  │    │
│  │                                    │                  │    │
│  │  [Same structure as Node 1]       │                  │    │
│  │                                    │                  │    │
│  └────────────────────────────────────┼──────────────────┘    │
│                                        │                        │
│  ┌────────────────────────────────────┼──────────────────┐    │
│  │              Auditor Node 3        │                  │    │
│  │                                    │                  │    │
│  │  [Same structure as Node 1]       │                  │    │
│  │                                    │                  │    │
│  └────────────────────────────────────┼──────────────────┘    │
│                                        │                        │
└────────────────────────────────────────┼────────────────────────┘
                                         │
                                         │ Call AI Engine
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  AI DETECTION ENGINE                             │
│                  (Shubasis's Part)                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Input: Package tarball                                  │  │
│  │                                                           │  │
│  │  1. Static Analysis (AST, call graphs)                   │  │
│  │  2. ML Classification (malicious probability)            │  │
│  │  3. Behavioral Detection (network, crypto mining)        │  │
│  │  4. Source Verification (GitHub vs npm diff)             │  │
│  │                                                           │  │
│  │  Output: { risk_score, confidence, findings[] }          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Your Part (Sachin)

#### 1. Smart Contracts (Aptos Move)

- **AuditorStaking**: Manage auditor registration, staking, reputation
- **AuditRegistry**: Store immutable audit records
- **ConsensusOracle**: Aggregate proposals, reach consensus

#### 2. CLI Tool (TypeScript)

- Query blockchain for audit results
- Display risk scores and findings
- Trigger new audit requests
- Configuration management

#### 3. Auditor Node (Node.js)

- **Listener**: Watch blockchain for audit requests
- **Fetcher**: Download npm packages
- **Engine Client**: Call AI engine (mock until Shubasis delivers)
- **Aptos Client**: Submit proposals to blockchain

#### 4. Frontend (React + CSS)

- Package search and audit display
- Auditor dashboard
- Live audit requests
- Leaderboard

### Shubasis's Part

#### AI Detection Engine (Python/FastAPI)

- Static code analysis
- ML-based malicious detection
- Behavioral pattern recognition
- Source verification
- Returns: risk score + findings

## Data Flow Example

### Scenario: Developer installs a package

```
1. Developer runs:
   $ chainaudit install lodash@4.17.21

2. CLI queries AuditRegistry on Aptos:
   - Does audit exist for lodash@4.17.21?

3a. If YES:
   - Fetch audit data (risk score, auditors, timestamp)
   - Display to developer
   - Proceed with npm install based on policy

3b. If NO:
   - Display "No audit found"
   - Optionally trigger audit request
   - Create request in ConsensusOracle

4. Auditor nodes detect new request:
   - Node 1, 2, 3 all see the request

5. Each node independently:
   - Downloads lodash@4.17.21 from npm
   - Calls AI engine for analysis
   - Receives risk score (e.g., 15/100)
   - Submits proposal to ConsensusOracle

6. ConsensusOracle:
   - Collects proposals: [15, 12, 18, 14, 16]
   - Calculates weighted average: 15
   - Checks consensus: 5/5 agree (within ±10)
   - Finalizes audit

7. ConsensusOracle calls AuditRegistry:
   - Store audit record permanently
   - Package: lodash@4.17.21
   - Risk: 15/100 (LOW)
   - Auditors: [0x1, 0x2, 0x3, 0x4, 0x5]
   - Timestamp: now

8. Developer runs again:
   $ chainaudit install lodash@4.17.21

   ✓ Audit found!
   Risk Score: 15/100 (LOW)
   ✓ Package passed security check
   Installing...
```

## Technology Stack

### Blockchain Layer

- **Aptos**: L1 blockchain
- **Move**: Smart contract language
- **Aptos CLI**: Deployment and testing

### Backend

- **Node.js**: Auditor node runtime
- **TypeScript**: Type-safe development
- **@aptos-labs/ts-sdk**: Blockchain interaction

### Frontend

- **React**: UI framework
- **Plain CSS**: Styling (no Tailwind)
- **Aptos Wallet Adapter**: Wallet connection

### AI/ML (Shubasis)

- **Python**: ML model runtime
- **FastAPI**: API server (probably)
- **scikit-learn/TensorFlow**: ML models

## Security Considerations

### Smart Contracts

- ✅ Immutable audit records (can't be altered)
- ✅ Stake-based auditor registration (skin in the game)
- ✅ Reputation system (penalize bad actors)
- ✅ Consensus mechanism (no single point of failure)

### Auditor Network

- ✅ Decentralized (multiple independent nodes)
- ✅ Transparent (all proposals on-chain)
- ✅ Verifiable (anyone can check results)

### AI Engine

- ⚠️ Deterministic output needed (same input → same output)
- ⚠️ Version control (track which model version)
- ⚠️ False positive handling (dispute mechanism)

## Scalability

### Current Design (MVP)

- ~10 auditor nodes
- ~100 packages audited
- ~1 audit per minute

### Future Optimizations

- Off-chain computation (only store results on-chain)
- Caching (don't re-audit unchanged packages)
- Parallel processing (multiple packages simultaneously)
- Incentive layer (prioritize high-value packages)

## Integration Points

### Between Your Parts

```
CLI ←→ Smart Contracts (read audits)
Auditor Node ←→ Smart Contracts (submit proposals)
Frontend ←→ Smart Contracts (display data)
```

### With Shubasis

```
Auditor Node ←→ AI Engine (analyze packages)
```

**Integration Contract:**

- Input: Package name, version, tarball path
- Output: Risk score (0-100), confidence (0-1), findings array
- Protocol: HTTP REST API (JSON)
- Timeout: 30 seconds max per package

## Deployment Architecture

### Development

```
Local Machine:
- Aptos Devnet (local blockchain)
- Auditor Node (localhost:3000)
- AI Engine (localhost:8000)
- Frontend (localhost:3001)
```

### Production

```
Aptos Testnet:
- Smart Contracts deployed

Cloud (AWS/GCP):
- 3+ Auditor Nodes (distributed)
- AI Engine (centralized for now)
- Frontend (static hosting)
```

---

This architecture ensures:

- ✅ Decentralization (no single point of failure)
- ✅ Transparency (all data on-chain)
- ✅ Security (stake-based, consensus-driven)
- ✅ Scalability (can add more auditor nodes)
- ✅ Developer-friendly (simple CLI interface)
