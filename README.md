# ChainAudit - Decentralized NPM Package Security

> Protect your dependencies with blockchain-powered security audits

[![Status](https://img.shields.io/badge/status-live-success)](https://explorer.aptoslabs.com/account/0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89?network=testnet)
[![Network](https://img.shields.io/badge/network-Aptos%20Testnet-blue)](https://aptos.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 What is ChainAudit?

ChainAudit is a decentralized security auditing system for npm packages. It uses blockchain technology to provide transparent, immutable, and consensus-driven security audits.

### The Problem

- 245% increase in supply chain attacks (2022-2023)
- Developers install packages without security verification
- Centralized audit solutions are expensive and opaque

### Our Solution

- **Decentralized**: Multiple independent auditor nodes
- **Transparent**: All audits stored on Aptos blockchain
- **Immutable**: Audit results can't be altered
- **Automated**: Continuous monitoring and auditing

## 🚀 Quick Start

### For Developers

```bash
# Install CLI
npm install -g chainaudit-cli

# Check a package
chainaudit audit lodash@4.17.21

# Install with security check
chainaudit install express@4.18.2
```

### For Auditors

```bash
# Clone repository
git clone https://github.com/yourusername/chainaudit
cd chainaudit

# Set up auditor node
cd auditor-node
npm install
cp .env.example .env
# Edit .env with your private key

# Run auditor node
npm start
```

## 📦 Project Structure

```
chainaudit/
├── contracts/          # Aptos Move smart contracts
├── cli/                # Command-line interface
├── auditor-node/       # Automated auditing service
└── frontend/           # Web dashboard
```

## 🏗️ Architecture

### Smart Contracts (Aptos)

- **AuditorStaking**: Manage auditor registration and reputation
- **AuditRegistry**: Store immutable audit records
- **ConsensusOracle**: Aggregate proposals and reach consensus

### CLI Tool

- Query blockchain for audit results
- Display risk scores and warnings
- Enforce security policies
- Integrate with npm workflow

### Auditor Node

- Download packages from npm
- Analyze with AI detection engine
- Submit proposals to blockchain
- Earn rewards for accurate audits

### Frontend

- Search for package audits
- View audit history
- Monitor auditor activity
- Beautiful modern UI

## 🎨 Features

- ✅ **Real-time Auditing**: Automated package analysis
- ✅ **Risk Scoring**: 0-100 risk score with LOW/MEDIUM/HIGH categories
- ✅ **Policy Enforcement**: Block, warn, or allow based on risk
- ✅ **Blockchain Storage**: Immutable audit records on Aptos
- ✅ **Consensus Mechanism**: Multiple auditors must agree
- ✅ **Beautiful UI**: Modern, clean interface
- ✅ **CLI Integration**: Works with existing npm workflow

## 📊 Live Stats

- **Contract Address**: `0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89`
- **Network**: Aptos Testnet
- **Total Audits**: 5+
- **Active Auditors**: 1+
- **Packages Scanned**: 5+

## 🔧 Development

### Prerequisites

- Node.js v22+
- Rust & Cargo
- Aptos CLI v7.11.1+

### Setup

```bash
# Install dependencies
npm install

# Smart Contracts
cd contracts
aptos move compile --dev
aptos move publish --dev

# CLI
cd cli
npm install
npm run build

# Auditor Node
cd auditor-node
npm install
npm run build

# Frontend
cd frontend
npm install
npm start
```

## 📖 Documentation

- [Quick Start](START_HERE.md)
- [Requirements](YOUR_REQUIREMENTS.md)
- [Architecture](ARCHITECTURE.md)
- [Command Reference](QUICK_REFERENCE.md)
- [Development Plan](DEVELOPMENT_PLAN.md)

## 🧪 Testing

### Test Smart Contracts

```bash
cd contracts
aptos move test --dev
```

### Test CLI

```bash
cd cli
./chainaudit.sh audit lodash@4.17.21
```

### Test Auditor Node

```bash
cd auditor-node
npm run test-audit axios 1.6.0
```

## 🌐 Live Demo

- **Frontend**: http://localhost:3000 (when running)
- **Explorer**: [View on Aptos Explorer](https://explorer.aptoslabs.com/account/0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89?network=testnet)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built on [Aptos](https://aptos.dev)
- Inspired by Linear, Vercel, and Stripe design
- Part of Aptos Winter School 2024

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

**⚠️ Note**: This is a testnet deployment. Do not use in production without proper security audits.

**Made with ❤️ by Sachin & Shubasis**
