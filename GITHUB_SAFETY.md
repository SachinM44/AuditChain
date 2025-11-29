# ⚠️ GitHub Safety Checklist

## Before Pushing to GitHub

### ✅ Critical - Must Check:

1. **Private Keys**

   - [ ] `.env` files are in `.gitignore`
   - [ ] No private keys in code
   - [ ] No private keys in commit history
   - [ ] `auditor-node/.env` is NOT committed

2. **Sensitive Data**

   - [ ] No wallet addresses in code (use env vars)
   - [ ] No API keys hardcoded
   - [ ] No passwords or secrets

3. **Configuration Files**
   - [ ] `.aptos/` directory is ignored
   - [ ] `.chainaudit/` directory is ignored
   - [ ] Local config files are ignored

### ✅ Recommended - Should Check:

4. **Build Artifacts**

   - [ ] `node_modules/` ignored
   - [ ] `dist/` and `build/` ignored
   - [ ] `.cache/` ignored

5. **Temporary Files**
   - [ ] `*.log` files ignored
   - [ ] `tmp/` directories ignored
   - [ ] OS files (`.DS_Store`) ignored

### 🔍 How to Verify:

```bash
# Check what will be committed
git status

# Check if .env is tracked (should NOT appear)
git ls-files | grep .env

# If .env appears, remove it:
git rm --cached auditor-node/.env
git rm --cached cli/.env
git rm --cached .env

# Check for private keys in files
grep -r "PRIVATE_KEY" --exclude-dir=node_modules --exclude-dir=.git .

# Should only appear in:
# - .env.example files (as placeholder)
# - Documentation (as example)
# - NOT in actual .env files being committed
```

### 🚨 If You Accidentally Committed Secrets:

**IMPORTANT:** If you already committed private keys:

1. **Rotate the keys immediately**

   ```bash
   # Create new Aptos account
   aptos init --network testnet

   # Update .env with new private key
   # Re-register as auditor with new account
   ```

2. **Remove from Git history**

   ```bash
   # Remove sensitive file from history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch auditor-node/.env" \
     --prune-empty --tag-name-filter cat -- --all

   # Force push (only if repo is private and you're sure)
   git push origin --force --all
   ```

3. **Better: Use BFG Repo-Cleaner**

   ```bash
   # Install BFG
   brew install bfg

   # Clean sensitive data
   bfg --delete-files .env
   bfg --replace-text passwords.txt

   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

### ✅ Safe to Commit:

- ✅ Source code (`.ts`, `.move`, `.js`)
- ✅ Configuration examples (`.env.example`)
- ✅ Documentation (`.md` files)
- ✅ Package files (`package.json`, `Move.toml`)
- ✅ Scripts (`.sh` files)
- ✅ Tests

### ❌ Never Commit:

- ❌ `.env` files
- ❌ Private keys
- ❌ Wallet mnemonics
- ❌ API keys
- ❌ Passwords
- ❌ `node_modules/`
- ❌ Build artifacts
- ❌ Log files

### 📝 Example .env.example (Safe):

```bash
# This is SAFE to commit
NETWORK=testnet
PRIVATE_KEY=your_private_key_here  # ← Placeholder, not real key
AUDITOR_ADDRESS=your_address_here
```

### 🔐 Actual .env (NEVER commit):

```bash
# This should NEVER be committed
NETWORK=testnet
PRIVATE_KEY=ed25519-priv-0x7eb606c1a96bdb8a6f0d242793cd672a46956d4ad1079cccf6264bf2ebc98a7e  # ← REAL KEY!
AUDITOR_ADDRESS=0x762779f87715b377314b79420b866ca7edef615a86d0d998f733e3f5c7113f89
```

### 🎯 Quick Pre-Push Checklist:

```bash
# 1. Check status
git status

# 2. Verify .gitignore is working
git check-ignore auditor-node/.env
# Should output: auditor-node/.env

# 3. Check what's being committed
git diff --cached

# 4. If all looks good, commit
git add .
git commit -m "Initial commit - ChainAudit MVP"
git push origin main
```

### 🔒 GitHub Repository Settings:

1. **Make repo private** (recommended for now)
2. **Enable branch protection** on main
3. **Require pull request reviews**
4. **Enable secret scanning** (GitHub will alert you)
5. **Add `.env` to secret scanning patterns**

### 📞 If You Need Help:

- Check: `git status`
- Verify: `git ls-files | grep .env`
- Clean: `git rm --cached <file>`
- Reset: `git reset HEAD <file>`

---

**Remember:** Once a secret is pushed to GitHub, consider it compromised. Always rotate keys if you accidentally commit them!

**Status:** ✅ All .gitignore files created  
**Safety:** 🔒 Private keys protected  
**Ready:** 🚀 Safe to push to GitHub
