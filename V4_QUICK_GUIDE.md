# V4 - Intelligent Test Case Generator - QUICK GUIDE

## 🎯 What is V4?

V4 is the **SMART GENERATOR** that:
- 🧠 Analyzes your ticket description
- 🎯 Extracts acceptance criteria automatically
- 🔍 Detects specific features (AEM, forms, links, tracking, etc.)
- 📝 Generates **specific tests** not generic ones
- 📋 Creates detailed step-by-step instructions

---

## ⚡ RUN IN 3 COMMANDS

```powershell
# 1. Navigate to project
cd C:\Users\PuneethAM\GA_testcases

# 2. Run V4 with your ticket
node jira_testcase_generator_v4.js GAAM-933

# 3. Done! Check: C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

That's it! Your test cases are ready. 🎉

---

## 📋 SETUP REQUIRED (One-Time)

If you haven't set up yet:

```powershell
# 1. Install dependencies
npm install

# 2. Create .env file with credentials
# Use Notepad: notepad .env
# Add:
#   JIRA_EMAIL=am.puneeth@bounteous.com
#   JIRA_API_TOKEN=your_token_here
```

Get API token: https://id.atlassian.com/manage-profile/security/api-tokens

---

## 🚀 RUN V4

### Single Ticket
```powershell
node jira_testcase_generator_v4.js GAAM-933
```

### Multiple Tickets
```powershell
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935
```

### Using Quick-Start Script
```powershell
.\quick-start-v4.ps1 GAAM-933
```

---

## 📊 WHAT YOU GET

Each Excel file contains:

✅ **Test Scenario** - What to test
✅ **Test Type** - Type of test (Positive, Negative, UI, etc.)
✅ **Pre-Condition** - What you need before testing
✅ **Test Steps** - Exact step-by-step instructions
✅ **Test Data** - What data to use
✅ **Expected Result** - What should happen
✅ **Brief Description** - Quick summary
✅ **Status** - Pass/Fail column

### Example Test Cases Generated:
```
TC_001: Verify purple header bar renders with path name
TC_002: Verify optional path description renders
TC_003: Verify header bar renders without description
TC_004: Verify two-column layout renders on desktop
TC_005: Verify statistic block renders
... more specific to your feature
```

---

## 🎯 OUTPUT LOCATION

Your Excel files are created here:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

File format:
```
GAAM-933_Feature_Name.xlsx
GAAM-934_Another_Feature.xlsx
```

---

## 💡 WHY USE V4?

| Why | Benefit |
|-----|---------|
| **Smart Analysis** | Tests match your actual feature |
| **AC Extraction** | Generates test per acceptance criteria |
| **Feature Detection** | Detects AEM, forms, links, tracking, etc. |
| **Detailed Steps** | Ready-to-execute instructions |
| **Specific Tests** | Not generic, tailored to your ticket |

---

## 📝 EXAMPLES

### Example 1: AEM Component Ticket
```
Ticket: GAAM-933 - Create Product Path Summary Card Component

V4 Generates:
✓ Component render tests
✓ Property configuration tests
✓ Layout tests (desktop/mobile)
✓ Responsive design tests
✓ Header rendering tests
✓ Data binding tests
```

### Example 2: Link/Navigation Ticket
```
Ticket: GAAM-934 - Add External Links to Product Page

V4 Generates:
✓ Link functionality tests
✓ External link security tests
✓ URL validation tests
✓ New window/tab tests
✓ 404 error tests
```

### Example 3: Form Validation Ticket
```
Ticket: GAAM-935 - Add User Registration Form

V4 Generates:
✓ Form submission tests
✓ Field validation tests
✓ Error message tests
✓ Required field tests
✓ Data persistence tests
```

---

## 🔧 TROUBLESHOOTING

### Error: "Cannot find module 'exceljs'"
```powershell
npm install
node jira_testcase_generator_v4.js GAAM-933
```

### Error: "JIRA_EMAIL not set"
```powershell
# Create .env file
notepad .env

# Add your credentials
JIRA_EMAIL=am.puneeth@bounteous.com
JIRA_API_TOKEN=your_token_here
```

### Error: "HTTP 401"
```powershell
# Get new API token:
# https://id.atlassian.com/manage-profile/security/api-tokens
# Update .env with new token
notepad .env
```

### Error: "HTTP 404"
```powershell
# Make sure ticket exists
# Try: node jira_testcase_generator_v4.js GAAM-933
# If still fails, verify ticket number
```

---

## ⚙️ COMMAND REFERENCE

```powershell
# Navigate to project
cd C:\Users\PuneethAM\GA_testcases

# Install dependencies (one-time)
npm install

# Run V4 - single ticket
node jira_testcase_generator_v4.js GAAM-933

# Run V4 - multiple tickets
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935

# Use quick-start script
.\quick-start-v4.ps1 GAAM-933

# Open output folder
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\

# View .env
Get-Content .env

# Edit .env
notepad .env
```

---

## 🎯 RECOMMENDED WORKFLOW

### Step 1: Setup (First Time Only)
```powershell
npm install
notepad .env
# Add credentials and save
```

### Step 2: Generate Test Cases
```powershell
node jira_testcase_generator_v4.js GAAM-933
```

### Step 3: Open Excel File
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\GAAM-933_*.xlsx
```

### Step 4: Use for Testing
- Fill in Status column (Pass/Fail)
- Add notes/comments
- Share with team
- Execute tests

---

## 🚀 GET STARTED NOW

Run this command:

```powershell
cd C:\Users\PuneethAM\GA_testcases
node jira_testcase_generator_v4.js GAAM-933
```

Or use the script:

```powershell
cd C:\Users\PuneethAM\GA_testcases
.\quick-start-v4.ps1 GAAM-933
```

Your smart test cases will be ready in **seconds**! ⚡

---

## 📚 RELATED GUIDES

- `VERSION_GUIDE.md` - Compare all versions
- `HOW_TO_RUN.md` - Complete setup guide
- `RUN_V4.md` - Detailed V4 guide
- `SETUP.md` - Full setup instructions
