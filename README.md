# ChainAudit - Decentralized NPM Package Security

## Project Structure

```
chainaudit/
├── contracts/          # Aptos Move smart contracts
├── auditor-node/       # Backend auditor node service (Node.js)
├── cli/                # chainaudit CLI tool
├── npm-plugin/         # npm integration plugin
├── frontend/           # Auditor dashboard (React + CSS)
└── docs/              # Documentation
```

## Setup

### Prerequisites

- Node.js v22+
- Rust & Cargo
- Aptos CLI v7.11.1+

### Quick Start

1. **Smart Contracts**

   ```bash
   cd contracts
   aptos move compile
   aptos move test
   ```

2. **Auditor Node**

   ```bash
   cd auditor-node
   npm install
   npm run dev
   ```

3. **CLI Tool**

   ```bash
   cd cli
   npm install
   npm link
   chainaudit --help
   ```

4. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Development Phases

- **Phase 1**: Smart contracts (AuditorStaking, AuditRegistry, ConsensusOracle)
- **Phase 2**: Auditor node backend
- **Phase 3**: CLI tool
- **Phase 4**: Frontend dashboard
- **Phase 5**: Integration testing

## Team

- Sachin: Web3 + Backend + Frontend
- Shubasis: AI/ML Detection Engine
