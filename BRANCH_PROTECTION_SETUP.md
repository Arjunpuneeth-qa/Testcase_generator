# Branch Protection Rules - Setup Guide

This guide explains how to set up branch protection so that **only you can approve and merge changes into main**.

## Overview

With branch protection:
✅ All changes require a pull request (no direct commits)
✅ Your approval is required before merging
✅ Security scans must pass
✅ No force pushes allowed
✅ Cannot delete the branch

---

## Step-by-Step Setup

### 1. Go to GitHub Branch Settings

1. Go to your repository: https://github.com/Arjunpuneeth-qa/Testcase_generator
2. Click **Settings** tab
3. Click **Branches** (left sidebar)
4. Click **Add rule** button

### 2. Configure Branch Protection

**Branch name pattern:**
```
main
```

### 3. Enable Protection Rules

Check these boxes:

#### ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from code owners

#### ✅ Require status checks to pass before merging
Select and enable:
- ✅ SonarQube Code Scan
- ✅ Security & Code Quality Scan

#### ✅ Require branches to be up to date before merging

#### ✅ Require a conversation resolution before merging

#### ✅ Require code scanning results to pass
- Select CodeQL

#### ✅ Restrict who can push to matching branches
- Allow only the following users: (optional - leave blank for now)

#### ✅ Allow force pushes: **Disable**

#### ✅ Allow deletions: **Disable**

---

## What This Means

### Before These Rules:
```
You → git push origin main ✅ (ALLOWED - RISKY!)
```

### After These Rules:
```
You → Create Branch
   ↓
Create Pull Request
   ↓
Security Scans Run
   ↓
You Approve Your Own PR
   ↓
Merge to main ✅
```

---

## Workflow for Making Changes

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature
# Make your changes
git add .
git commit -m "Your changes"
git push origin feature/your-feature
```

### 2. Open Pull Request
- Go to GitHub
- Click "Compare & pull request"
- Add description
- Click "Create pull request"

### 3. Wait for Checks
- Security scans will run automatically
- Wait for all ✅ checks to pass
- If any ❌ fail, fix and push again

### 4. Review & Approve Your Own PR
- Click "Review changes"
- Select "Approve"
- Click "Approve"

### 5. Merge
- Click "Merge pull request"
- Select "Squash and merge" (recommended)
- Click "Confirm merge"
- Delete branch

---

## GitHub CODEOWNERS File

The `.github/CODEOWNERS` file is already configured:

```
* @Arjunpuneeth-qa
```

This means:
- You (@Arjunpuneeth-qa) are the code owner
- You're automatically requested for review on all PRs
- PR cannot be merged without your approval

---

## Emergency Bypass (Admins Only)

If you need to bypass protection for emergencies:

**NOT RECOMMENDED**, but if needed:

1. Settings → Branches → Edit rule
2. Uncheck protections temporarily
3. Make the emergency change
4. **RE-ENABLE protections immediately**

---

## Testing the Protection

### Test 1: Try Direct Push (Should Fail)
```bash
git checkout main
echo "test" >> test.txt
git commit -am "Test commit"
git push origin main
# Error: "You cannot push to this protected branch"
```

### Test 2: Create a PR (Should Require Approval)
```bash
git checkout -b test-branch
echo "test" >> test.txt
git commit -am "Test commit"
git push origin test-branch
# Then create PR on GitHub - you must approve it yourself
```

---

## Viewing Protected Branches

### In GitHub UI:
Settings → Branches → Shows lock icon (🔒) next to main

### Via GitHub CLI:
```bash
gh api repos/Arjunpuneeth-qa/Testcase_generator/branches/main/protection
```

---

## Advanced Options (Optional)

### Require Branches to Be Up to Date
```
✅ Enable
```
This prevents merging if main has new commits since your branch was created.

### Require Conversation Resolution
```
✅ Enable
```
Forces resolution of review comments before merging.

### Dismiss Stale Pull Request Approvals
```
✅ Enable
```
If someone pushes new commits after approval, approval becomes invalid.

---

## Common Scenarios

### Scenario 1: You Push New Commits
```
1. You push to feature branch
2. PR exists with your approval
3. Approval becomes invalid (stale)
4. You need to approve again
5. Then merge
```

### Scenario 2: Security Scan Fails
```
1. You create PR
2. Security scan finds issue
3. Status check: ❌ FAILED
4. Fix the issue
5. Push fix (automatically re-runs scan)
6. Once scan: ✅ PASSED
7. Approve and merge
```

### Scenario 3: Merge Conflict
```
1. Main has been updated
2. Your branch is behind
3. GitHub shows: "This branch has conflicts"
4. Click "Resolve conflicts"
5. Fix conflicts
6. Commit merge
7. Approval still required
8. Merge
```

---

## Protecting Other Branches (Optional)

Apply same rules to `develop` branch:

1. Settings → Branches → Add rule
2. Branch name: `develop`
3. Check same boxes
4. Require 1 approval

---

## Summary

You now have:
✅ Force main branch to use PRs
✅ Automatic code owner request (you)
✅ Required approval before merge
✅ Security scans must pass
✅ Cannot force push or delete main
✅ Conversation resolution required
✅ Branch must be up to date

This provides **enterprise-grade governance** for your main branch! 🔒

---

## Next: Commit and Push

```bash
git add .github/CODEOWNERS BRANCH_PROTECTION_SETUP.md
git commit -m "Add CODEOWNERS and branch protection documentation"
git push origin main
```

Then follow Steps 1-3 above to enable branch protection in GitHub UI.
