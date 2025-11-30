# 🎯 ChainAudit - Complete System Explanation

## 📋 Quick Answer to Your Questions

### Q: "What does our audit node do?"

**A:** The audit node is **NOT USED** in the new human-driven system! We removed it.

### Q: "What do our contracts do?"

**A:** We have 2 NEW contracts for the bounty hunting system:

1. **PackageRegistry** - Owners register packages
2. **FindingRegistry** - Auditors submit findings, owners review

### Q: "What does CLI do?"

**A:** CLI lets developers check package security before installing

---

## 🏗️ System Architecture (NEW Human-Driven Model)

```
┌─────────────────────────────────────────────────────────────┐
│                    CHAINAUDIT SYSTEM                         │
│                  (Human-Driven Bounty Hunting)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  1. FRONTEND (React Web App)                                 │
│     Location: frontend/                                      │
│     Purpose: User interface for all actors                   │
│                                                               │
│     Pages:                                                   │
│     ├─ /register     → Package owners register packages     │
│     ├─ /owner        → Owners manage packages & review      │
│     ├─ /submit       → Auditors submit findings             │
│     ├─ /auditor      → Auditors track earnings              │
│     └─ /packages     → Browse available packages            │
│                                                               │
│     Features:                                                │
│     ✅ Petra Wallet connection                              │
│     ✅ Transaction signing                                   │
│     ✅ Blockchain queries                                    │
│     ✅ Beautiful UI/UX                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Connects to
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. SMART CONTRACTS (Aptos Blockchain)                       │
│     Location: contracts/sources/                             │
│     Purpose: Store data, enforce rules, distribute rewards   │
│                                                               │
│     A. PackageRegistry.move                                  │
│        ├─ register_package()    → Owner registers package   │
│        ├─ add_to_bounty()       → Owner adds more APT       │
│        ├─ get_package_info()    → Query package details     │
│        └─ update_package_stats() → Update after review      │
│                                                               │
│     B. FindingRegistry.move                                  │
│        ├─ submit_finding()      → Auditor submits bug       │
│        ├─ review_finding()      → Owner accepts/rejects     │
│        ├─ get_finding()         → Query finding details     │
│        └─ get_package_findings_count() → Count findings     │
│                                                               │
│     Storage:                                                 │
│     ├─ All packages (name, owner, bounty, credibility)     │
│     ├─ All findings (title, severity, status, reward)      │
│     └─ All immutable on blockchain ✅                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Queried by
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. CLI TOOL (Command Line Interface)                        │
│     Location: cli/                                           │
│     Purpose: Developers check security before installing     │
│                                                               │
│     Commands:                                                │
│     ├─ chainaudit install <pkg>  → Check security score    │
│     ├─ chainaudit packages       → Browse packages          │
│     ├─ chainaudit register       → Register (redirects web) │
│     └─ chainaudit submit         → Submit (redirects web)   │
│                                                               │
│     How it works:                                            │
│     1. Developer runs: chainaudit install express            │
│     2. CLI queries blockchain (PackageRegistry)              │
│     3. Shows: Security score, findings, credibility          │
│     4. Developer decides: install or not                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎭 What We DON'T Use (Old AI System)

### ❌ Removed Components:

- **Auditor Node** (`auditor-node/`) - NOT USED
- **AI Detection Engine** - NOT USED
- **ConsensusOracle.move** - NOT USED
- **AuditorStaking.move** - NOT USED
- **AuditRegistry.move** - NOT USED (replaced by FindingRegistry)

### Why Removed?

We pivoted from **AI-automated** to **human-driven** bounty hunting!

---

## 👥 The 3 Actors & Their Tools

### 1. Package Owner (npm maintainer)

**Uses:** Frontend Web App

**Journey:**

```
1. Opens: https://chainaudit.app/register
2. Connects: Petra Wallet
3. Fills form:
   - Package name: "express"
   - Tier: Popular (25 APT)
   - Bounty: 50 APT
