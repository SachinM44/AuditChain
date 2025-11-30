#!/bin/bash

echo "🚀 ChainAudit Deployment Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Compile Smart Contracts
echo -e "${YELLOW}Step 1: Compiling Smart Contracts...${NC}"
cd contracts
if aptos move compile; then
    echo -e "${GREEN}✓ Contracts compiled successfully${NC}"
else
    echo -e "${RED}✗ Contract compilation failed${NC}"
    exit 1
fi
echo ""

# Step 2: Build Frontend
echo -e "${YELLOW}Step 2: Building Frontend...${NC}"
cd ../frontend
if npm install && npm run build; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi
echo ""

# Step 3: Build CLI
echo -e "${YELLOW}Step 3: Building CLI...${NC}"
cd ../cli
if npm install && npm run build; then
    echo -e "${GREEN}✓ CLI built successfully${NC}"
else
    echo -e "${RED}✗ CLI build failed${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ All components built successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy contracts: cd contracts && aptos move publish"
echo "2. Start frontend: cd frontend && npm start"
echo "3. Test CLI: cd cli && npm link && chainaudit --help"
echo ""
