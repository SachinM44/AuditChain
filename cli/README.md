# ChainAudit CLI

Command-line tool for checking npm package security using decentralized audits on Aptos blockchain.

## Installation

```bash
npm install -g chainaudit-cli
```

Or link locally for development:

```bash
cd cli
npm install
npm link
```

## Usage

### Install a package with audit check

```bash
chainaudit install lodash@4.17.21
```

### Check audit status

```bash
chainaudit audit axios@1.6.0
```

### View audit history

```bash
chainaudit history express
```

### Configure settings

```bash
# Show current config
chainaudit config --show

# Set risk threshold (0-100)
chainaudit config --set-threshold 80

# Set policy (allow, warn, block)
chainaudit config --set-policy block

# Set registry address
chainaudit config --set-registry 0x123...
```

## Configuration

Config file location: `~/.chainaudit/config.json`

Options:

- `riskThreshold`: Risk score threshold (0-100, default: 70)
- `policy`: Action on high risk packages
  - `allow`: Install without warning
  - `warn`: Show warning but proceed (default)
  - `block`: Block installation
- `registryAddress`: Aptos contract address for AuditRegistry
- `network`: Aptos network (testnet or mainnet)

## Development

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev -- install lodash@4.17.21

# Build
npm run build

# Run built version
npm start
```
