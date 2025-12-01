# 🖥️ ChainAudit CLI - Complete Guide

## 🎯 What is the CLI?

The ChainAudit CLI is a **command-line tool** that developers use to **check package security BEFORE installing** npm packages. Think of it as a security scanner that runs in your terminal.

---

## 📦 Installation

```bash
# Global installation (for end users)
npm install -g chainaudit

# Or use directly from your project
cd cli
npm install
npm run build
`

---

## 🔧 Available Commands

### 1. `chainaudit install <package>`

**Purpose:** Check if a package is safe before installing it

**Usage:**

```bash
chainaudit install express
chainaudit install lodash@4.17.21
chainaudit install @types/node
```

**What it does:**

1. Queries the Aptos blockchain
2. Looks for the package in PackageRegistry
3. Gets security score and findings
4. Shows you the results
5. Asks if you want to proceed

**Example Output:**

```
🔍 Checking security for express...

✓ Package registered on ChainAudit
Security Score: 90/100

📊 Audit Summary:
  Total Findings: 1
  Accepted Findings: 1
  Bounty Pool: 20 APT
  Owner Credibility: 85/100

⚠️  This package has 1 accepted security finding

❓ Proceed with installation? (y/n)
```

---

### 2. `chainaudit packages`

**Purpose:** Browse all packages available for auditing

**Usage:**

```bash
chainaudit packages
```

**What it does:**

1. Shows list of registered packages
2. Displays bounty pools
3. Shows finding counts
4. Helps auditors find packages to audit

**Example Output:**

```
📦 Available Packages for Auditing

• express
  Tier: Popular | Bounty: 50 APT | Findings: 5

• lodash
  Tier: Enterprise | Bounty: 100 APT | Findings: 2

• axios
  Tier: Popular | Bounty: 30 APT | Findings: 3

💡 Tip: Visit https://chainaudit.app/packages for full details
```

---

### 3. `chainaudit register <package>`

**Purpose:** Register a package (redirects to web)

**Usage:**

```bash
chainaudit register my-package --bounty 50
```

**What it does:**

1. Shows registration info
2. Calculates costs
3. Redirects to web interface
4. (Web interface handles actual registration)

**Example Output:**

```
📦 Registering package: my-package

Tier: Basic
Registration Fee: 10 APT
Initial Bounty: 50 APT
Total Cost: 60 APT

⚠️  Please use the web interface to complete registration:
   https://chainaudit.app/register

The web interface provides wallet connection and transaction signing.
```

---

### 4. `chainaudit submit <package>`

**Purpose:** Submit a finding (redirects to web)

**Usage:**

```bash
chainaudit submit express --severity HIGH
```

**What it does:**

1. Shows submission info
2. Displays potential rewards
3. Redirects to web interface
4. (Web interface handles actual submission)

**Example Output:**

```
🔍 Submit Finding for: express

Severity: HIGH
Potential Reward: 20-50 APT

⚠️  Please use the web interface to submit your finding:
   https://chainaudit.app/submit

The web interface provides:
  • Wallet connection
  • Rich text editor for detailed reports
  • Code editor for proof-of-concept
  • Transaction signing
```

---

## 🔍 How It Works Internally

### Architecture:

```
┌─────────────────────────────────────────────────────┐
│  Developer runs: chainaudit install express         │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  CLI (cli/src/commands/install.ts)                  │
│                                                      │
│  1. Parse command: package = "express"              │
│  2. Import AptosClient                              │
│  3. Connect to blockchain                           │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  Aptos Client (cli/src/utils/aptos-client.ts)      │
│                                                      │
│  const client = new AptosClient(NODE_URL);          │
│  const result = await client.view({                 │
│    function: "PackageRegistry::get_package_info",   │
│    arguments: [MODULE_ADDRESS, "express"]           │
│  });                                                 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  Aptos Blockchain (Testnet)                         │
│                                                      │
│  Smart Contract: PackageRegistry                    │
│  Function: get_package_info("express")              │
│                                                      │
│  Returns:                                            │
│  {                                                   │
│    exists: true,                                    │
│    owner: "0x1234...",                              │
│    tier: 1,                                         │
│    bountyPool: 20 APT,                              │
│    credibility: 85,                                 │
│    totalFindings: 1,                                │
│    acceptedFindings: 1                              │
│  }                                                   │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  CLI Processes Data                                  │
│                                                      │
│  // Calculate security score                        │
│  const score = 100 - (acceptedFindings × 10);      │
│  // score = 100 - (1 × 10) = 90                    │
│                                                      │
│  // Format output with colors                       │
│  console.log(chalk.green("✓ Package safe"));       │
│  console.log(`Security Score: ${score}/100`);      │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  Developer Sees Output                               │
│                                                      │
│  ✓ Package registered on ChainAudit                │
│  Security Score: 90/100                             │
│  ...                                                 │
└─────────────────────────────────────────────────────┘
```

---

## 📁 CLI File Structure

```
cli/
├── src/
│   ├── index.ts              # Main entry point
│   ├── commands/
│   │   ├── install.ts        # Check package security
│   │   ├── packages.ts       # Browse packages
│   │   ├── register.ts       # Register package
│   │   ├── submit.ts         # Submit finding
│   │   ├── audit.ts          # Detailed audit info
│   │   └── config.ts         # Configuration
│   └── utils/
│       ├── aptos-client.ts   # Blockchain connection
│       └── config.ts         # Constants & settings
├── dist/                     # Compiled JavaScript
├── package.json
└── tsconfig.json
```

---

