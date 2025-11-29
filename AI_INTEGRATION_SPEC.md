# ChainAudit - AI/ML Integration Specification

**For:** Shubasis (AI/ML Developer)  
**From:** Sachin (Web3/Backend/Frontend Developer)  
**Date:** November 29, 2024  
**Status:** Ready for AI Engine Integration

---

## 📋 Executive Summary

We've built a **complete, working decentralized npm package security auditing system**. Everything is functional EXCEPT the AI detection engine, which is your part. This document explains:

1. What we've built so far
2. What we need from you
3. How to integrate your AI engine
4. Expected input/output format
5. Testing procedures

---

## 🏗️ What We've Built (Your Integration Points)

### System Architecture

```
Developer
    ↓
  CLI Tool
    ↓
Aptos Blockchain (Smart Contracts)
    ↓
Auditor Node ← YOUR AI ENGINE GOES HERE
    ↓
Package Analysis
    ↓
Risk Score Submission
```

### Components Complete:

1. **Smart Contracts (Aptos)** ✅

   - Stores audit results immutably
   - Manages consensus between auditors
   - Tracks auditor reputation

2. **Auditor Node (Node.js)** ✅

   - Downloads npm packages
   - **Calls AI engine (currently mocked)**
   - Submits results to blockchain

3. **CLI Tool** ✅

   - Queries blockchain
   - Displays risk scores
   - Enforces security policies

4. **Frontend** ✅
   - Beautiful UI
   - Shows audit results
   - Real-time blockchain data

---

## 🎯 What We Need From You

### AI Detection Engine

A **standalone service or library** that analyzes npm packages and returns a risk assessment.

### Core Requirements:

1. **Input**: npm package (name, version, or tarball path)
2. **Output**: Risk score (0-100) + findings
3. **Accuracy**: ≥85% on balanced test set
4. **Speed**: <30 seconds per package
5. **Deterministic**: Same package → same score

---

## 📥 Input Specification

### Option 1: Package Metadata (Preferred)

```json
{
  "package_name": "lodash",
  "version": "4.17.21",
  "tarball_url": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz"
}
```

### Option 2: Local Tarball Path

```json
{
  "package_name": "lodash",
  "version": "4.17.21",
  "tarball_path": "/tmp/chainaudit-cache/lodash-4.17.21.tgz"
}
```

### Our Auditor Node Will Provide:

- Package name
- Version
- Downloaded tarball path (we handle the download)
- Extracted files directory (if needed)

---

## 📤 Output Specification

### Required Format (JSON):

```json
{
  "risk_score": 15,
  "engine_confidence": 0.92,
  "findings": [
    {
      "type": "network",
      "severity": "LOW",
      "description": "HTTP request to known CDN",
      "file": "lib/fetch.js",
      "line": 42
    },
    {
      "type": "obfuscation",
      "severity": "HIGH",
      "description": "Heavily obfuscated code detected",
      "file": "index.js",
      "line": 15
    }
  ]
}
```

### Field Specifications:

#### `risk_score` (required)

- **Type**: Integer
- **Range**: 0-100
- **Meaning**:
  - 0-29: LOW risk (safe to use)
  - 30-69: MEDIUM risk (review recommended)
  - 70-100: HIGH risk (dangerous, block installation)

#### `engine_confidence` (required)

- **Type**: Float
- **Range**: 0.0-1.0
- **Meaning**: How confident the AI is in its assessment
- **Example**: 0.92 = 92% confident

#### `findings` (required, can be empty array)

- **Type**: Array of Finding objects
- **Purpose**: Specific security issues detected

#### Finding Object:

```typescript
{
  type: "obfuscation" | "network" | "crypto_mining" | "tampering" | "malware" | "backdoor",
  severity: "LOW" | "MEDIUM" | "HIGH",
  description: string,  // Human-readable explanation
  file: string,         // Relative path to file
  line: number          // Line number (0 if unknown)
}
```

