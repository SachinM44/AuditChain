# ChainAudit - Important Information

## 🔑 Contract Addresses

### Deployed Contracts (Testnet)

```
Address: 0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89

Modules:
- AuditorStaking
- AuditRegistry
- ConsensusOracle
```

### Explorer Link

https://explorer.aptoslabs.com/account/0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89?network=testnet

---

## 💰 Account Info

### Balance

```bash
aptos account list --query balance
# Current: ~1.8 APT
```

### Auditor Status

```bash
# Check if registered
aptos move view \
  --function-id "0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89::AuditorStaking::is_active" \
  --args address:0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89 \
         address:0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
```

### Get Private Key

```bash
aptos account list --query private_key
# ⚠️ KEEP THIS SECRET!
```

---

## 📦 Test Data

### Audits Created

#### 1. lodash@4.17.21

```
Risk Score: 15/100
Category: LOW
Auditors: 1
Status: Finalized
```

#### 2. evil-package@1.0.0

```
Risk Score: 85/100
Category: HIGH
Auditors: 1
Status: Finalized
```

---

## 🚀 Quick Commands

### Smart Contracts

#### Deploy

```bash
cd contracts
aptos move publish --dev --assume-yes
```

#### Initialize

```bash
export ADDR=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89

aptos move run --function-id "$ADDR::AuditorStaking::initialize" --assume-yes
aptos move run --function-id "$ADDR::AuditRegistry::initialize" --assume-yes
aptos move run --function-id "$ADDR::ConsensusOracle::initialize" \
  --args address:$ADDR address:$ADDR --assume-yes
```

#### Register as Auditor

```bash
aptos move run \
  --function-id "$ADDR::AuditorStaking::register_auditor" \
  --args address:$ADDR u64:100000000 \
  --assume-yes
```

#### Submit Proposal

```bash
aptos move run \
  --function-id "$ADDR::ConsensusOracle::submit_proposal" \
  --args address:$ADDR string:PACKAGE_NAME string:VERSION u8:RISK_SCORE \
  --assume-yes
```

#### Check Consensus

```bash
aptos move run \
  --function-id "$ADDR::ConsensusOracle::check_consensus" \
  --args address:$ADDR string:PACKAGE_NAME string:VERSION \
  --assume-yes
```

#### Query Audit

```bash
aptos move view \
  --function-id "$ADDR::AuditRegistry::get_latest_audit" \
  --args address:$ADDR string:PACKAGE_NAME string:VERSION
```

---

### CLI Tool

#### Configure

```bash
cd cli
./chainaudit.sh config --set-registry $ADDR
./chainaudit.sh config --set-policy block
./chainaudit.sh config --set-threshold 70
./chainaudit.sh config --show
```

#### Check Audit

```bash
./chainaudit.sh audit lodash@4.17.21
./chainaudit.sh audit evil-package@1.0.0
```

#### Install with Check

```bash
./chainaudit.sh install lodash@4.17.21
./chainaudit.sh install evil-package@1.0.0
./chainaudit.sh install risky-package@1.0.0 --force
```

---

### Auditor Node

#### Setup

```bash
cd auditor-node
npm install
cp .env.example .env
# Edit .env with your private key
npm run build
```

#### Test

```bash
npm run test-audit axios 1.6.0
npm run test-audit express 4.18.2
```

#### Run

```bash
npm start
```

---

## 🔧 Configuration Files

### CLI Config

```
Location: ~/.chainaudit/config.json

{
  "riskThreshold": 70,
  "policy": "block",
  "registryAddress": "0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89",
  "network": "testnet"
}
```

### Auditor Node Config

```
Location: auditor-node/.env

NETWORK=testnet
PRIVATE_KEY=your_private_key_here
AUDITOR_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
CONSENSUS_ORACLE_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
AUDITOR_STAKING_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
AI_ENGINE_URL=http://localhost:8000
POLL_INTERVAL_MS=10000
```

---

## 📊 Contract Settings

### Current Configuration (Testing)

