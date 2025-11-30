# ChainAudit - Quick Start Guide (3 Hour MVP)

## 🚀 What We Built

A human-driven bounty hunting platform for npm package security where:

- **Package Owners** register packages and review findings
- **Auditors** find vulnerabilities and earn APT rewards
- **Developers** check security scores before installing

## 📁 Project Structure

```
chainaudit/
├── contracts/              # Aptos Move smart contracts
│   ├── PackageRegistry.move    # Package registration & management
│   └── FindingRegistry.move    # Vulnerability findings & reviews
├── frontend/              # React web application
│   ├── src/pages/            # All main pages
│   ├── src/components/       # Reusable components
│   └── src/config/           # Configuration
└── cli/                   # Command-line tool
    └── src/commands/         # CLI commands
```

## 🔧 Setup Instructions

### 1. Smart Contracts

```bash
cd contracts

# Install Aptos CLI if not installed
# https://aptos.dev/tools/install-cli/

# Compile contracts
aptos move compile

# Deploy to testnet
aptos move publish --named-addresses chainaudit=YOUR_ADDRESS

# Initialize contracts
aptos move run --function-id YOUR_ADDRESS::PackageRegistry::initialize
aptos move run --function-id YOUR_ADDRESS::FindingRegistry::initialize --args address:YOUR_ADDRESS
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

**Access at:** http://localhost:3000

### 3. CLI Tool

```bash
cd cli

# Install dependencies
npm install

# Build
npm run build

# Link globally (optional)
npm link

# Test commands
chainaudit install express
chainaudit packages
```

## 🎯 Key Features Implemented

### Smart Contracts ✅

- ✅ PackageRegistry - Register packages, manage bounty pools
- ✅ FindingRegistry - Submit findings, review & reward
- ✅ View functions for querying data
- ✅ Reward distribution logic

### Frontend ✅

- ✅ Petra Wallet integration
- ✅ Home page with stats
- ✅ Package registration form
- ✅ Owner dashboard
- ✅ Auditor dashboard
- ✅ Finding submission form
- ✅ Package explorer
- ✅ Responsive design

### CLI ✅

- ✅ `chainaudit install` - Check package security
- ✅ `chainaudit packages` - Browse packages
- ✅ `chainaudit register` - Register package (redirects to web)
- ✅ `chainaudit submit` - Submit finding (redirects to web)

## 🔄 User Flows

### Package Owner Flow

1. Visit https://chainaudit.app
2. Connect Petra wallet
3. Click "Register Package"
4. Fill form (npm name, tier, bounty)
5. Pay registration fee + bounty
6. View dashboard for pending findings
7. Review and accept/reject findings
8. Rewards distributed automatically

### Auditor Flow

1. Visit https://chainaudit.app/auditor
2. Connect Petra wallet
3. Browse available packages
4. Analyze code manually
5. Submit finding with details
6. Wait for owner review
7. Receive APT reward if accepted

### Developer Flow

1. Run: `chainaudit install express`
2. See security score and findings
3. Make informed decision
4. Install with confidence

## 💰 Economics

### Registration Fees

- Basic: 10 APT
- Popular: 25 APT
- Enterprise: 50 APT

### Rewards

- LOW: 1-5 APT
- MEDIUM: 5-20 APT
- HIGH: 20-50 APT
- CRITICAL: 50-100 APT

## 🧪 Testing

### Test Package Registration

```bash
# Via frontend
1. Connect wallet
2. Go to /register
3. Fill form with test data
4. Submit transaction
```

### Test Finding Submission

```bash
# Via frontend
1. Connect wallet
2. Go to /submit
3. Fill finding details
4. Submit transaction
```

### Test CLI

```bash
chainaudit install express
# Should query blockchain and show results
```

## 📝 Next Steps (Post-MVP)

### Phase 2 Enhancements

- [ ] Dispute resolution system
- [ ] Reputation multipliers
- [ ] Package version tracking
- [ ] Finding discussion threads
- [ ] Email notifications
- [ ] GitHub integration
- [ ] npm API integration for ownership verification

### Phase 3 Scale

- [ ] Support for other package managers (PyPI, RubyGems)
- [ ] IDE extensions (VS Code, WebStorm)
- [ ] Advanced analytics dashboard
- [ ] Auditor specialization system
- [ ] Package security badges
- [ ] API for third-party integrations

## 🐛 Known Limitations (MVP)

- Mock data in some frontend components (needs blockchain integration)
- No npm ownership verification yet
- No GitHub integration yet
- Simplified security score calculation
- No pagination for large lists
- No search/filter in some views

## 🔐 Security Notes

- All transactions require wallet signatures
- Smart contracts need audit before mainnet
- Rate limiting needed for production
- Input validation on all forms
- Gas optimization needed

## 📚 Documentation

- Full spec: `chaudit.md`
- Architecture: `ARCHITECTURE.md`
- Contract ABIs: Auto-generated after compilation

## 🎉 Demo Script

1. **Show Home Page** - Explain concept
2. **Register Package** - Connect wallet, register "test-package"
3. **Submit Finding** - Submit a test vulnerability
4. **Review Finding** - Accept and distribute reward
5. **CLI Demo** - Run `chainaudit install test-package`

## 💡 Tips

- Use testnet APT for testing (get from faucet)
- Keep private keys secure
- Test all flows before demo
- Have backup wallet with APT
- Prepare demo data in advance

## 🚀 Deployment

### Frontend

```bash
cd frontend
npm run build
# Deploy to Vercel/Netlify
```

### Contracts

```bash
cd contracts
aptos move publish --network mainnet
```

### CLI

```bash
cd cli
npm publish
```

---

**Built in 3 hours for the judges! 🏆**

This MVP demonstrates the core concept of human-driven npm security bounty hunting on Aptos blockchain.
