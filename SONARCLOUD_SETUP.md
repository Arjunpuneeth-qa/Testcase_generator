# SonarCloud Setup Guide

SonarQube scan is currently **disabled** until SonarCloud is properly configured. Follow this guide to set it up.

---

## Step-by-Step Setup

### Step 1: Create SonarCloud Account

1. Go to: https://sonarcloud.io
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"**
4. Click **"Authorize SonarSource"**
5. Complete the authorization

### Step 2: Create Organization

1. After login, click **"Create new organization"**
2. **Organization key:** `arjun-qa` (use lowercase)
3. **Organization name:** `Arjun QA`
4. Click **"Create organization"**

### Step 3: Add Your Repository

1. Click **"Analyze new project"**
2. Select **"Testcase_generator"** repository
3. Click **"Set up"**
4. Choose **"Free plan"** (if prompted)

### Step 4: Generate Token

1. Go to: https://sonarcloud.io/account/security
2. Click **"Generate token"**
3. **Token name:** `GitHub Actions`
4. Copy the token (you won't see it again!)

### Step 5: Add GitHub Secret

1. Go to your GitHub repo: https://github.com/Arjunpuneeth-qa/Testcase_generator
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. **Name:** `SONAR_TOKEN`
5. **Value:** (paste your SonarCloud token)
6. Click **"Add secret"**

### Step 6: Enable SonarQube Workflow

Once the token is added, update `.github/workflows/sonarqube-scan.yml`:

Change:
```yaml
on:
  workflow_dispatch:
```

To:
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

---

## What SonarQube Does

✅ **Code Quality Analysis**
- Duplicate code detection
- Code complexity analysis
- Code smell detection
- Technical debt calculation

✅ **Security Analysis**
- SQL injection detection
- XSS vulnerabilities
- OWASP Top 10 issues
- Security hotspots identification

✅ **Bug Detection**
- Logic errors
- Potential null pointer issues
- Unreachable code
- Dead code detection

✅ **Test Coverage**
- Code coverage metrics
- Coverage trends
- Untested code identification

---

## Other Scans (Already Running)

**These scans don't require setup and are already active:**

✅ **TruffleHog** - Detects hardcoded secrets
✅ **npm audit** - Finds vulnerable dependencies
✅ **Semgrep** - OWASP pattern detection
✅ **CodeQL** - SQL injection, XSS, command injection
✅ **OWASP Dependency-Check** - Known CVE identification
✅ **Snyk** - Advanced vulnerability scanning (optional)

---

## Troubleshooting

### "Project not found" Error
- Verify `sonar.organization` matches your SonarCloud org
- Verify `sonar.projectKey` is correct
- Check that SONAR_TOKEN is added to GitHub Secrets
- Ensure token hasn't expired

### Token Not Working
- Go to SonarCloud: Account → Security
- Verify token is still active
- Generate a new token if needed
- Update GitHub secret with new token

### Organization Not Found
- Go to SonarCloud dashboard
- Check your organization key (Settings → Organization)
- Make sure it matches in the workflow

---

## Security Best Practices

⚠️ **Never commit your token!**
- Use GitHub Secrets (already done)
- Never paste token in code
- Rotate token regularly (quarterly recommended)
- Delete token if leaked

---

## Current Status

**SonarQube:** ⏸️ Disabled (waiting for token)
**Other Scans:** ✅ Active and running

**Your PR #1 tests:** All other security scans complete successfully!

---

## Timeline for Setup

1. ⏰ 2 minutes - Create SonarCloud account
2. ⏰ 3 minutes - Create organization
3. ⏰ 2 minutes - Add repository
4. ⏰ 1 minute - Generate token
5. ⏰ 1 minute - Add GitHub secret

**Total: ~10 minutes**

---

## Next Steps (Optional)

1. Follow steps 1-5 above
2. Update the workflow file to enable SonarQube
3. Push your changes
4. SonarQube will run on next PR/push

---

## For Now

Your repository has **comprehensive security coverage** with:
- Secret detection ✅
- Dependency vulnerability scanning ✅
- SAST analysis ✅
- Branch protection ✅
- Code owner approval ✅

**SonarQube adds code quality metrics** which is nice-to-have but not essential.

---

## Questions?

Check SonarCloud docs: https://docs.sonarcloud.io/
