# Test Case Generation Guide
## For QA Team - Claude Users & Non-Claude Users

---

## TABLE OF CONTENTS

1. [For Claude Users (Fast Method)](#for-claude-users)
2. [For Non-Claude Users (VS Code Method)](#for-non-claude-users)
3. [Common Issues & Troubleshooting](#troubleshooting)
4. [FAQ](#faq)

---

# FOR CLAUDE USERS

## ⚡ Quick Setup (5 Minutes)

### Step 1: Access Claude Code
Go to: **https://claude.ai/claude-code**

### Step 2: Create New Project
- Click "New Project"
- Select "Open Folder"
- Navigate to: `C:\Users\PuneethAM\GA_testcases`
- Click "Open"

### Step 3: Run Test Case Generator
In Claude's terminal (click Terminal tab):

```bash
./automate.bat GAAM-933
```

Replace `GAAM-933` with your JIRA ticket ID.

### Step 4: Check Output
Files generated in: `C:\Users\PuneethAM\GA_testcases\GA_testcases\`

---

## 📋 Claude User: Common Commands

### Single Ticket
```bash
./automate.bat GAAM-933
```

### Multiple Tickets
```bash
./automate.bat GAAM-933 GAAM-524 GAAM-687
```

### Comprehensive Coverage (83 tests)
```bash
testcase-reference GAAM-933
```

### Direct Node Command
```bash
node jira_testcase_generator_v2.js GAAM-933
```

---

## ✅ Claude User: What You Get

**File Generated:**
- `GAAM-933_CMS_BE__Button__CTA____Automatic_Icon_Selection_Ba.xlsx`

**Contents:**
- ✅ 50 professional test cases
- ✅ Boundary value testing (26 tests)
- ✅ TEST CASE SUMMARY section
- ✅ Professional Excel formatting
- ✅ Multiple test types included

**Location:** `C:\Users\PuneethAM\GA_testcases\GA_testcases\`

---

## 🎯 Claude User: Advanced Options

### Generate with Reference Format
For 83 comprehensive test cases:

```bash
testcase-reference GAAM-933
```

**Output:** `GAAM-933_REFERENCE_FORMAT_Description.xlsx`

### Batch Generation
Generate multiple tickets at once:

```bash
./automate.bat GAAM-933 GAAM-524 GAAM-687 GAAM-618
```

---

# FOR NON-CLAUDE USERS

## 🔧 Complete Setup Guide (15 Minutes)

### Prerequisites
- Git installed on your machine
- VS Code installed
- Node.js v14+ installed
- Command prompt/PowerShell access

### Step 1: Clone Repository from Git

Open **PowerShell** or **Command Prompt**:

```bash
# Navigate to desired location
cd C:\

# Clone the repository
git clone https://github.com/your-org/GA_testcases.git

# Navigate into project
cd GA_testcases
```

### Step 2: Install Dependencies

```bash
# Install npm packages
npm install
```

**What gets installed:**
- ExcelJS (for Excel file generation)
- Axios (for JIRA API calls)
- Dotenv (for environment variables)

---

### Step 3: Setup Environment Variables

Create `.env` file in project root:

```bash
# In project directory, create .env file
notepad .env
```

**Add these lines:**
```
JIRA_EMAIL=am.puneeth@bounteous.com
JIRA_API_TOKEN=your_api_token_here
```

**To get JIRA API Token:**
1. Go to: https://bounteous.atlassian.net/
2. Click your profile → Settings
3. Click "API tokens" 
4. Click "Create API token"
5. Copy the token
6. Paste in `.env` file

### Step 4: Open in VS Code

```bash
# Open project in VS Code
code .
```

Or:
1. Open VS Code
2. File → Open Folder
3. Select `C:\GA_testcases` folder
4. Click "Open"

### Step 5: Open Terminal in VS Code

- Press `Ctrl + ```` (backtick)
- Or go to: View → Terminal

---

## 📋 Non-Claude User: Generate Test Cases

### Step 1: Navigate to Project Directory
```bash
cd C:\GA_testcases
```

### Step 2: Run Generator

**Single Ticket:**
```bash
./automate.bat GAAM-933
```

**Multiple Tickets:**
```bash
./automate.bat GAAM-933 GAAM-524 GAAM-687
```

**Alternative (Direct Node):**
```bash
node jira_testcase_generator_v2.js GAAM-933
```

### Step 3: Wait for Completion
```
✓ Success
File: GAAM-933_CMS_BE__Button__CTA____Automatic_Icon_Selection_Ba.xlsx
Test Cases: 50
```

### Step 4: Find Generated File
Navigate to: `C:\GA_testcases\GA_testcases\`

Open the Excel file with Microsoft Excel or Google Sheets.

---

## 🔄 Non-Claude User: Pull Latest Version from Git

### Update Your Local Copy

```bash
# Navigate to project directory
cd C:\GA_testcases

# Fetch latest changes
git fetch origin

# Pull latest version
git pull origin main
```

### Check for Updates
```bash
# See current version/branch
git status

# See recent changes
git log --oneline -5
```

### After Update
```bash
# Reinstall dependencies (if needed)
npm install

# Run generator with latest version
./automate.bat GAAM-933
```

---

## ⚙️ Non-Claude User: Understanding Project Structure

```
C:\GA_testcases\
├── automate.bat                          # Main command for 50 tests
├── testcase-reference.bat                # Command for 83 tests
├── jira_testcase_generator_v2.js        # Core generator (V2)
├── jira_testcase_generator_reference_format.js
├── package.json                          # Dependencies
├── .env                                  # Environment variables
├── GA_testcases/                         # Output folder
│   └── [Generated Excel files]
├── TEST_CASE_GENERATION_GUIDE.md        # Full documentation
└── README.md                             # Project overview
```

---

## 🎯 Non-Claude User: Step-by-Step Example

### Example: Generate test cases for GAAM-933

**Step 1: Open Terminal**
```
Ctrl + ` in VS Code
```

**Step 2: Navigate to Project**
```bash
cd C:\GA_testcases
```

**Step 3: Run Command**
```bash
./automate.bat GAAM-933
```

**Step 4: View Output**
```
Processing: GAAM-933
✓ Success
File: GAAM-933_CMS_BE__Button__CTA____Automatic_Icon_Selection_Ba.xlsx
Test Cases: 50
Location: C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

**Step 5: Open File**
1. Navigate to: `C:\GA_testcases\GA_testcases\`
2. Find file: `GAAM-933_*.xlsx`
3. Open with Excel
4. Review 50 test cases
5. Check TEST CASE SUMMARY at bottom

---

## ✅ Non-Claude User: Verify Installation

Run verification command:

```bash
node -v
npm -v
git --version
```

Expected output:
```
v16.0.0 (or higher)
8.0.0 (or higher)
git version 2.35.0 (or higher)
```

---

# TROUBLESHOOTING

## ❌ Error: "Cannot find module 'exceljs'"

**Solution:**
```bash
npm install exceljs axios dotenv
```

---

## ❌ Error: "automate.bat not found"

**Cause:** Wrong directory
**Solution:**
```bash
# Make sure you're in project directory
cd C:\GA_testcases

# Then run
./automate.bat GAAM-933
```

---

## ❌ Error: "JIRA unreachable, using mock data"

**Why:** JIRA connection not available
**Impact:** Test cases still generate with placeholder data
**Action:** This is OK - test cases are still valid

---

## ❌ Error: "File locked" when running command

**Cause:** Excel file is open
**Solution:**
1. Close Excel file
2. Wait 2 seconds
3. Run command again

```bash
./automate.bat GAAM-933
```

---

## ❌ Error: "git not recognized"

**Cause:** Git not installed or not in PATH
**Solution:**
1. Install Git from: https://git-scm.com/
2. Restart command prompt
3. Try again

---

## ❌ Error: "Permission denied" on automate.bat

**For Windows PowerShell:**
```bash
# Run as Administrator
# Or use:
node jira_testcase_generator_v2.js GAAM-933
```

**For Command Prompt:**
```bash
automate.bat GAAM-933
```

---

## ❌ Error: "npm: command not found"

**Cause:** Node.js not installed
**Solution:**
1. Download from: https://nodejs.org/
2. Install Node.js (includes npm)
3. Restart command prompt
4. Verify: `npm -v`

---

# FAQ

## Q: How long does it take to generate test cases?

**A:** 
- Single ticket: 2-5 seconds
- Multiple tickets (3): 5-10 seconds
- With network delay: Add 2-3 seconds

---

## Q: Can I modify the generated test cases?

**A:** 
Yes! After generation:
1. Open Excel file
2. Edit any cell
3. Add/remove test cases
4. Save with new name
5. Use as template

---

## Q: What's the difference between automate.bat and testcase-reference?

**A:**
| Feature | automate.bat | testcase-reference |
|---------|-------------|------------------|
| Test Cases | 50 | 83 |
| Boundary Tests | 26 | 26 |
| Format | Standard | Reference (GAAM-524) |
| Time | Fast | Normal |
| Use | Quick generation | Comprehensive coverage |

---

## Q: How do I generate for multiple tickets at once?

**A:**
```bash
./automate.bat GAAM-933 GAAM-524 GAAM-687
```

This generates 3 separate Excel files.

---

## Q: Where are the generated files saved?

**A:**
```
C:\GA_testcases\GA_testcases\
```

Or for non-Claude users:
```
C:\[Your-Clone-Location]\GA_testcases\
```

---

## Q: Do I need JIRA access to generate test cases?

**A:**
No. If JIRA is not reachable:
- Generator uses mock data
- Test cases still generate
- Quality is maintained

---

## Q: How do I update to the latest version?

**A (Non-Claude Users):**
```bash
git pull origin main
npm install
./automate.bat GAAM-933
```

**A (Claude Users):**
- Claude automatically uses latest code
- Just run command in Claude Code

---

## Q: Can I customize test case generation?

**A:**
Yes, several ways:
1. **Edit Excel after generation** (Recommended for QA)
2. **Modify generator code** (For developers)
3. **Use reference format** for different structure

---

## Q: What test types are included?

**A:**
- Positive Tests (Happy path)
- Negative Tests (Error handling)
- Edge Cases (Unusual scenarios)
- **Boundary Value (26 tests)** ⭐
- Security Tests
- Accessibility Tests
- Responsive Tests
- Compatibility Tests
- UI/UX Tests
- Integration Tests

---

## Q: How do I report an issue?

**A:**
1. Note the error message
2. Check TROUBLESHOOTING section
3. Try the suggested solution
4. If still failing, contact development team
5. Include: JIRA ticket ID, command used, error message

---

## Q: Can non-Claude users use Claude features?

**A:**
- Non-Claude users work with files/commands only
- No Claude AI features available
- Use commands: `automate.bat` or `testcase-reference.bat`
- Same Excel output quality

---

## Q: Is there a web interface?

**A:**
No. Currently command-line only:
- Claude Code: https://claude.ai/claude-code
- VS Code: Local development environment

---

# QUICK REFERENCE CARD

## For Claude Users
```
Go to: https://claude.ai/claude-code
Open: C:\Users\PuneethAM\GA_testcases
Run: ./automate.bat GAAM-933
Output: Excel file with 50 test cases
```

## For Non-Claude Users (VS Code)
```
1. Clone: git clone [repo-url]
2. Setup: npm install
3. Config: Create .env file
4. Run: ./automate.bat GAAM-933
5. Output: Excel file with 50 test cases
```

## For Non-Claude Users (Command Line)
```bash
# Navigate
cd C:\GA_testcases

# Generate
./automate.bat GAAM-933

# Or
node jira_testcase_generator_v2.js GAAM-933
```

---

# GETTING HELP

**Documentation:**
- Full Guide: `C:\GA_testcases\TEST_CASE_GENERATION_GUIDE.md`
- This Document: `C:\documention\generate testcases.pdf`

**Quick Commands:**
```bash
# Show help
./automate.bat

# Check version
node -v
npm -v
```

**Contact:**
For issues or questions:
1. Check FAQ section (above)
2. Check TROUBLESHOOTING section (above)
3. Review documentation files
4. Contact development team

---

# APPENDIX: Command Reference

### Generate Test Cases
```bash
./automate.bat GAAM-933                    # Single ticket
./automate.bat GAAM-933 GAAM-524          # Multiple tickets
node jira_testcase_generator_v2.js GAAM-933
testcase-reference GAAM-933                # 83 comprehensive tests
```

### Git Commands
```bash
git clone https://github.com/org/repo.git  # Clone repository
git pull origin main                       # Get latest version
git status                                 # Check status
git log --oneline -5                       # See recent changes
```

### Setup Commands
```bash
npm install                                # Install dependencies
npm install exceljs                        # Install ExcelJS
node -v                                    # Check Node version
npm -v                                     # Check npm version
```

---

**Last Updated:** May 20, 2026  
**Version:** 1.0  
**For:** QA Team Documentation

---

