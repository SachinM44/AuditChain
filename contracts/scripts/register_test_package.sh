#!/bin/bash

MODULE_ADDRESS="0x65ae7329234cdb84e5b0356d6b26e77b8ceac8e90f3d487f4326580349844018"
API_KEY="aptoslabs_JdmvyPx7xBm_54Fvbmk6AKE86vJgXJc6958sk5oHgk1vj"

echo "🎯 ChainAudit Package Registration Script"
echo "=========================================="
echo ""

# Check if package name is provided
if [ -z "$1" ]; then
    echo "Usage: ./register_test_package.sh <package-name> [tier]"
    echo "Example: ./register_test_package.sh axios 1"
    echo ""
    echo "Tiers: 0=Basic (10 APT), 1=Popular (25 APT), 2=Enterprise (50 APT)"
    exit 1
fi

PACKAGE_NAME="$1"
TIER="${2:-1}"  # Default to Popular (tier 1)

# Calculate fees based on tier
case $TIER in
    0)
        TIER_NAME="Basic"
        REG_FEE="1000000000"  # 10 APT
        ;;
    1)
        TIER_NAME="Popular"
        REG_FEE="2500000000"  # 25 APT
        ;;
    2)
        TIER_NAME="Enterprise"
        REG_FEE="5000000000"  # 50 APT
        ;;
    *)
        echo "❌ Invalid tier. Use 0, 1, or 2"
        exit 1
        ;;
esac

BOUNTY="2000000000"  # 20 APT minimum bounty
TOTAL_COST=$((($REG_FEE + $BOUNTY) / 100000000))

echo "📦 Package: $PACKAGE_NAME"
echo "🏷️  Tier: $TIER_NAME ($TIER)"
echo "💰 Registration Fee: $(($REG_FEE / 100000000)) APT"
echo "💰 Initial Bounty: $(($BOUNTY / 100000000)) APT"
echo "💰 Total Cost: $TOTAL_COST APT"
echo ""

# Check balance first
echo "Checking account balance..."
BALANCE=$(aptos account list --account $MODULE_ADDRESS --node-api-key $API_KEY 2>&1 | grep -A 1 "coin" | grep "value" | head -1 | grep -o '"[0-9]*"' | tr -d '"')

if [ -z "$BALANCE" ]; then
    echo "⚠️  Could not check balance. Proceeding anyway..."
else
    BALANCE_APT=$(($BALANCE / 100000000))
    echo "Current balance: $BALANCE_APT APT"
    
    if [ $BALANCE_APT -lt $TOTAL_COST ]; then
        echo ""
        echo "❌ Insufficient balance!"
        echo "You need $TOTAL_COST APT but only have $BALANCE_APT APT"
        echo ""
        echo "To get testnet APT, visit: https://aptos.dev/network/faucet"
        exit 1
    fi
fi

echo ""
echo "🚀 Registering package..."
echo ""

aptos move run \
    --function-id "${MODULE_ADDRESS}::PackageRegistry::register_package" \
    --args \
        address:$MODULE_ADDRESS \
        string:"$PACKAGE_NAME" \
        u8:$TIER \
        u64:$REG_FEE \
        u64:$BOUNTY \
    --assume-yes \
    --node-api-key $API_KEY

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Package registered successfully!"
    echo ""
    echo "🔍 Verify with CLI:"
    echo "   cd ../cli"
    echo "   chainaudit packages"
    echo "   chainaudit install $PACKAGE_NAME"
else
    echo ""
    echo "❌ Registration failed!"
fi
