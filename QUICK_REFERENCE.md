# ChainAudit Quick Reference

## 🚀 Getting Started

### 1. Deploy Contracts

```bash
cd contracts
aptos move compile --dev
aptos move publish --dev --assume-yes
# Save the address that gets printed!
```

### 2. Initialize Contracts

```bash
# Replace YOUR_ADDRESS with the deployed address
export ADDR=YOUR_ADDRESS

# Initialize AuditorStaking
aptos move run \
  --function-id "$ADDR::AuditorStaking::initialize" \
  --assume-yes

# Initialize AuditRegistry
aptos move run \
  --function-id "$ADDR::AuditRegistry::initialize" \
  --assume-yes

# Initialize ConsensusOracle (needs 3 addresses: manager, staking, registry)
aptos move run \
  --function-id "$ADDR::ConsensusOracle::initialize" \
  --args address:$ADDR address:$ADDR address:$ADDR \
  --assume-yes
```

### 3. Register as Auditor

```bash
# Stake 100 APT to become an auditor
aptos move run \
  --function-id "$ADDR::AuditorStaking::register_auditor" \
  --args address:$ADDR u64:10000000000 \
  --assume-yes
```

### 4. Set Up CLI

```bash
cd cli
npm install
npm run build
npm link
chainaudit config --set-registry $ADDR
chainaudit config --show
```

## 📦 CLI Commands

### Check Package Audit

```bash
chainaudit audit lodash@4.17.21
```

### Install with Audit Check

```bash
chainaudit install axios@1.6.0
```

### Force Install (ignore risk)

```bash
chainaudit install risky-package@1.0.0 --force
```

### View History

```bash
chainaudit history express
```

### Configure

```bash
# Show config
chainaudit config --show

# Set risk threshold
chainaudit config --set-threshold 80

# Set policy (allow/warn/block)
chainaudit config --set-policy block

# Set registry address
chainaudit config --set-registry 0x123...
```

## 🔧 Aptos Commands

### Check Account Balance

```bash
aptos account list
```

### Get Testnet APT

```bash
aptos account fund-with-faucet --account default
```

### View Contract

```bash
aptos move view \
  --function-id "$ADDR::AuditRegistry::get_total_audits" \
  --args address:$ADDR
```

### Call Contract Function

```bash
aptos move run \
  --function-id "$ADDR::MODULE::function_name" \
  --args type:value \
  --assume-yes
```

## 🧪 Testing Contracts

### Compile

```bash
cd contracts
aptos move compile --dev
```

### Run Tests

```bash
aptos move test --dev
```

### View Specific Function

```bash
# Check if audit exists
aptos move view \
  --function-id "$ADDR::AuditRegistry::audit_exists" \
  --args address:$ADDR string:lodash string:4.17.21

# Get auditor info
aptos move view \
  --function-id "$ADDR::AuditorStaking::get_auditor_info" \
  --args address:$ADDR address:YOUR_AUDITOR_ADDR
```

## 🏗️ Project Structure

```
chainaudit/
├── contracts/          # Move smart contracts
│   ├── sources/
│   │   ├── AuditorStaking.move
│   │   ├── AuditRegistry.move
│   │   └── ConsensusOracle.move
│   └── Move.toml
│
├── cli/                # CLI tool
│   ├── src/
│   │   ├── commands/
│   │   ├── utils/
│   │   └── index.ts
│   └── package.json
│
├── auditor-node/       # Backend service (TODO)
├── frontend/           # React dashboard (TODO)
└── docs/              # Documentation
```

## 🐛 Troubleshooting

### Contract Compilation Fails

```bash
# Check Move.toml has correct address
# Make sure dependencies are up to date
cd contracts
rm -rf build/
aptos move compile --dev
```

### Transaction Fails

```bash
# Check account has enough APT
aptos account list

# Get more testnet APT
aptos account fund-with-faucet --account default

# Check function arguments are correct
# Check you're using the right address
```

### CLI Not Working

```bash
# Rebuild and relink
cd cli
npm run build
npm link

# Check config
chainaudit config --show

# Make sure registry address is set
chainaudit config --set-registry YOUR_ADDRESS
```

### Can't Find Audit

```bash
# Check if contract is initialized
aptos move view \
  --function-id "$ADDR::AuditRegistry::get_total_audits" \
  --args address:$ADDR

# If returns error, initialize first
aptos move run \
  --function-id "$ADDR::AuditRegistry::initialize" \
  --assume-yes
```

## 📝 Common Workflows

### Workflow 1: Deploy Fresh Contracts

```bash
cd contracts
aptos move publish --dev --assume-yes
export ADDR=<printed_address>
aptos move run --function-id "$ADDR::AuditorStaking::initialize" --assume-yes
aptos move run --function-id "$ADDR::AuditRegistry::initialize" --assume-yes
aptos move run --function-id "$ADDR::ConsensusOracle::initialize" \
  --args address:$ADDR address:$ADDR address:$ADDR --assume-yes
```

### Workflow 2: Submit Test Proposal

```bash
# Submit proposal for lodash@4.17.21 with risk score 15
aptos move run \
  --function-id "$ADDR::ConsensusOracle::submit_proposal" \
  --args address:$ADDR string:lodash string:4.17.21 u8:15 \
  --assume-yes

# Check consensus
aptos move run \
  --function-id "$ADDR::ConsensusOracle::check_consensus" \
  --args address:$ADDR string:lodash string:4.17.21 \
  --assume-yes

# View result
chainaudit audit lodash@4.17.21
```

### Workflow 3: Test Full Flow

```bash
# 1. Request audit (via CLI)
chainaudit audit test-package@1.0.0

# 2. Submit proposals (simulate 3 auditors)
for score in 20 22 18; do
  aptos move run \
    --function-id "$ADDR::ConsensusOracle::submit_proposal" \
    --args address:$ADDR string:test-package string:1.0.0 u8:$score \
    --assume-yes
done

# 3. Check consensus
aptos move run \
  --function-id "$ADDR::ConsensusOracle::check_consensus" \
  --args address:$ADDR string:test-package string:1.0.0 \
  --assume-yes

# 4. View result
chainaudit audit test-package@1.0.0
```

## 🔗 Useful Links

- Aptos Docs: https://aptos.dev
- Move Language: https://move-language.github.io/move/
- Aptos Explorer (Testnet): https://explorer.aptoslabs.com/?network=testnet
- Aptos Faucet: https://aptoslabs.com/testnet-faucet

## 💡 Tips

- Always use `--dev` flag when compiling/testing locally
- Save your deployed contract address in `.env` file
- Use `--assume-yes` to skip confirmation prompts
- Check Aptos Explorer to verify transactions
- Keep testnet APT balance above 1 APT for transactions

## 🆘 Need Help?

1. Check error message carefully
2. Verify contract address is correct
3. Ensure account has enough APT
4. Check function arguments match expected types
5. Look at Aptos Explorer for transaction details
6. Read the error code in contract (E_NOT_INITIALIZED, etc.)

---

**Pro Tip:** Save your deployed address in a file so you don't lose it!

```bash
echo "export CHAINAUDIT_ADDR=0x123..." >> ~/.zshrc
source ~/.zshrc
```