---

## 🔍 What to Detect

### Priority 1 (Must Detect):

1. **Obfuscation**

   - Heavily minified/obfuscated code
   - Encoded payloads (base64, hex)
   - String concatenation patterns
   - Dynamic eval usage

2. **Suspicious Network Activity**

   - HTTP/HTTPS requests to unknown domains
   - Data exfiltration patterns
   - Credential harvesting
   - Unusual API calls

3. **Crypto Mining**

   - CPU-intensive loops
   - WebAssembly crypto miners
   - Known mining library signatures

4. **Source Tampering**
   - Differences between GitHub source and npm package
   - Hidden files in package
   - Unexpected binaries

### Priority 2 (Nice to Have):

5. **Malware Signatures**

   - Known malicious code patterns
   - Backdoor implementations
   - Remote code execution attempts

6. **Dependency Confusion**
   - Typosquatting detection
   - Suspicious package names

---

## 🧪 Test Cases

### We Need Your Engine to Handle:

#### Test Case 1: Clean Package (lodash@4.17.21)

```
Expected Output:
{
  "risk_score": 10-20,
  "engine_confidence": 0.85-0.95,
  "findings": []
}
```

#### Test Case 2: Suspicious Package (event-stream@3.3.6)

```
Expected Output:
{
  "risk_score": 70-90,
  "engine_confidence": 0.80-0.95,
  "findings": [
    {
      "type": "obfuscation",
      "severity": "HIGH",
      "description": "Heavily obfuscated code in flatmap-stream dependency",
      "file": "node_modules/flatmap-stream/index.js",
      "line": 1
    }
  ]
}
```

#### Test Case 3: Malicious Package

```
Expected Output:
{
  "risk_score": 85-100,
  "engine_confidence": 0.90-1.0,
  "findings": [
    {
      "type": "network",
      "severity": "HIGH",
      "description": "Sends environment variables to unknown server",
      "file": "index.js",
      "line": 23
    },
    {
      "type": "obfuscation",
      "severity": "HIGH",
      "description": "Base64 encoded payload",
      "file": "lib/payload.js",
      "line": 5
    }
  ]
}
```

---

## 🔌 Integration Options

### Option 1: REST API (Recommended)

**Your Service:**

```
POST http://localhost:8000/analyze
Content-Type: application/json

{
  "package_name": "lodash",
  "version": "4.17.21",
  "tarball_path": "/tmp/lodash-4.17.21.tgz"
}

Response:
{
  "risk_score": 15,
  "engine_confidence": 0.92,
  "findings": [...]
}
```

**Our Integration:**

```typescript
// auditor-node/src/ai-engine-client.ts
async function analyzePackage(packageName, version, tarballPath) {
  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_name: packageName,
      version: version,
      tarball_path: tarballPath,
    }),
  });

  return await response.json();
}
```

### Option 2: Python Library

**Your Library:**

```python
# chainaudit_ai/__init__.py
def analyze_package(package_name: str, version: str, tarball_path: str) -> dict:
    # Your ML model here
    return {
        "risk_score": 15,
        "engine_confidence": 0.92,
        "findings": [...]
    }
```

**Our Integration:**

```typescript
// We'll call your Python script
const { spawn } = require("child_process");

async function analyzePackage(packageName, version, tarballPath) {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", [
      "analyze.py",
      packageName,
      version,
      tarballPath,
    ]);

    let output = "";
    python.stdout.on("data", (data) => (output += data));
    python.on("close", () => resolve(JSON.parse(output)));
  });
}
```

### Option 3: Docker Container

**Your Container:**

```dockerfile
FROM python:3.9
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["python", "server.py"]
```

**Our Integration:**

```bash
docker run -p 8000:8000 chainaudit-ai
# Then use REST API
```

---

## 📊 Current Mock Implementation

### What We're Using Now:

