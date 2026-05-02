# Security Testing Verification Checklist

Follow this checklist to verify all security measures are working correctly.

---

## Phase 1: Create Pull Request ✅

### What You Just Did:
- Created test branch: `test/security-verification`
- Pushed to GitHub
- Ready to create PR

### Next Step:
1. Go to: https://github.com/Arjunpuneeth-qa/Testcase_generator
2. Click "Compare & pull request" (or use the PR creation link)
3. Create the PR with title: "Test: Verify branch protection and security workflows"

---

## Phase 2: Watch Security Scans Run (2-5 minutes)

After creating the PR, go to the **Checks** tab in the PR and watch:

### ✅ Expected Workflow Runs

- [ ] **SonarQube Code Scan** - Should START running
- [ ] **Security & Code Quality Scan** - Should START running

### What Each Scan Does:

**SonarQube:**
- Analyzes code quality
- Checks for vulnerabilities
- Takes 1-2 minutes

**Security Scan includes:**
- TruffleHog (secret detection)
- npm audit (dependency check)
- Semgrep (OWASP patterns)
- CodeQL (injection detection)
- OWASP Dependency Check
- Takes 2-4 minutes

---

## Phase 3: Verify Status Checks

### All Checks Should Show:

```
✅ SonarQube Code Scan — completed successfully
✅ Security & Code Quality Scan — completed successfully
✅ All required status checks have passed
```

**If any show ❌:**
- Click on the failed check to see details
- Usually just dependency warnings (safe to ignore)

---

## Phase 4: Test Branch Protection

### ✅ Verify: "Merge" Button is DISABLED Until Approved

You should see a message like:
```
"This branch has 1 blocked rule"
```

Or:
```
"Review from code owners is required"
```

This proves branch protection is working!

---

## Phase 5: Approve Your Own PR

### Steps:
1. In the PR, click **"Review changes"** button (top right)
2. Select **"Approve"** radio button
3. Click **"Submit review"**

### Expected Result:
- A comment appears: "Arjunpuneeth-qa approved these changes"
- The "Merge" button becomes ENABLED ✅

---

## Phase 6: Test Merge

### Steps:
1. Scroll to "Merge pull request" section
2. Click the dropdown arrow next to "Merge pull request"
3. Select **"Squash and merge"**
4. Click **"Confirm merge"**

### Expected Result:
- PR gets merged into main ✅
- Purple "Merged" badge appears
- You see: "Delete branch" option

---

## Phase 7: Cleanup

After successful merge:

### Delete the Test Branch:
1. Click the "Delete branch" button on the PR page
2. Or run locally:
```bash
git checkout main
git pull origin main
git branch -d test/security-verification
```

---

## Testing Matrix - What Should Work

| Action | Expected Result | Status |
|--------|-----------------|--------|
| Direct push to main | ❌ BLOCKED | Test manually |
| Feature branch push | ✅ ALLOWED | Already working |
| PR created | ✅ Security scans run | Watch Actions tab |
| All scans pass | ✅ Status checks green | Phase 3 |
| Without approval | ❌ Merge disabled | Phase 4 |
| After approval | ✅ Merge enabled | Phase 5 |
| Merge to main | ✅ Success | Phase 6 |

---

## Test 2: Verify You Can't Push Directly to Main

After the PR is merged, test this:

```bash
git checkout main
git pull origin main
echo "test" >> test.txt
git add test.txt
git commit -m "Direct push test"
git push origin main
```

### Expected Result:
```
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: 
remote: - PROTECTED BRANCH
remote: — You cannot push to this protected branch
```

If you see this error = ✅ **Branch protection is working!**

---

## Test 3: Verify Secret Detection

To test if TruffleHog would catch secrets:

```bash
git checkout -b test/secret-detection
echo 'API_TOKEN=ATATT3xFfGF0test123456789' >> test-secret.txt
git add test-secret.txt
git commit -m "Test: Verify secret detection"
git push origin test/secret-detection
```

Then create a PR and check if TruffleHog scan detects it.

### Expected Result:
- PR comments with warning about exposed secrets
- Status check might fail ❌

**Important:** This test only works if you use a fake token (not a real one).

Then delete this branch without merging:
```bash
git checkout main
git branch -d test/secret-detection
git push origin --delete test/secret-detection
```

---

## Summary Table

After all tests, you should have verified:

| Item | Verified? |
|------|-----------|
| Security scans run automatically | [ ] |
| All status checks pass | [ ] |
| Approval required before merge | [ ] |
| Code owner (you) must approve | [ ] |
| Direct push to main is blocked | [ ] |
| PR merge works after approval | [ ] |
| Branch protection is active | [ ] |

---

## Troubleshooting

### If Scans Don't Run:
1. Check Actions tab → Workflows enabled?
2. Check branch protection rules exist
3. Try pushing another commit to the PR

### If Approval Not Required:
1. Check CODEOWNERS file exists
2. Check branch protection has "Require review from code owners"
3. May take a few minutes to sync

### If Can't Merge After Approval:
1. Make sure ALL status checks are green ✅
2. Make sure you approved it (not just reviewed)
3. Wait a minute and refresh the page

---

## Success Criteria ✅

You'll know everything is working when:

1. ✅ PR security scans run automatically
2. ✅ All status checks pass (green)
3. ✅ Merge button disabled until you approve
4. ✅ After approval, merge button enabled
5. ✅ Merge to main succeeds
6. ✅ Can't push directly to main (error message)

**If all 6 are working = Your repository is fully secured!** 🔒

---

## Next Steps After Verification

1. ✅ Run through this verification
2. ✅ Confirm everything works
3. ✅ You're ready to work with full security!
4. ⏳ (Optional) Set up SonarCloud dashboard
5. ⏳ (Optional) Add Wiz scanner later

---

**Questions?** Check the detailed guides:
- `BRANCH_PROTECTION_SETUP.md`
- `SECURITY_SCANNING_SETUP.md`
