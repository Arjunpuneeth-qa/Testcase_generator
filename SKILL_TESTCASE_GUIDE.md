# /testcase Skill - V4 Intelligent Generator

## 🎯 What is /testcase?

`/testcase` is a custom Claude Code skill that:
- 🧠 Runs V4 intelligent test case generator
- 🎯 Takes JIRA ticket number(s) as input
- 📝 Generates smart, specific test cases
- 📁 Saves output to `/testcase` folder
- ⚡ Integrated into Claude Code

---

## ⚡ QUICK START

### Using the Skill (Recommended)

```
/testcase GAAM-933
```

Single command generates smart test cases!

### Single Ticket
```
/testcase GAAM-933
```

### Multiple Tickets
```
/testcase GAAM-933 GAAM-934 GAAM-935
```

### Direct Command (Alternative)
```bash
node testcase.js GAAM-933
node testcase.js GAAM-933 GAAM-934 GAAM-935
```

---

## 📋 SETUP

### Prerequisites
- ✅ Node.js installed
- ✅ Dependencies installed: `npm install`
- ✅ `.env` file created with JIRA credentials

### One-Time Setup
```powershell
cd C:\Users\PuneethAM\GA_testcases
npm install
notepad .env
# Add: JIRA_EMAIL=am.puneeth@bounteous.com
# Add: JIRA_API_TOKEN=your_token_here
```

Get API token: https://id.atlassian.com/manage-profile/security/api-tokens

---

## 🎯 USAGE EXAMPLES

### Example 1: Single Ticket
```
/testcase GAAM-933
```

**Output:**
```
[INFO] Running V4 generator for 1 ticket(s)...
✓ GAAM-933 - Generated 15 test cases
✓ Excel file created

Generated Files:
  1. GAAM-933
     File: GAAM-933_Feature_Name.xlsx
     Path: C:\Users\PuneethAM\GA_testcases\GA_testcases\...

Output Location: C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

### Example 2: Multiple Tickets
```
/testcase GAAM-933 GAAM-934 GAAM-935
```

**Output:**
```
[INFO] Running V4 generator for 3 ticket(s)...
✓ GAAM-933 - Generated 15 test cases
✓ GAAM-934 - Generated 12 test cases
✓ GAAM-935 - Generated 18 test cases
✓ All Excel files created

Generated Files:
  1. GAAM-933
  2. GAAM-934
  3. GAAM-935
```

### Example 3: Sprint-Wide Batch
```
/testcase GAAM-933 GAAM-934 GAAM-935 GAAM-936 GAAM-937 GAAM-938
```

All test cases generated at once!

---

## 📊 WHAT THE SKILL GENERATES

### Smart Test Cases
- ✅ Feature-specific tests (not generic)
- ✅ Acceptance criteria extraction
- ✅ Detailed step-by-step instructions
- ✅ Component property tests (for AEM)
- ✅ Layout & responsive design tests
- ✅ Validation & functionality tests

### Excel Output
Each file contains:
- **TC_ID** - Test case identifier
- **Test Scenario** - What to test
- **Test Type** - Type of test (Positive, Negative, etc.)
- **Pre-Condition** - What you need before testing
- **Test Steps** - Step-by-step instructions
- **Test Data** - Test data to use
- **Expected Result** - What should happen
- **Brief Description** - Quick summary
- **Status** - Pass/Fail column

### Files Created
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
├── GAAM-933_Feature_Name.xlsx
├── GAAM-934_Another_Feature.xlsx
└── GAAM-935_Third_Feature.xlsx
```

---

## 🔄 WORKFLOW

### Step 1: Generate Test Cases
```
/testcase GAAM-933
```

### Step 2: Open Excel File
Navigate to: `C:\Users\PuneethAM\GA_testcases\GA_testcases\`

### Step 3: Use for Testing
- Read the test cases
- Fill in Status column
- Add notes/comments
- Execute tests
- Share results with team

---

## 🎯 KEY FEATURES

### V4 Intelligence
- 🧠 **Analyzes** ticket description
- 🎯 **Extracts** acceptance criteria
- 🔍 **Detects** specific features:
  - AEM components
  - Form validation
  - External links
  - Click tracking
  - Authentication
  - API endpoints
  - And more...

### Smart Test Generation
- 📝 **Detailed** step-by-step instructions
- 🎨 **Professional** Excel formatting
- ⚡ **Fast** generation (seconds)
- 🔄 **Ready to use** immediately

### Feature Detection
The skill automatically detects:
```
✓ AEM Component Tests
✓ Form Validation Tests
✓ Link/Navigation Tests
✓ Click Tracking Tests
✓ Authentication Tests
✓ API Response Tests
✓ Responsive Design Tests
✓ Data Persistence Tests
✓ And more...
```

---

## 🆘 TROUBLESHOOTING

### Error: "Skill not found"
**Solution:** Make sure CLAUDE.md is in the project with `/testcase` defined

### Error: ".env file not found"
**Solution:** Create .env with credentials:
```powershell
notepad .env
# Add:
# JIRA_EMAIL=am.puneeth@bounteous.com
# JIRA_API_TOKEN=your_token
```

### Error: "V4 generator script not found"
**Solution:** Make sure `jira_testcase_generator_v4.js` exists in the folder

### Error: "Dependencies not installed"
**Solution:**
```powershell
npm install
```

### Error: "HTTP 401"
**Solution:** Get new API token and update .env:
```
https://id.atlassian.com/manage-profile/security/api-tokens
```

### Error: "HTTP 404"
**Solution:** Verify ticket exists:
```
/testcase GAAM-933
```

---

## 📚 RELATED COMMANDS

```powershell
# Skill command (recommended)
/testcase GAAM-933

# Direct Node command
node testcase.js GAAM-933

# Check generated files
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\

# View credentials
Get-Content .env

# Edit credentials
notepad .env

# Install dependencies
npm install

# Check Node version
node --version
```

---

## 🎓 SKILL vs DIRECT COMMAND

| Aspect | Skill | Direct Command |
|--------|-------|-----------------|
| **Usage** | `/testcase GAAM-933` | `node testcase.js GAAM-933` |
| **Convenience** | ✅ Built-in | Manual |
| **Integration** | ✅ Claude-integrated | Manual |
| **Speed** | Same | Same |
| **Features** | Same | Same |

**Recommendation:** Use the skill `/testcase` for better integration!

---

## 📝 SKILL DEFINITION

The skill is defined in `CLAUDE.md`:

```markdown
### /testcase
Generate **INTELLIGENT** test cases using V4 (Smart Generator).

**Usage:**
/testcase GAAM-933                    # Single ticket
/testcase GAAM-933 GAAM-934          # Multiple tickets

**Features:**
- 🧠 Intelligent analysis
- 🎯 Acceptance criteria extraction
- 🔍 Feature detection (AEM, forms, links)
- 📝 Detailed step-by-step instructions
```

---

## 🚀 READY TO USE

The `/testcase` skill is ready to use!

### Try it now:
```
/testcase GAAM-933
```

Your smart test cases will be generated in seconds! ⚡✨

---

## 📖 RELATED GUIDES

- `V4_QUICK_GUIDE.md` - V4 generator guide
- `VERSION_GUIDE.md` - Compare all versions
- `HOW_TO_RUN.md` - Complete setup guide
- `SETUP.md` - Full setup instructions