```typescript
// auditor-node/src/ai-engine-client.ts
function mockAnalysis(packageName: string, version: string) {
  // Simple hash-based deterministic score
  const hash = simpleHash(packageName + version);
  const riskScore = hash % 100;

  const findings = [];
  if (riskScore > 70) {
    findings.push({
      type: "obfuscation",
      severity: "HIGH",
      description: "Heavily obfuscated code detected",
      file: "index.js",
      line: 42,
    });
  }

  return {
    risk_score: riskScore,
    engine_confidence: 0.85,
    findings,
  };
}
```

### This Works But:

- Not accurate (just random based on hash)
- No real analysis
- No actual malware detection
- **We need your real AI engine!**

---

## 🚀 How to Integrate

### Step 1: Build Your AI Engine

1. Train your ML model
2. Create API or library
3. Test with sample packages
4. Ensure output format matches spec

### Step 2: Share with Us

```
Option A: Give us API endpoint
  - URL: http://your-server:8000/analyze
  - We'll call it from our auditor node

Option B: Give us Docker image
  - docker pull your-registry/chainaudit-ai
  - We'll run it locally

Option C: Give us Python package
  - pip install chainaudit-ai
  - We'll import and use it
```

### Step 3: We Integrate

```typescript
// We'll update this file:
// auditor-node/src/ai-engine-client.ts

export class AIEngineClient {
  async analyzePackage(packageName, version, tarballPath) {
    // Replace mock with your real engine
    const response = await fetch(YOUR_API_URL, {
      method: "POST",
      body: JSON.stringify({ package_name, version, tarball_path }),
    });
    return await response.json();
  }
}
```

### Step 4: Test Together

```bash
# Test with known packages
npm run test-audit lodash 4.17.21    # Should be LOW
npm run test-audit event-stream 3.3.6 # Should be HIGH
```

---

## 📈 Performance Requirements

### Speed:

- **Target**: <10 seconds per package
- **Maximum**: 30 seconds per package
- **Timeout**: We'll timeout after 60 seconds

### Accuracy:

- **Target**: ≥85% accuracy
- **False Positives**: <5%
- **False Negatives**: <10%

### Scalability:

- Handle 100+ packages per day
- Support concurrent requests (if API)
- Reasonable resource usage

---

## 🔒 Security Considerations

### Your Engine Should:

1. **Sandbox execution** - Don't run package code
2. **Static analysis only** - Parse, don't execute
3. **Timeout protection** - Don't hang on malicious packages
4. **Resource limits** - Don't consume too much CPU/memory

### We Handle:

1. Package downloading
2. Tarball extraction
3. Caching
4. Cleanup

---

## 📝 Example Workflow

### Current Flow (with mock):

```
1. Developer requests audit for "axios@1.6.0"
2. Auditor node downloads package
3. Auditor node calls mock AI → returns random score
4. Auditor node submits to blockchain
5. CLI shows result to developer
```

### Future Flow (with your AI):

```
1. Developer requests audit for "axios@1.6.0"
2. Auditor node downloads package
3. Auditor node calls YOUR AI → returns real analysis
4. Auditor node submits to blockchain
5. CLI shows result to developer
```

**Only step 3 changes!**

---

## 🧪 Testing Data

### Packages to Test:

#### Clean Packages (should be LOW risk):

- lodash@4.17.21
- axios@1.6.0
- express@4.18.2
- react@18.2.0

#### Suspicious Packages (should be MEDIUM-HIGH risk):

- event-stream@3.3.6 (known malicious)
- ua-parser-js@0.7.29 (compromised)
- coa@2.0.3 (malicious)

### We'll Provide:

- Test dataset of 100+ packages
- Known malicious packages
- Known clean packages
- Ground truth labels

---

## 📞 Communication

### What We Need From You:

1. **Timeline**

   - When will AI engine be ready?
   - Can you provide a test version first?

2. **API Details**

   - Endpoint URL
   - Authentication (if needed)
   - Rate limits

