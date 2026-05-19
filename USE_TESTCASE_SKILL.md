# How to Use /testcase Skill - COMPLETE GUIDE

## 🎯 What is /testcase Skill?

The `/testcase` skill is a **Claude Code custom skill** that generates professional test cases directly from JIRA tickets with one simple command.

**Features:**
- 🧠 Analyzes JIRA tickets intelligently
- 📝 Generates 6-100 test cases
- 🛡️ Includes security tests (SQL injection, XSS)
- 🔍 Includes 26 boundary value tests
- 📊 Creates professional Excel files
- ⚡ Fast (seconds)

---

## ⚡ QUICK START - 30 SECONDS

### Prerequisites (One-Time Setup)
```powershell
cd C:\Users\PuneethAM\GA_testcases
npm install
notepad .env
# Add your JIRA credentials:
# JIRA_EMAIL=am.puneeth@bounteous.com
# JIRA_API_TOKEN=your_token_here
```

Get API token: https://id.atlassian.com/manage-profile/security/api-tokens

### Generate Test Cases

#### Method 1: Using Claude Code Skill (Recommended)
```
/testcase GAAM-933
```

That's it! Your test cases are generated.

#### Method 2: Direct Node Command
```powershell
node testcase-skill.js GAAM-933
```

#### Method 3: Multiple Tickets
```
/testcase GAAM-933 GAAM-934 GAAM-935
```

---

## 📋 DETAILED INSTRUCTIONS

### Step 1: Open Claude Code
Start Claude Code in your project folder:
```
C:\Users\PuneethAM\GA_testcases\
```

### Step 2: Run the Skill
Type in the chat:
```
/testcase GAAM-933
```

Or for multiple tickets:
```
/testcase GAAM-933 GAAM-934 GAAM-935
```

### Step 3: Wait for Completion
You'll see:
```
[INFO] Fetching ticket: GAAM-933...
✓ Ticket fetched successfully
✓ Test cases generated: 15 test cases
✓ Excel file created

SKILL EXECUTION SUMMARY
1. GAAM-933: ✓ Success
   Summary: Your Feature Name
   Test Cases: 15
   Output: GAAM-933_Feature_Name.xlsx
   Path: C:\Users\PuneethAM\GA_testcases\GA_testcases\...
```

### Step 4: Find Your Test Cases
Navigate to:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

Open the Excel file and start testing! ✅

---

## 🎯 USAGE EXAMPLES

### Example 1: Single Ticket
```
/testcase GAAM-933
```

**Output:** `GAAM-933_Feature_Name.xlsx` with 15 test cases

### Example 2: Multiple Tickets (Batch)
```
/testcase GAAM-933 GAAM-934 GAAM-935
```

**Output:** 
- `GAAM-933_Feature_1.xlsx`
- `GAAM-934_Feature_2.xlsx`
- `GAAM-935_Feature_3.xlsx`

### Example 3: Sprint-Wide Generation
```
/testcase GAAM-900 GAAM-901 GAAM-902 GAAM-903 GAAM-904 GAAM-905
```

All 6 test case files generated at once!

---

## 📊 WHAT YOU GET

Each Excel file contains:

| Column | Content | Example |
|--------|---------|---------|
| TC_ID | Test case ID | GAAM-933_TC_001 |
| Test Scenario | What to test | "Verify feature loads" |
| Test Type | Type of test | "Functional - Positive" |
| Pre-Condition | Setup needed | "User logged in" |
| Test Steps | Step-by-step instructions | "1. Click button\n2. Verify..." |
| Test Data | Test data to use | "Valid username" |
| Expected Result | What should happen | "Feature displays" |
| Brief Description | Quick summary | "Test happy path" |
| Status | Pass/Fail | [For you to fill] |

### Test Types Generated:
✅ Positive tests (happy path)
✅ Negative tests (invalid input)
✅ Edge case tests (boundary values)
✅ Security tests (SQL injection, XSS)
✅ Performance tests (load, concurrency)
✅ Error handling tests
✅ Feature-specific tests
✅ 26 Boundary value tests

---

## 🔧 TROUBLESHOOTING

### Problem: ".env file not found"

**Solution:**
```powershell
cd C:\Users\PuneethAM\GA_testcases
notepad .env
```

Add:
```
JIRA_EMAIL=am.puneeth@bounteous.com
JIRA_API_TOKEN=your_token_here
```

Save and try again.

### Problem: "JIRA_API_TOKEN not set"

**Solution:** Get a new API token:
1. Visit: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token
4. Update `.env` file with the new token
5. Try again

### Problem: "Cannot find module 'exceljs'"

**Solution:**
```powershell
npm install
```

Then try again:
```
/testcase GAAM-933
```

### Problem: "HTTP 404: No issue found"

**Solution:** Make sure the ticket exists:
- Verify ticket number (e.g., GAAM-933 not GAAM933)
- Make sure you have access to the ticket
- Try a different ticket

### Problem: "HTTP 401: Invalid credentials"

**Solution:**
1. Get a new API token
2. Update `.env` file
3. Try again

---

## 💡 PRO TIPS

### Tip 1: Quick Reference
Save this command in your notes:
```
/testcase GAAM-XXX
```

### Tip 2: Open Results Immediately
After generating:
```powershell
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

### Tip 3: Check Credentials Anytime
```powershell
Get-Content .env
```

### Tip 4: Update Credentials Anytime
```powershell
notepad .env
```

### Tip 5: Batch Generate for Sprint
Collect all JIRA numbers first:
```
GAAM-933, GAAM-934, GAAM-935, GAAM-936
```

Then run:
```
/testcase GAAM-933 GAAM-934 GAAM-935 GAAM-936
```

---

## 🎓 SKILL vs DIRECT COMMAND

### Using the Skill
```
/testcase GAAM-933
```
✅ Easiest
✅ Built into Claude Code
✅ Type naturally
✅ Best experience

### Using Direct Command
```powershell
node testcase-skill.js GAAM-933
```
✅ Works always
✅ Manual invocation
✅ More control

**Recommendation:** Use the skill `/testcase` for best experience!

---

## 📚 RELATED GUIDES

- `BOUNDARY_TEST_GUIDE.md` - Boundary testing details
- `V4_QUICK_GUIDE.md` - V4 generator guide
- `SETUP.md` - Complete setup instructions
- `README.md` - Project overview

---

## ✨ READY TO USE

The skill is fully set up and ready to use!

### Run now:
```
/testcase GAAM-933
```

Your professional test cases will be generated in **seconds!** ⚡

---

## 🎯 WORKFLOW EXAMPLE

```
1. Get JIRA ticket: GAAM-933
   
2. Run skill:
   /testcase GAAM-933
   
3. Wait 5-10 seconds...
   
4. Open Excel file:
   C:\Users\PuneethAM\GA_testcases\GA_testcases\GAAM-933_*.xlsx
   
5. Review test cases:
   - Check Pre-Conditions
   - Review Test Steps
   - Note Test Data
   - Verify Expected Results
   
6. Execute tests:
   - Run each test case
   - Fill in Status (Pass/Fail)
   - Add notes as needed
   
7. Report results:
   - Export/share Excel file
   - Document findings
   - Update JIRA ticket
```

---

## 🚀 YOU'RE READY!

```
/testcase GAAM-933
```

Generate professional test cases instantly! 🎉
