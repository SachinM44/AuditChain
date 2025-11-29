#!/bin/bash

echo "🚀 Deploying ChainAudit Contracts to Aptos Testnet"
echo "=================================================="
echo ""

# Compile contracts
echo "📦 Compiling contracts..."
aptos move compile --dev

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Compilation successful"
echo ""

# Publish contracts
echo "📤 Publishing to testnet..."
aptos move publish --dev --assume-yes

if [ $? -ne 0 ]; then
    echo "❌ Publishing failed"
    exit 1
fi

echo ""
echo "✅ Contracts deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Save your contract address from above"
echo "2. Initialize contracts with: ./scripts/initialize.sh YOUR_ADDRESS"
echo "3. Configure CLI: chainaudit config --set-registry YOUR_ADDRESS"
echo ""