3. **Documentation**

   - How to use your engine
   - Error handling
   - Edge cases

4. **Support**
   - How to report issues
   - How to request features

### What We'll Provide:

1. **Test Environment**

   - Access to our auditor node
   - Sample packages
   - Integration testing

2. **Feedback**

   - Accuracy metrics
   - Performance data
   - Bug reports

3. **Integration Support**
   - Help with API integration
   - Docker setup assistance
   - Testing coordination

---

## 🎯 Success Criteria

### Your AI Engine is Ready When:

- [ ] Analyzes packages in <30 seconds
- [ ] Returns correct JSON format
- [ ] Achieves ≥85% accuracy on test set
- [ ] Handles errors gracefully
- [ ] Works with our auditor node
- [ ] Passes all test cases

### Integration is Complete When:

- [ ] We've replaced mock with your engine
- [ ] All tests pass
- [ ] Accuracy is validated
- [ ] Performance is acceptable
- [ ] Error handling works
- [ ] Documentation is complete

---

## 📚 Resources for You

### Our Codebase:

- **Auditor Node**: `auditor-node/src/`
- **Mock AI Client**: `auditor-node/src/ai-engine-client.ts`
- **Test Script**: `auditor-node/test-audit.ts`

### Documentation:

- **Architecture**: `ARCHITECTURE.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **This Document**: `AI_INTEGRATION_SPEC.md`

### npm Package Analysis:

- **Registry API**: https://registry.npmjs.org/
- **Package Structure**: https://docs.npmjs.com/cli/v8/configuring-npm/package-json
- **Tarball Format**: Standard .tgz (gzipped tar)

---

## 🚀 Next Steps

### For You (Shubasis):

1. **Review this document** - Ask questions if anything is unclear
2. **Choose integration method** - API, library, or Docker?
3. **Build AI engine** - Train model, create service
4. **Test locally** - Verify output format
5. **Share with us** - API endpoint or package
6. **Integrate together** - We'll help with integration
7. **Test end-to-end** - Validate accuracy
8. **Deploy** - Go live!

### For Us (Sachin):

1. **Wait for your AI engine** ✅
2. **Integrate when ready** ✅
3. **Test thoroughly** ✅
4. **Deploy to production** ✅

---

## 📊 Current Status

### What's Working:

- ✅ Smart contracts deployed
- ✅ Auditor node functional
- ✅ CLI tool working
- ✅ Frontend beautiful
- ✅ End-to-end flow tested
- ⏳ **AI engine (your part)**

### What's Blocked:

- Real malware detection (needs your AI)
- Accurate risk scoring (needs your AI)
- Production deployment (needs your AI)

**We're 95% done. Your AI engine is the final 5%!**

---

## 💡 Tips & Best Practices

### For ML Model:

1. **Feature Engineering**

   - AST parsing for code structure
   - String entropy for obfuscation
   - Network call patterns
   - File system operations

2. **Training Data**

   - Use known malicious packages
   - Balance dataset (50/50 malicious/clean)
   - Include recent attacks
   - Update regularly

3. **Model Selection**

   - Random Forest (good baseline)
   - Neural Networks (better accuracy)
   - Ensemble methods (best results)

4. **Validation**
   - Cross-validation
   - Test on unseen data
   - Monitor false positives
   - Track accuracy over time

---

## 🎉 Final Words

You're building the **brain** of ChainAudit. Everything else is ready and waiting for your AI engine.

**We've built:**

- The infrastructure (blockchain)
- The interface (CLI + frontend)
- The automation (auditor node)

**You're building:**

- The intelligence (AI detection)

**Together we'll have:**

- A complete, working, production-ready system!

---

**Questions? Contact Sachin**  
**Ready to integrate? Let's do this! 🚀**

---

**Status:** Ready for AI Integration  
**Priority:** High  
**Timeline:** ASAP  
**Blocker:** Waiting for AI engine

**LET'S BUILD THIS! 💪**