4. Clicks: "Register Package"
5. Signs transaction in Petra
6. ✅ Package registered on blockchain!

Later...
7. Opens: https://chainaudit.app/owner
8. Sees: Pending findings
9. Reviews: Finding #1 "SQL Injection"
10. Decides: Accept (30 APT reward)
11. Signs transaction
12. ✅ Auditor gets paid automatically!
```

**What Happens on Blockchain:**

```move
// Step 4: Registration
PackageRegistry::register_package(
    owner: 0x1234...5678,
    npm_name: "express",
    tier: 1,
    registration_fee: 25 APT,
    bounty_amount: 50 APT
)
// Stores package data permanently

// Step 10: Review
FindingRegistry::review_finding(
    owner: 0x1234...5678,
    finding_id: 1,
    accept: true,
    reward_amount: 30 APT
)
// Transfers 30 APT to auditor
// Updates package stats
```

### 2. Auditor (Security Expert)

**Uses:** Frontend Web App

**Journey:**

```
1. Opens: https://chainaudit.app/packages
2. Browses: Available packages
3. Selects: "express" (50 APT bounty)
4. Downloads: npm package manually
5. Analyzes: Code for vulnerabilities
6. Finds: SQL injection bug!
7. Opens: https://chainaudit.app/submit
8. Connects: Petra Wallet
9. Fills form:
   - Package: "express"
   - Severity: HIGH
   - Title: "SQL Injection in query builder"
   - Description: Detailed explanation
   - Proof of Concept: Exploit code
   - Suggested Fix: Use parameterized queries
10. Clicks: "Submit Finding"
11. Signs transaction (pays ~0.1 APT gas)
12. ✅ Finding submitted!

Later...
13. Opens: https://chainaudit.app/auditor
14. Sees: Finding #1 ACCEPTED ✅
15. Sees: Earned 30 APT! 💰
```

**What Happens on Blockchain:**

```move
// Step 10: Submission
FindingRegistry::submit_finding(
    auditor: 0x9876...5432,
    package_name: "express",
    severity: 2, // HIGH
    title: "SQL Injection...",
    description: "Detailed...",
    proof_of_concept: "Exploit...",
    suggested_fix: "Use parameterized..."
)
// Stores finding as PENDING
// Notifies package owner
```

### 3. Developer (Package User)

**Uses:** CLI Tool

**Journey:**

```
1. Wants to install: express
2. Runs: chainaudit install express
3. CLI queries blockchain
4. Sees output:
   ✓ Package registered on ChainAudit
   Security Score: 90/100

   📊 Audit Summary:
     Total Findings: 1
     Accepted Findings: 1
     Bounty Pool: 20 APT
     Owner Credibility: 85/100

   ⚠️  This package has 1 accepted security finding

5. Decides: "90/100 is good, I'll install"
6. Runs: npm install express
7. ✅ Installed with confidence!
```

**What Happens:**

```typescript
// CLI queries blockchain
const result = await client.view({
  function: "PackageRegistry::get_package_info",
  arguments: ["express"]
});

// Returns:
{
  exists: true,
  owner: "0x1234...",
  tier: 1,
  bounty_pool: 20 APT,
  credibility: 85,
  total_findings: 1,
  accepted_findings: 1
}

// CLI calculates security score
const score = 100 - (accepted_findings * 10);
// Shows to developer
```

---

## 🔄 Complete Data Flow

### Scenario: "express" Package Gets Audited

```
TIME: Day 1
┌─────────────────────────────────────────────────────────┐
│  PACKAGE OWNER                                           │
│  Registers "express" package                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  BLOCKCHAIN (PackageRegistry)                            │
│  Stores:                                                 │
│  {                                                       │
│    name: "express",                                     │
│    owner: 0x1234,                                       │
│    bounty_pool: 50 APT,                                 │
│    credibility: 50,                                     │
│    total_findings: 0                                    │
│  }                                                       │
└─────────────────────────────────────────────────────────┘

