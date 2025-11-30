# ⛓️ ChainAudit

**The Web3 Standard for NPM Package Security**

Human-driven bounty hunting platform where developers find vulnerabilities in npm packages and earn APT rewards.

![ChainAudit Banner](https://via.placeholder.com/1200x300/667eea/ffffff?text=ChainAudit+-+Secure+npm+Ecosystem)

## 🎯 What is ChainAudit?

ChainAudit transforms npm security from reactive to proactive by creating a decentralized marketplace where:

- 🔍 **Auditors** (security experts) manually find vulnerabilities and earn APT tokens
- 👨‍💼 **Package Owners** register packages, review findings, and distribute rewards
- 👨‍💻 **Developers** check verified security scores before installing packages

**Think: GitHub Pull Requests + Bug Bounty Programs + Web3 Rewards**

## ✨ Key Features

### For Package Owners

- ✅ Register npm packages on Aptos blockchain
- ✅ Set bounty pools to incentivize auditors
- ✅ Review findings like GitHub PRs (accept/reject)
- ✅ Build credibility score and reputation
- ✅ Become "Web3 Security Standard" certified

### For Auditors

- ✅ Browse packages with bounty pools
- ✅ Submit detailed vulnerability reports
- ✅ Earn 1-100 APT per finding based on severity
- ✅ Build reputation as security expert
- ✅ Free to participate - no upfront costs

### For Developers

- ✅ Check security scores via CLI before installing
- ✅ View human-verified audit findings
- ✅ Make informed decisions
- ✅ Trust blockchain-verified audit history

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   ChainAudit Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (React)    CLI Tool    Smart Contracts (Move)  │
│  • Petra Wallet      • Install   • PackageRegistry       │
│  • Registration      • Packages  • FindingRegistry       │
│  • Dashboards        • Submit    • Rewards               │
│                                                           │
└─────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Aptos Blockchain│
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Aptos CLI
- Petra Wallet

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/chainaudit.git
cd chainaudit

# Run deployment script
./deploy.sh

# Or manually:

# 1. Compile contracts
cd contracts && aptos move compile

# 2. Start frontend
cd frontend && npm install && npm start

# 3. Build CLI
cd cli && npm install && npm run build && npm link
```

### Usage

#### Check Package Security (CLI)

```bash
chainaudit install express
```

Output:

```
✓ Package registered on ChainAudit
Security Score: 75/100

📊 Audit Summary:
  Total Findings: 5
  Accepted Findings: 3
  Bounty Pool: 50 APT
  Owner Credibility: 85/100

⚠️  This package has 3 accepted security findings
```

#### Register Package (Web)

1. Visit https://chainaudit.app/register
2. Connect Petra wallet
3. Enter package details
4. Pay registration fee + bounty
5. Package listed for auditing

#### Submit Finding (Web)

1. Visit https://chainaudit.app/submit
2. Connect Petra wallet
3. Fill vulnerability details
4. Submit with proof-of-concept
5. Wait for owner review
6. Receive APT reward if accepted

## 💰 Economics

### Registration Fees

| Tier       | Downloads/Month | Fee    | Benefits                         |
| ---------- | --------------- | ------ | -------------------------------- |
| Basic      | <100k           | 10 APT | Listed, basic analytics          |
| Popular    | 100k-1M         | 25 APT | Priority listing, verified badge |
| Enterprise | >1M             | 50 APT | Premium support, custom bounties |

### Reward Structure

| Severity | Base Reward | Example Issues                           |
| -------- | ----------- | ---------------------------------------- |
| CRITICAL | 50-100 APT  | RCE, auth bypass, data breach            |
| HIGH     | 20-50 APT   | SQL injection, XSS, privilege escalation |
| MEDIUM   | 5-20 APT    | Info disclosure, weak crypto, DoS        |
| LOW      | 1-5 APT     | Deprecated APIs, minor improvements      |

**Multipliers:**

- Package popularity: 1x-5x
- Auditor reputation: 1x-3x
- First finding bonus: 2x

## 📚 Documentation

- [Full Specification](./chaudit.md) - Complete system design
- [Quick Start Guide](./QUICK_START.md) - 3-hour MVP setup
- [Architecture](./ARCHITECTURE.md) - Technical details
- [API Documentation](./docs/API.md) - Contract interfaces

## 🛠️ Tech Stack

- **Blockchain**: Aptos (Move language)
- **Frontend**: React 18, Petra Wallet Adapter
- **CLI**: TypeScript, Commander.js, Chalk
- **Styling**: Custom CSS with gradients
- **APIs**: Aptos SDK, npm Registry API

## 📦 Project Structure

```
chainaudit/
├── contracts/              # Aptos Move smart contracts
│   ├── PackageRegistry.move
│   ├── FindingRegistry.move
│   └── Move.toml
├── frontend/              # React web application
│   ├── src/
│   │   ├── pages/        # Main pages
│   │   ├── components/   # Reusable components
│   │   ├── config/       # Configuration
│   │   └── styles/       # CSS files
│   └── package.json
├── cli/                   # Command-line tool
│   ├── src/
│   │   ├── commands/     # CLI commands
│   │   └── utils/        # Utilities
│   └── package.json
└── docs/                  # Documentation
```

## 🧪 Testing

### Test Contracts

```bash
cd contracts
aptos move test
```

### Test Frontend

```bash
cd frontend
npm test
```

### Test CLI

```bash
cd cli
npm test
```

## 🚢 Deployment

### Deploy Contracts

```bash
cd contracts
aptos move publish --network testnet
```

### Deploy Frontend

```bash
cd frontend
npm run build
# Deploy to Vercel/Netlify
```

### Publish CLI

```bash
cd cli
npm publish
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📊 Roadmap

### Phase 1: MVP (Current) ✅

- [x] Smart contracts (PackageRegistry, FindingRegistry)
- [x] Frontend with Petra wallet
- [x] CLI tool
- [x] Basic workflows

### Phase 2: Enhancement (Q1 2026)

- [ ] Dispute resolution system
- [ ] Reputation multipliers
- [ ] GitHub integration
- [ ] npm ownership verification
- [ ] Email notifications

### Phase 3: Scale (Q2 2026)

- [ ] Support PyPI, RubyGems
- [ ] IDE extensions (VS Code, WebStorm)
- [ ] Advanced analytics
- [ ] API for integrations
- [ ] Mobile app

## 🏆 Success Metrics

**Launch Targets (Month 1-3):**

- 50+ registered packages
- 100+ active auditors
- 500+ findings submitted
- 10,000+ APT distributed

**Growth Targets (Month 4-6):**

- 500+ packages
- 1,000+ auditors
- 5,000+ findings
- 100,000+ APT in ecosystem

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Aptos Foundation for blockchain infrastructure
- npm community for package ecosystem
- Security researchers for vulnerability insights
- Open source contributors

## 📞 Contact

- Website: https://chainaudit.app
- Twitter: [@chainaudit](https://twitter.com/chainaudit)
- Discord: [Join our community](https://discord.gg/chainaudit)
- Email: hello@chainaudit.app

---

**Built with ❤️ for the Web3 security community**

⭐ Star us on GitHub if you find this project useful!
