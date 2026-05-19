# How to Run V4 (Intelligent Test Case Generator)

## 🎯 What is V4?

**V4** is the **Smart/Intelligent Generator** that:
- ✅ Analyzes ticket description and acceptance criteria
- ✅ Generates **specific test cases** based on actual functionality
- ✅ Creates detailed step-by-step test instructions
- ✅ Customized to your feature, not generic tests

---

## ⚡ Quick Start - 30 seconds

### Step 1: Navigate to Project
```powershell
cd C:\Users\PuneethAM\GA_testcases
```

### Step 2: Run V4
```powershell
node jira_testcase_generator_v4.js GAAM-933
```

Or for multiple tickets:
```powershell
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935
```

### Step 3: Find Your Files
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\GAAM-933_*.xlsx
```

---

## 📋 Detailed Instructions

### Prerequisites
- ✅ Node.js installed (see SETUP.md if not)
- ✅ Dependencies installed (`npm install`)
- ✅ `.env` file created with JIRA credentials

### Running V4

**For single ticket:**
```powershell
cd C:\Users\PuneethAM\GA_testcases
node jira_testcase_generator_v4.js GAAM-933
```

**For multiple tickets:**
```powershell
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935
```

**For batch processing:**
```powershell
node jira_testcase_generator_v4.js GAAM-933 GAAM-687 GAAM-625 GAAM-700
```

---

## 📊 What V4 Generates

### Test Types
1. **Feature-Specific Tests** - Based on ticket description
2. **Acceptance Criteria Tests** - One test per AC
3. **Layout Tests** (if UI/AEM component)
4. **Functional Tests** - Detailed step-by-step
5. **Property Tests** - For AEM components
6. **Responsive Design** (if applicable)
7. **Data Validation** (if form-related)

### Example Output
```
GAAM-933_Feature_Name.xlsx

Contains:
- GAAM-933_TC_001: Feature Test 1
- GAAM-933_TC_002: Feature Test 2
- GAAM-933_TC_003: Responsive Design Test
- GAAM-933_TC_004: Validation Test
- ... more tests based on your ticket
```

---

## 🎯 Key Differences - V4 vs Others

| Aspect | V4 (Smart) | V1 (Current) | V2 | V3 |
|--------|-----------|-------------|----|----|
| **Analyzes Content** | ✅ Yes | No | Limited | No |
| **AC-Based Tests** | ✅ Yes | No | No | No |
| **Feature-Specific** | ✅ Yes | No | Yes | Limited |
| **Detailed Steps** | ✅ Yes | No | No | Yes |
| **Responsive Design** | ✅ Yes | No | Limited | Yes |
| **AEM Tests** | ✅ Yes | No | No | Yes |
| **Auto-Detects Features** | ✅ Yes | No | Yes | No |

---

## 💡 Pro Tips

### Tip 1: View Generated Files
```powershell
# Open folder with all generated files
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\

# Or list recent files
Get-ChildItem C:\Users\PuneethAM\GA_testcases\GA_testcases\ -Latest 5
```

### Tip 2: Batch Generate for Sprint
```powershell
# Create a batch of test cases at once
node jira_testcase_generator_v4.js `
  GAAM-933 GAAM-934 GAAM-935 `
  GAAM-936 GAAM-937 GAAM-938
```

### Tip 3: Check Results
V4 outputs:
```
[INFO] Fetching ticket: GAAM-933...
✓ Ticket fetched successfully
✓ Test cases generated
✓ Excel file created

Success! Generated XX test cases
Output: C:\Users\PuneethAM\GA_testcases\GA_testcases\GAAM-933_*.xlsx
```

---

## 🆘 Troubleshooting

### Error: "Module not found: ExcelJS"
```powershell
npm install
node jira_testcase_generator_v4.js GAAM-933
```

### Error: "JIRA_EMAIL not set"
```powershell
# Create/verify .env file
notepad .env

# Should contain:
# JIRA_EMAIL=am.puneeth@bounteous.com
# JIRA_API_TOKEN=your_token_here
```

### Error: "HTTP 401"
```powershell
# Get new API token from:
# https://id.atlassian.com/manage-profile/security/api-tokens
# Update .env with new token
notepad .env
```

### No Excel file created
```powershell
# Create output directory if missing
New-Item -Path "C:\Users\PuneethAM\GA_testcases\GA_testcases" -ItemType Directory -Force

# Try generating again
node jira_testcase_generator_v4.js GAAM-933
```

---

## 📝 Example Commands Reference

```powershell
# V4 - Single ticket
node jira_testcase_generator_v4.js GAAM-933

# V4 - Multiple tickets
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935

# View .env
Get-Content .env

# Edit .env
notepad .env

# Install dependencies
npm install

# Open output folder
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\

# Check Node version
node --version

# Check npm version
npm --version
```

---

## 🚀 Ready?

Run this command now:

```powershell
cd C:\Users\PuneethAM\GA_testcases
node jira_testcase_generator_v4.js GAAM-933
```

Your smart test cases will be generated in seconds! ✨

---

## 📚 For More Info

- `HOW_TO_RUN.md` - Complete setup & running guide
- `SETUP.md` - Full setup with troubleshooting
- `FLOWCHART.md` - Visual guides
- `START_HERE.md` - Quick reference