## 🔑 Key Files Explained

### 1. `src/index.ts` - Main Entry Point

```typescript
#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program.name("chainaudit").description("ChainAudit CLI").version("1.0.0");

// Register all commands
program
  .command("install <package>")
  .description("Check package security")
  .action(installCommand);

program.parse();
```

**What it does:**

- Sets up CLI framework (Commander.js)
- Registers all available commands
- Parses user input
- Routes to correct command handler

---

### 2. `src/commands/install.ts` - Security Check

```typescript
export async function installCommand(packageName: string) {
  const spinner = ora("Checking security...").start();

  try {
    // Connect to blockchain
    const client = getAptosClient();

    // Query package info
    const result = await client.view({
      payload: {
        function: `${MODULE_ADDRESS}::PackageRegistry::get_package_info`,
        functionArguments: [MODULE_ADDRESS, packageName],
      },
    });

    // Process results
    const [
      exists,
      owner,
      tier,
      bountyPool,
      credibility,
      totalFindings,
      acceptedFindings,
    ] = result;

    // Calculate score
    const score = 100 - Number(acceptedFindings) * 10;

    // Display results
    console.log(chalk.green(`✓ Security Score: ${score}/100`));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
  }
}
```

**What it does:**

- Shows loading spinner
- Queries blockchain for package data
- Calculates security score
- Displays formatted results
- Handles errors gracefully

---

### 3. `src/utils/aptos-client.ts` - Blockchain Connection

```typescript
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

let client: Aptos | null = null;

export function getAptosClient(): Aptos {
  if (!client) {
    const config = new AptosConfig({
      network: Network.TESTNET,
      fullnode: NODE_URL,
    });
    client = new Aptos(config);
  }
  return client;
}
```

**What it does:**

- Creates singleton Aptos client
- Connects to testnet
- Reuses connection for efficiency
- Provides clean API for commands

---

### 4. `src/utils/config.ts` - Configuration

```typescript
export const NETWORK = "testnet";
export const MODULE_ADDRESS = "0x65ae7329...";
export const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
```

**What it does:**

- Stores deployed contract address
- Defines network settings
- Centralizes configuration
- Easy to update for mainnet

---

## 🎯 Real-World Usage Examples

### Example 1: Developer Installing Package

```bash
# Developer wants to install express
$ npm install express

# Better: Check security first!
$ chainaudit install express

🔍 Checking security for express...
✓ Package registered on ChainAudit
Security Score: 90/100

📊 Audit Summary:
  Total Findings: 1
  Accepted Findings: 1
  Bounty Pool: 20 APT
  Owner Credibility: 85/100

⚠️  This package has 1 accepted security finding
Run 'chainaudit audit express' for details

❓ Proceed with installation? (y/n) y

# Now install with confidence
$ npm install express
```

---

### Example 2: Auditor Finding Packages

```bash
# Auditor wants to find packages to audit
$ chainaudit packages

📦 Available Packages for Auditing

• express
  Tier: Popular | Bounty: 50 APT | Findings: 5

• lodash
  Tier: Enterprise | Bounty: 100 APT | Findings: 2

• my-new-package
  Tier: Basic | Bounty: 20 APT | Findings: 0  ← New!

# Auditor picks "my-new-package" (no findings yet = opportunity!)
# Goes to web interface to submit finding
```

---

### Example 3: CI/CD Integration

```bash
# In your CI/CD pipeline (GitHub Actions, etc.)

name: Security Check
on: [push]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install ChainAudit CLI
        run: npm install -g chainaudit

      - name: Check dependencies
        run: |
          for pkg in $(cat package.json | jq -r '.dependencies | keys[]'); do
            chainaudit install $pkg || exit 1
          done
```

---

## 🔄 How CLI Integrates with System

```
┌─────────────────────────────────────────────────────┐
│  COMPLETE ECOSYSTEM                                  │
└─────────────────────────────────────────────────────┘

1. Package Owner (Web)
   ├─> Registers package
   └─> Sets bounty pool

2. Auditor (Web)
   ├─> Finds vulnerability
   └─> Submits finding

3. Owner (Web)
   ├─> Reviews finding
   └─> Accepts & pays reward

4. Developer (CLI) ← YOU ARE HERE
   ├─> Runs: chainaudit install express
   ├─> Sees: Security score, findings
   └─> Decides: Install or not

5. Blockchain (Aptos)
   └─> Stores everything immutably
```

---

## 🚀 Building & Testing CLI

### Build:

```bash
cd cli
npm install
npm run build
```

### Test Locally:

```bash
# Run without installing globally
node dist/index.js packages
node dist/index.js install express
```

### Install Globally:

```bash
npm link
chainaudit --help
```

### Publish to npm:

```bash
npm publish
# Then anyone can: npm install -g chainaudit
```

---

## 🎯 Summary

### What CLI Does:

- ✅ Checks package security before installation
- ✅ Queries blockchain for audit data
- ✅ Shows security scores and findings
- ✅ Helps developers make informed decisions
- ✅ Integrates into existing npm workflow

### What CLI Doesn't Do:

- ❌ Doesn't register packages (use web)
- ❌ Doesn't submit findings (use web)
- ❌ Doesn't review findings (use web)
- ❌ Doesn't require wallet (read-only)

### Why CLI is Important:

- **Developers** use it daily
- **Integrates** with existing workflow
- **No friction** - just one command
- **Shows value** of ChainAudit immediately
- **Drives adoption** of the platform

---

**The CLI is the bridge between ChainAudit and everyday developers! 🌉**