TIME: Day 2
┌─────────────────────────────────────────────────────────┐
│  AUDITOR                                                 │
│  Finds SQL injection bug                                 │
│  Submits finding                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  BLOCKCHAIN (FindingRegistry)                            │
│  Stores:                                                 │
│  {                                                       │
│    id: 1,                                               │
│    package: "express",                                  │
│    auditor: 0x9876,                                     │
│    severity: HIGH,                                      │
│    title: "SQL Injection...",                           │
│    status: PENDING,                                     │
│    reward: 0                                            │
│  }                                                       │
└─────────────────────────────────────────────────────────┘

TIME: Day 3
┌─────────────────────────────────────────────────────────┐
│  PACKAGE OWNER                                           │
│  Reviews finding                                         │
│  Accepts & sets reward: 30 APT                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  BLOCKCHAIN                                              │
│                                                           │
│  1. Updates Finding:                                     │
│     status: ACCEPTED                                     │
│     reward: 30 APT                                       │
│                                                           │
│  2. Transfers APT:                                       │
│     From: Package bounty pool                            │
│     To: Auditor wallet                                   │
│     Amount: 30 APT                                       │
│                                                           │
│  3. Updates Package:                                     │
│     bounty_pool: 20 APT (50 - 30)                       │
│     total_findings: 1                                    │
│     accepted_findings: 1                                 │
│     credibility: 85 (increased!)                         │
└─────────────────────────────────────────────────────────┘

TIME: Day 4
┌─────────────────────────────────────────────────────────┐
│  DEVELOPER                                               │
│  Runs: chainaudit install express                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  CLI queries BLOCKCHAIN                                  │
│  Gets all data                                           │
│  Shows security report                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 What's Stored on Blockchain

### PackageRegistry Storage:

```
Package "express":
├─ owner: 0x1234...5678
├─ npm_name: "express"
├─ tier: 1 (Popular)
├─ bounty_pool: 20 APT
├─ registration_fee_paid: 25 APT
├─ credibility_score: 85
├─ total_findings: 1
├─ accepted_findings: 1
├─ total_rewards_paid: 30 APT
├─ created_at: 1704067200
└─ status: ACTIVE
```

### FindingRegistry Storage:

```
Finding #1:
├─ id: 1
├─ package_name: "express"
├─ auditor: 0x9876...5432
├─ severity: 2 (HIGH)
├─ title: "SQL Injection in query builder"
├─ description: "Detailed explanation..."
├─ proof_of_concept: "Exploit code..."
├─ suggested_fix: "Use parameterized queries"
├─ status: 1 (ACCEPTED)
├─ reward_amount: 30 APT
├─ submitted_at: 1704067300
└─ reviewed_at: 1704067400
```

---

## 🎯 Summary

### What Each Component Does:

| Component           | Purpose                                 | Used By           |
| ------------------- | --------------------------------------- | ----------------- |
| **Frontend**        | UI for registration, submission, review | Owners & Auditors |
| **PackageRegistry** | Store package data, manage bounties     | Smart Contract    |
| **FindingRegistry** | Store findings, distribute rewards      | Smart Contract    |
| **CLI**             | Check security before installing        | Developers        |

### What We DON'T Use:

- ❌ Auditor Node (removed)
- ❌ AI Engine (removed)
- ❌ Old contracts (AuditRegistry, ConsensusOracle, AuditorStaking)

### The Flow:

1. **Owner** registers package → **PackageRegistry**
2. **Auditor** submits finding → **FindingRegistry**
3. **Owner** reviews finding → **FindingRegistry** (distributes reward)
4. **Developer** checks security → **CLI** queries **PackageRegistry**

**Everything is human-driven, transparent, and on-chain! 🎉**

---

## 🔧 Fixing Your Deployment Error

The error happens because you have OLD and NEW contracts mixed. Let me fix it:
