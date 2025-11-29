# Next Session - Quick Start Guide

## 🎯 Goal: Test Auditor Node & Start Frontend

---

## ⚡ Quick Recap

**What's Working:**

- ✅ Smart contracts deployed on testnet
- ✅ CLI tool fully functional
- ✅ Auditor node code complete

**What's Next:**

- 🚧 Test auditor node
- 📋 Build frontend dashboard

---

## 🚀 Step 1: Test Auditor Node (30 minutes)

### 1.1 Install Dependencies

```bash
cd auditor-node
npm install
```

### 1.2 Set Up Environment

```bash
cp .env.example .env
```

Edit `.env`:

```bash
NETWORK=testnet
PRIVATE_KEY=your_private_key_here  # Get from aptos account
AUDITOR_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
CONSENSUS_ORACLE_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
AUDITOR_STAKING_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
AI_ENGINE_URL=http://localhost:8000
POLL_INTERVAL_MS=10000
```

**To get your private key:**

```bash
# This will show your private key (keep it secret!)
aptos account list --query private_key
```

### 1.3 Build

```bash
npm run build
```

### 1.4 Test Manual Audit

```bash
npm run test-audit axios 1.6.0
```

**Expected Output:**

```
🧪 Testing audit for axios@1.6.0

📦 Processing audit request: axios@1.6.0
────────────────────────────────────────────────────────────
1️⃣  Downloading package from npm...
   ✅ Downloaded to: /tmp/chainaudit-cache/axios-1.6.0.tgz
2️⃣  Analyzing package with AI engine...
   ✅ Risk Score: 42/100
   ✅ Confidence: 87.3%
   ✅ Findings: 1
3️⃣  Submitting proposal to blockchain...
   ✅ Transaction: 0x...
4️⃣  Checking consensus...
   ✅ Consensus check triggered
────────────────────────────────────────────────────────────
✅ Successfully processed axios@1.6.0

✅ Test completed successfully!
```

### 1.5 Verify on CLI

```bash
cd ../cli
./chainaudit.sh audit axios@1.6.0
```

Should show the audit result!

---

## 🎨 Step 2: Build Frontend (2 hours)

### 2.1 Create React App

```bash
cd frontend
npx create-react-app . --template minimal
npm install
```

### 2.2 Install Dependencies

```bash
npm install @aptos-labs/wallet-adapter-react
```

### 2.3 Create Basic Structure

```
frontend/
├── src/
│   ├── App.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Search.js
│   │   └── Dashboard.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── PackageCard.js
│   │   └── RiskBadge.js
│   ├── utils/
│   │   └── aptos.js
│   └── styles/
│       └── main.css
└── package.json
```

### 2.4 Key Features to Build

**Home Page:**

- Show recent audits
- Display stats (total audits, auditors)

**Search Page:**

- Input for package name
- Display audit results
- Show risk score with colors

**Dashboard Page:**

- Your auditor node status
- Reputation score
- Recent activity

---

## 📋 Checklist for Next Session

### Auditor Node:

- [ ] Install dependencies
- [ ] Set up .env with private key
- [ ] Build successfully
- [ ] Run test-audit for axios
- [ ] Verify proposal submitted
- [ ] Check audit appears in CLI

### Frontend:

- [ ] Create React app
- [ ] Set up project structure
- [ ] Build Home page
- [ ] Build Search page
- [ ] Add basic styling
- [ ] Connect to Aptos

---

## 🔧 Troubleshooting

### "PRIVATE_KEY not set"

```bash
# Get your private key
aptos account list --query private_key
# Add to .env file
```

### "Not an active auditor"

```bash
# You're already registered, this should work
# If not, check:
aptos move view \
  --function-id "$ADDR::AuditorStaking::is_active" \
  --args address:$ADDR address:$ADDR
```

### "Transaction failed"

```bash
# Check balance
aptos account list --query balance
# Should have ~1.8 APT remaining
```

### "Package download failed"

- Check internet connection
- Try a different package
- Verify npm registry is accessible

---

## 🎯 Success Criteria

By end of next session:

- ✅ Auditor node tested and working
- ✅ Can trigger audits automatically
- ✅ Frontend shows basic audit results
- ✅ Can search for packages

---

## 📞 Questions to Ask Shubasis

1. What's the AI engine API endpoint?
2. What's the authentication method?
3. What's the expected response time?
4. Can we get a test endpoint?
5. What's the error handling strategy?

---

## 💡 Tips

- Keep the frontend simple at first
- Use plain CSS (no Tailwind)
- Focus on functionality over design
- Test each component as you build
- Use the CLI as reference for blockchain queries

---

## 🚀 Let's Go!

**Time Estimate:**

- Auditor node testing: 30 min
- Frontend setup: 30 min
- Frontend pages: 1 hour
- Testing & polish: 30 min
- **Total: 2.5 hours**

**You're 70% done. Let's finish this! 💪**
