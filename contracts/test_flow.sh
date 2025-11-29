#!/bin/bash

# Test the full audit flow
export ADDR=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89

echo "📝 Testing ChainAudit Flow"
echo "=========================="
echo ""

echo "1. Checking consensus for lodash@4.17.21..."
aptos move run \
  --function-id "$ADDR::ConsensusOracle::check_consensus" \
  --args address:$ADDR string:lodash string:4.17.21 \
  --assume-yes

echo ""
echo "2. Checking if audit exists in registry..."
aptos move view \
  --function-id "$ADDR::AuditRegistry::audit_exists" \
  --args address:$ADDR string:lodash string:4.17.21

echo ""
echo "3. Getting audit details..."
aptos move view \
  --function-id "$ADDR::AuditRegistry::get_latest_audit" \
  --args address:$ADDR string:lodash string:4.17.21

echo ""
echo "Done!"
