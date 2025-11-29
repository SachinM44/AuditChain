# ChainAudit: Decentralized Code Dependency Security

**Protecting developers from supply chain attacks through decentralized security auditing**

## Problem Statement (One Sentence)
Every time you run `npm install`, you're trusting code you've never reviewedâ€”and attackers know it.

## Team
- **Maelstrom** 
  - Subhasis Jena (Founder, AI/ML Developer)
  - sachin SDE@RevenueHero

## Tracks
Security, Developer Tools, DeFi (audit marketplace)

---

## The Problem: Software Supply Chain Attacks Are Exploding

### Real Incidents
- **event-stream (2018)**: Malicious code in package with 2M weekly downloads
- **ua-parser-js (2021)**: Compromised maintainer account, crypto miner injected
- **node-ipc (2022)**: Maintainer intentionally added destructive code

### Key Statistics
- **245%** increase in supply chain attacks (2022-2023)
- **$4.45M** average cost per breach
- **80%** of developers don't audit dependencies before installation

### Why Current Solutions Fail
- **npm audit**: Only catches known CVEs (misses zero-days)
- **Snyk/WhiteSource**: Centralized, expensive ($500-5000/month), miss novel attacks
- **Manual review**: Impossible at scale (average project has 1000+ dependencies)

---

## Our Solution: ChainAudit - AI-Powered + Decentralized Security Auditing

### How It Works

#### 01. AI Detection Engine
- ML models scan package code for malicious patterns
- Detects obfuscation, suspicious network calls, crypto miners
- Compares published code to source repository

#### 02. Decentralized Verification Network
- Multiple independent auditor nodes analyze each package
- Consensus mechanism aggregates findings
- No single point of failure or censorship

#### 03. Immutable Audit Trail on Aptos
- All audit results stored on-chain
- Transparent methodology, verifiable results
- Historical record prevents manipulation

### Developer Experience Example
```
$ chainaudit install lodash
âœ“ Package audited by 5 nodes
âœ“ Risk score: 8/100 (LOW)
âœ“ Last audit: 2 hours ago
Installing lodash@4.17.21...
```

---

## Case Study: Real Attack - NPM 2.0 Compromise (September 2025)

### What Happened
- 40 packages compromised via stolen credentials
- Malicious code exfiltrated API keys and secrets
- Took hours for npm to respond and unpublish

### How ChainAudit Would Have Helped
- **Detection while Installing**: 3-8 minutes (vs hours)
- **Prevention**: 80%+ of installations blocked
- **Evidence**: Immutable audit trail for incident response

### What It Wouldn't Solve
- Account compromise prevention (need 2FA, security keys)
- 100% detection (sophisticated attackers can evade)
- Requires developer adoption to be effective

---

## Why Blockchain? And Why Aptos?

### Blockchain Solves Real Problems

| Problem | Traditional Solution | ChainAudit on Aptos |
|---------|-------------------|-------------------|
| Centralized control | One company decides what's "safe" | Decentralized consensus |
| Audit manipulation | Results can be altered/deleted | Immutable on-chain record |
| Trust in auditors | Must trust single vendor | Transparent, verifiable process |
| Subscription fees (conflicts of interest) | N/A | Token rewards for accurate audits |

### Why Aptos Specifically
- **Sub-second finality**: Real-time audits for developer workflow
- **Low transaction costs**: Store every package audit economically
- **Parallel execution**: Process multiple audits simultaneously
- **Move safety**: Financial logic (rewards, staking) needs formal verification

### Quote
> "ChainAudit isn't just a security toolâ€”it's a bridge. By solving a universal dev pain point with Aptos, we bring thousands of Web2 developers into the ecosystem, showing them Move's safety and Aptos' speed in action."

---

## Technical Architecture: Three-Layer System

### Layer 1: AI Detection Engine (Off-chain)
- **Static analysis**: AST parsing, control flow analysis
- **ML classifier**: Trained on 10K+ malicious packages
- **Behavioral detection**: Network calls, file system access, obfuscation
- **Source verification**: Compare npm package to GitHub repo

### Layer 2: Auditor Network (Hybrid)
- **Decentralized nodes** run detection engine independently
- **Stake APT** to become auditor (skin in the game)
- **Submit findings** to smart contract
- **Consensus**: 3/5 auditors must agree on risk score (CTF Approach)

### Layer 3: Aptos Smart Contracts
- **AuditRegistry**: Stores package audits immutably
- **ConsensusManager**: Aggregates auditor findings
- **RewardDistributor**: Pays auditors for accurate work
- **DisputeResolver**: Governance for contested audits

### Data Flow
Package submitted â†’ Auditors analyze â†’ Consensus reached â†’ Result stored on-chain â†’ Rewards distributed

---

## Smart Contract Design (Aptos-Specific)

### Key Contracts in Move

#### 1. AuditorStaking.move
- Auditors stake 100 APT minimum
- Slash stake for provably false audits

#### 2. ConsensusOracle.move (CTF-Inspired)
- Weighted voting based on auditor reputation
- 60% agreement threshold for finality
- Dispute period: 24 hours
- Disputed audits go to community governance (24hr)

#### 3. AuditRegistry.move
```
struct PackageAudit {
  package_name: String,
  version: String,
  risk_score: u8, // 0-100
  auditor_addresses: vector<address>,
  timestamp: u64,
  findings: vector<Finding>
}
```