```
Minimum Stake: 1 APT (change to 100 for production)
Minimum Proposals: 1 (change to 3 for production)
Consensus Threshold: 60%
Dispute Window: 24 hours
```

### Risk Categories

```
LOW:    0-29
MEDIUM: 30-69
HIGH:   70-100
```

---

## 🔗 Useful Links

### Aptos

- **Docs:** https://aptos.dev
- **Explorer:** https://explorer.aptoslabs.com/?network=testnet
- **Faucet:** https://aptos.dev/network/faucet
- **SDK:** https://github.com/aptos-labs/aptos-ts-sdk

### Move

- **Language:** https://move-language.github.io/move/
- **Book:** https://move-book.com/
- **Examples:** https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/move-examples

### npm

- **Registry:** https://registry.npmjs.org
- **Docs:** https://docs.npmjs.com

---

## 🐛 Common Issues & Solutions

### "Insufficient balance"

```bash
# Check balance
aptos account list --query balance

# Get more APT (if faucet works)
aptos account fund-with-faucet --account default \
  --faucet-url https://faucet.testnet.aptoslabs.com
```

### "Not an active auditor"

```bash
# Check status
aptos move view \
  --function-id "$ADDR::AuditorStaking::is_active" \
  --args address:$ADDR address:$ADDR

# Register if needed
aptos move run \
  --function-id "$ADDR::AuditorStaking::register_auditor" \
  --args address:$ADDR u64:100000000 \
  --assume-yes
```

### "Unauthorized publisher"

```bash
# Authorize ConsensusOracle
aptos move run \
  --function-id "$ADDR::AuditRegistry::add_authorized_publisher" \
  --args address:$ADDR address:$ADDR \
  --assume-yes
```

### "Already submitted"

- Same auditor can't submit twice for same package
- Use different account or wait for consensus

### "CLI not finding audit"

- Check registry address is configured
- Verify audit was finalized (check consensus)
- Try querying directly with aptos move view

---

## 📝 Environment Variables

### Required for Auditor Node

```bash
NETWORK=testnet
PRIVATE_KEY=<your_private_key>
CONSENSUS_ORACLE_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
AUDITOR_STAKING_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
```

### Optional

```bash
AI_ENGINE_URL=http://localhost:8000
POLL_INTERVAL_MS=10000
```

---

## 🔐 Security Notes

### Private Key

- ⚠️ Never commit to git
- ⚠️ Never share publicly
- ⚠️ Use separate accounts for testing
- ⚠️ Keep backups secure

### Smart Contracts

- ✅ Deployed with upgrade policy
- ✅ Authorization checks in place
- ✅ Resource-based stake management
- ⚠️ Not audited yet (for production, get audit)

---

## 📞 Support

### Documentation

- START_HERE.md - Quick start
- YOUR_REQUIREMENTS.md - Full requirements
- QUICK_REFERENCE.md - Command reference
- ARCHITECTURE.md - System design

### Troubleshooting

- Check error messages carefully
- Verify contract addresses
- Ensure sufficient APT balance
- Check account is registered as auditor

---

## 🎯 Quick Test Flow

### 1. Submit Proposal

```bash
export ADDR=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89

aptos move run \
  --function-id "$ADDR::ConsensusOracle::submit_proposal" \
  --args address:$ADDR string:test-pkg string:1.0.0 u8:25 \
  --assume-yes
```

### 2. Check Consensus

```bash
aptos move run \
  --function-id "$ADDR::ConsensusOracle::check_consensus" \
  --args address:$ADDR string:test-pkg string:1.0.0 \
  --assume-yes
```

### 3. Query Result

```bash
cd cli
./chainaudit.sh audit test-pkg@1.0.0
```

---

## 💾 Backup Important Data

### Save These:

- ✅ Contract address: 0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
- ✅ Private key: (from aptos account list)
- ✅ Account address: (same as contract address)
- ✅ .env files (but don't commit!)

### Export Account

```bash
# This creates a backup
aptos account list > account_backup.json
# ⚠️ Keep this file secure!
```

---

**KEEP THIS DOCUMENT HANDY! 📌**
