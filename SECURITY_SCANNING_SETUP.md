# Security & Code Quality Scanning Setup Guide

This document explains how to set up SonarQube, Wiz, and other security scanning tools for your GitHub repository.

## 1. SonarQube Setup (SonarCloud - Recommended)

SonarQube is a comprehensive code quality and security platform that detects:
- Security vulnerabilities
- Code bugs
- Code smells (design issues)
- Duplicate code
- Test coverage gaps

### Step 1: Create SonarCloud Account

1. Go to [SonarCloud.io](https://sonarcloud.io)
2. Click "Sign up" 
3. Choose "Sign up with GitHub"
4. Authorize the app to access your GitHub account
5. Create an organization (use: `arjun-qa`)

### Step 2: Create a Project

1. Click "Create project"
2. Select your `Testcase_generator` repository
3. Choose the free plan
4. Click "Set Up" → "With GitHub Actions"

### Step 3: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets:**

1. **SONAR_TOKEN**
   - In SonarCloud, go to Account → Security
   - Generate a new token
   - Copy the token
   - Add to GitHub as `SONAR_TOKEN`

2. **SNYK_TOKEN** (Optional - for dependency scanning)
   - Go to [Snyk.io](https://snyk.io)
   - Sign up with GitHub
   - Go to Account settings → API Token
   - Copy and add as `SNYK_TOKEN`

### Step 4: Push Code to Trigger Scan

```bash
git add .github/ sonar-project.properties SECURITY_SCANNING_SETUP.md
git commit -m "Add SonarQube and security scanning workflows"
git push origin main
```

The scan will automatically run and you'll see results on:
- GitHub: Actions tab → Workflow runs
- SonarCloud: Your project dashboard

---

## 2. What Each Scanner Does

### SonarQube (sonarqube-scan.yml)
- **Detects:** Security vulnerabilities, bugs, code smells
- **Languages:** JavaScript, Python, Java, C#, etc.
- **Features:**
  - OWASP Top 10 detection
  - CWE/CERT standards
  - Code duplication
  - Technical debt estimation

### Security Scan Workflow (security-scan.yml)
Contains multiple layers of security:

#### TruffleHog
- Detects leaked secrets (API keys, passwords, tokens)
- Scans git history

#### npm audit
- Finds vulnerable dependencies
- Checks npm packages

#### Semgrep
- Static analysis for security patterns
- OWASP Top 10 checks
- CWE detection

#### CodeQL (GitHub's native tool)
- Detects SQL injection, XSS, command injection
- JavaScript/TypeScript analysis
- High accuracy, low false positives

#### OWASP Dependency Check
- Identifies known vulnerable components
- Checks CVE databases

#### Snyk (Optional)
- Real-time vulnerability scanning
- Developer-friendly
- Automated fix recommendations

---

## 3. Wiz Setup (Cloud Security - For Later)

Wiz is enterprise cloud security platform that extends beyond code:
- Cloud infrastructure scanning
- Container security
- Secrets detection
- Supply chain security

### For Future Integration:

1. Sign up at [Wiz.io](https://wiz.io)
2. Request GitHub integration
3. Connect your GitHub organization
4. Configure scanning policies
5. Add to GitHub Actions workflow

### Basic Wiz Workflow (Future):
```yaml
- name: Wiz Code Scan
  uses: wizcli/github-action@latest
  with:
    client_id: ${{ secrets.WIZ_CLIENT_ID }}
    client_secret: ${{ secrets.WIZ_CLIENT_SECRET }}
```

---

## 4. Viewing Results

### GitHub
- Go to Actions tab → Click workflow run
- Scroll down to see scan results
- Artifacts tab for detailed reports

### SonarCloud
- Go to your project dashboard
- View:
  - Security vulnerabilities
  - Code coverage
  - Technical debt
  - Code complexity
  - Bug distribution

### Pull Requests
- Automatic comments with scan results
- Blocks merge if quality gate fails (configurable)

---

## 5. GitHub Branch Protection

To enforce security scanning:

1. Go to Settings → Branches → Add rule
2. Select `main` branch
3. Enable:
   - "Require status checks to pass before merging"
   - Select all workflow checks:
     - SonarQube Scan
     - Security & Code Quality Scan
4. Save

Now pull requests must pass security scans before merging!

---

## 6. Fixing Issues Found by Scanners

### Security Vulnerabilities
- Fix critical/high severity issues immediately
- Medium/low issues can be scheduled

### Code Bugs
- Review findings
- Fix or mark as "won't fix" with justification

### Code Smells
- Refactor problematic code
- Improve test coverage

### Secrets Detected
- If real secrets found:
  1. Rotate the credential immediately
  2. Remove from code
  3. Add to `.gitignore` / `.env`
  4. Force push clean history

---

## 7. Next Steps

1. ✅ Commit and push the workflow files
2. ⏳ Wait for first scan to complete (2-5 minutes)
3. 📊 Review results in GitHub Actions and SonarCloud
4. 🔧 Fix high-severity issues
5. 🛡️ Set up branch protection
6. 📈 Monitor trends over time
7. 🚀 (Optional) Add Wiz later for cloud security

---

## 8. Useful Commands

### Local SonarQube Scan (Optional)
```bash
# Install SonarQube Scanner
npm install -g sonarqube-scanner

# Run local scan
sonar-scanner \
  -Dsonar.projectKey=Arjunpuneeth-qa_Testcase_generator \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=$SONAR_TOKEN
```

### Local Secret Scan
```bash
# Install TruffleHog
pip install truffleHog

# Scan repository
trufflehog git file://. --json
```

---

## 9. Troubleshooting

### SonarCloud Token Issues
- Go to SonarCloud → Account → Security
- Delete old token, generate new one
- Update GitHub secret

### Scan Timeouts
- Increase timeout in workflow
- Reduce exclusions in sonar-project.properties

### False Positives
- Mark as "Won't Fix" in SonarCloud
- Add quality profile exceptions

---

## Summary

You now have:
✅ SonarQube scanning (code quality + security)
✅ Secret detection (TruffleHog)
✅ Dependency vulnerability scanning (npm audit, OWASP, Snyk)
✅ SAST analysis (Semgrep, CodeQL)
✅ GitHub integration (automatic PR comments)
✅ Branch protection rules

This provides enterprise-grade security scanning! 🛡️