### Reward Structure
- **Reward for accurate audit**: Dynamic, funded only from user/priority audit fees (0.01â€“0.1 APT per paid audit; free audits earn reputation only)
- **False positives**: Penalize reputation + slash stake
- **True positives**: Reward proportionally to severity

### Why Move Matters
- **Resource safety**: Prevents double-spending of rewards
- **Formal verification**: Ensures staking logic is correct
- **No reentrancy vulnerabilities**: In financial contracts

---

## 6-Step Roadmap: What We'll Build During Winter School

### Step 1: ML Model Foundation (Finished)
1. Collect dataset: 5K malicious packages, 20K benign
2. Train binary classifier (malicious vs safe)
3. Target: 85%+ accuracy, <5% false positives
4. **Deliverable**: Working detection engine

### Step 2: Aptos Smart Contracts (Finished - Unaudited)
1. Write AuditRegistry, AuditorStaking, ConsensusOracle in Move
2. Deploy to testnet
3. Unit tests for all financial logic
4. **Deliverable**: Audited contracts on testnet

### Step 3: Auditor Node + CLI (Ongoing)
1. Build auditor node software (runs detection, submits findings)
2. CLI tool: `chainaudit install`
3. Integration with npm workflow
4. **Deliverable**: End-to-end audit flow working

### Step 4: Network Testing
1. Simulate 10 auditor nodes
2. Process 100 real packages
3. Measure: consensus time, accuracy, cost per audit
4. **Deliverable**: Performance benchmarks

### Step 5: Business Model + GTM Strategy
1. Validate pricing model with 50+ developer surveys and early access signups
2. Partner with Winter School creators for community-driven content and adoption strategy
3. Benchmark positioning against Snyk/WhiteSource to define competitive advantage
4. **Deliverable**: Complete business plan + GTM roadmap

### Step 6: Demo + Polish
1. Live demonstration with malicious test package
2. UI dashboard showing audit history
3. Documentation and pitch deck
4. **Deliverable**: Complete presentation

### Developer Content Strategy
Partner with Winter School creators to produce developer-focused content:
- Short videos
- Threat breakdowns
- CLI demos
- To seed early adoption in npm and Web3 dev communities

---

## Business Model + Go-to-Market (Tentative)

### Revenue Streams

#### Phase 1: Freemium for Developers
- **Free**: CLI tool, 10 audits/day
- **Pro** ($20/month): Unlimited audits, CI/CD integration, IDE extension
- **Team** ($200/month): Shared quota, priority auditing
- *Note*: Rewards funded by paid user audits; no subsidized payouts for free users

#### Phase 2: Enterprise SaaS
- Private audit networks for internal packages
- Compliance reporting (SOC2, supply chain bills)
- Custom detection rules
- **Pricing**: $5K-50K/year per company

#### Phase 3: Data Licensing
- Aggregated threat intelligence API
- Security companies, researchers, academia
- **Pricing**: $10K-100K/year per license

### Token Economics
- **Auditors** earn APT for accurate audits
- **Users** pay small fees for priority auditing
- **Platform** takes 10% fee on auditor rewards
- *Note*: User (priority/paying) â†’ funds to platform â†’ platform â†’ split to auditors (minus platform fee)
- *Note*: No financial reward for free audits; only priority/enterprise

### GTM Strategy

**By end of Winter School, goals:**
- Validated GTM strategy with 3+ Aptos ecosystem partners
- Secured interest from 2+ security researchers to run auditor nodes
- Built a waitlist of 50+ developers for early access
- Connected with potential co-founders or advisors from creator track

**Launch Plans:**
- Launch at conferences: JSConf, Node.js Interactive
- Partner with package registries: npm, yarn, pnpm
- Security researcher outreach (they'll test and validate)

---

## Traction + Validation

### What We've Done So Far

**Technical Validation:**
- Prototype ML model: 82% accuracy on test set
- Analyzed 50 known malicious packages
- Identified patterns:
  - Obfuscation: 78%
  - Suspicious network calls: 64%
  - Crypto mining: 23%

**Market Validation:**
- Surveyed 40 developers in 3 Discord communities
- 85% said they'd try the tool
- 60% said they'd pay $20/month for Pro version
- Common feedback: "npm audit misses too much"

### What We Need from Winter School
- Smart contract architecture review (Move best practices)
- Consensus mechanism design (trade-offs: speed vs accuracy)
- Aptos-specific optimizations (parallel execution strategies)
- Security audit connections (formal verification partners)
- Go-to-market advice (how to reach developers)

---

## Competitive Advantages

| Advantage | Why It Matters |
|-----------|---------------|
| **AI/ML expertise** | Founder's core domain (not learning on the job) |
| **Decentralization moat** | Open auditor network vs proprietary blackboxes |
| **Developer-first** | Built by developers, for developers |
| **Aptos-native** | Not a port from Ethereum, designed for Aptos from day one |
| **Real problem** | Every developer faces this daily |

---

## Why This Matters for Aptos

- **Brings web2 developers to Aptos**: Security = universal concern
- **Demonstrates Move's safety features**: In production use case
- **Not another DeFi/NFT project**: Ecosystem diversity
- **Practical utility**: Not speculative

---

## Vision

> With ChainAudit, we're not just building a toolâ€”we're building a new standard for open-source security on Aptos. We aim to be among the top 3 projects fast-tracked into the Global Program, where we'll scale to protect millions of developers.

