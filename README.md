# JIRA Test Case Generator - Complete Package

## 🎉 What You Have

A complete, professional test case generation system with:
- ✅ 5 generator versions (V2-V4, Current, Ultimate)
- ✅ Custom Claude Code `/testcase` skill
- ✅ Multiple documentation guides
- ✅ Quick-start scripts
- ✅ Production-ready code

---

## 🚀 QUICK START - Choose Your Style

### Option 1: Use the Skill (Easiest)
```
/testcase GAAM-933
```

### Option 2: Use Quick-Start Script
```powershell
.\quick-start-v4.ps1 GAAM-933
```

### Option 3: Direct Command
```powershell
node jira_testcase_generator_v4.js GAAM-933
```

All generate the same smart test cases in seconds! ⚡

---

## 📚 DOCUMENTATION MAP

### For Beginners
- **START_HERE.md** - 5-minute quickstart
- **QUICK_START.md** - Copy-paste commands
- **FLOWCHART.md** - Visual guides

### For V4 Users
- **V4_QUICK_GUIDE.md** - V4-specific guide
- **RUN_V4.md** - Detailed V4 instructions
- **SKILL_TESTCASE_GUIDE.md** - Using `/testcase` skill

### For Everything
- **HOW_TO_RUN.md** - Complete guide
- **SETUP.md** - Full setup with troubleshooting
- **VERSION_GUIDE.md** - Compare all versions
- **RUN_GUIDE.md** - Running instructions

---

## 🎯 GENERATORS AVAILABLE

### V4 - Intelligent (⭐ RECOMMENDED)
**Smart test case generation based on ticket analysis**

```powershell
node jira_testcase_generator_v4.js GAAM-933
.\quick-start-v4.ps1 GAAM-933
/testcase GAAM-933
```

Features:
- 🧠 Analyzes ticket description
- 🎯 Extracts acceptance criteria
- 🔍 Feature detection (AEM, forms, links, tracking)
- 📝 Detailed step-by-step instructions
- ⚡ Fast (seconds)

### Current - Refactored (⭐ GENERAL PURPOSE)
**Well-organized, 10+ test types**

```powershell
node jira_testcase_generator.js GAAM-933
.\quick-start.ps1 GAAM-933
/automate GAAM-933
```

Features:
- ✅ Clean architecture
- ✅ Highly configurable
- ✅ 10+ test types
- ✅ Professional output

### ULTIMATE - Complete Package
**Combines all features from all versions**

```powershell
node jira_testcase_generator_ultimate.js GAAM-933
```

Features:
- 🧠 V4 intelligence
- 📝 V3 detailed steps
- 🔍 V2 feature detection
- ✅ V1 architecture

### V2 - Feature-Specific
**Focuses on specific features**

```powershell
node jira_testcase_generator_v2.js GAAM-933
```

### V3 - AEM-Detailed
**AEM component testing with detailed steps**

```powershell
node jira_testcase_generator_v3.js GAAM-933
```

---

## 📊 OUTPUT

Each generator creates professional Excel files:

**Location:**
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

**File Format:**
```
GAAM-933_Feature_Name.xlsx
```

**Contents:**
- 6-100 test cases based on complexity
- Detailed step-by-step instructions
- Pre-conditions and test data
- Expected results
- Ready-to-execute format

---

## ⚙️ SETUP (One-Time)

### 1. Install Node.js
Download from https://nodejs.org/

### 2. Install Dependencies
```powershell
cd C:\Users\PuneethAM\GA_testcases
npm install
```

### 3. Create .env File
```powershell
notepad .env
```

Add:
```
JIRA_EMAIL=am.puneeth@bounteous.com
JIRA_API_TOKEN=your_token_here
```

Get API token: https://id.atlassian.com/manage-profile/security/api-tokens

### 4. Verify Setup
```powershell
node --version
npm list exceljs
Get-Content .env
```

---

## 🎯 USAGE EXAMPLES

### Single Ticket
```powershell
/testcase GAAM-933
# or
node jira_testcase_generator_v4.js GAAM-933
```

### Multiple Tickets
```powershell
/testcase GAAM-933 GAAM-934 GAAM-935
# or
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935
```

### Batch Generation
```powershell
node jira_testcase_generator_v4.js GAAM-933 GAAM-934 GAAM-935 GAAM-936 GAAM-937 GAAM-938
```

### Using Scripts
```powershell
.\quick-start-v4.ps1 GAAM-933
.\quick-start.ps1 GAAM-933
.\quick-start.bat GAAM-933
```

---

## 📋 FILE STRUCTURE

```
GA_testcases/
├── README.md (this file)
├── VERSION_GUIDE.md
├── HOW_TO_RUN.md
├── SETUP.md
├── QUICK_START.md
├── START_HERE.md
├── FLOWCHART.md
├── V4_QUICK_GUIDE.md
├── RUN_V4.md
├── RUN_GUIDE.md
├── SKILL_TESTCASE_GUIDE.md
│
├── CLAUDE.md (Project instructions with /testcase skill)
│
├── jira_testcase_generator.js (Current - Refactored)
├── jira_testcase_generator_v2.js (Feature-specific)
├── jira_testcase_generator_v3.js (AEM detailed)
├── jira_testcase_generator_v4.js (Intelligent) ⭐
├── jira_testcase_generator_ultimate.js (Combined)
│
├── testcase.js (Skill wrapper for /testcase)
├── quick-start.ps1 (PowerShell script - Current)
├── quick-start-v4.ps1 (PowerShell script - V4) ⭐
├── quick-start.bat (Batch script)
│
├── .env (Your credentials - create this!)
├── .env.example (Template)
├── package.json (Dependencies)
│
└── GA_testcases/ (Output folder - auto-created)
    ├── GAAM-933_Feature_Name.xlsx
    ├── GAAM-934_Another_Feature.xlsx
    └── ... (your generated test cases)
```

---

## 🎓 DECISION MATRIX

| Use Case | Generator | Command |
|----------|-----------|---------|
| Want smart tests | V4 | `/testcase GAAM-933` |
| Want general purpose | Current | `/automate GAAM-933` |
| Want everything | ULTIMATE | `node jira_testcase_generator_ultimate.js` |
| Want feature-specific | V2 | `node jira_testcase_generator_v2.js` |
| Want AEM-detailed | V3 | `node jira_testcase_generator_v3.js` |

---

## 🆘 COMMON ISSUES

### Issue: "Skill not recognized"
**Solution:** Use direct command instead:
```powershell
node jira_testcase_generator_v4.js GAAM-933
```

### Issue: ".env not found"
**Solution:** Create it:
```powershell
notepad .env
# Add credentials
```

### Issue: "Cannot find module"
**Solution:** Install dependencies:
```powershell
npm install
```

### Issue: "HTTP 401 Error"
**Solution:** Get new API token:
https://id.atlassian.com/manage-profile/security/api-tokens

---

## 📈 FEATURES

### Intelligence
- ✅ Analyzes ticket description
- ✅ Extracts acceptance criteria
- ✅ Detects specific features
- ✅ Smart test case generation

### Test Types Generated
- ✅ Positive (Happy Path)
- ✅ Negative (Invalid Input)
- ✅ Edge Cases
- ✅ Security
- ✅ Performance
- ✅ Error Handling
- ✅ Data Integrity
- ✅ Integration
- ✅ UI Responsive
- ✅ UI Accessibility
- ✅ And more...

### Output Quality
- ✅ Professional Excel formatting
- ✅ Color-coded headers
- ✅ Auto-sized columns
- ✅ Detailed instructions
- ✅ Ready to execute

---

## 🚀 GETTING STARTED

### 5-Minute Setup
1. Install Node.js
2. Run `npm install`
3. Create `.env` file
4. Done!

### 30-Second Generation
```powershell
/testcase GAAM-933
```

### Instant Results
Check: `C:\Users\PuneethAM\GA_testcases\GA_testcases\GAAM-933_*.xlsx`

---

## 💡 PRO TIPS

### Tip 1: Batch Generate
```powershell
/testcase GAAM-933 GAAM-934 GAAM-935 GAAM-936
```

### Tip 2: Quick View Generated Files
```powershell
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

### Tip 3: Edit Credentials Anytime
```powershell
notepad .env
```

### Tip 4: Check Node/npm Status
```powershell
node --version
npm --version
npm list exceljs
```

---

## 📞 SUPPORT

### Documentation
- Quick guides: `START_HERE.md`, `QUICK_START.md`
- V4 specific: `V4_QUICK_GUIDE.md`, `RUN_V4.md`
- Complete: `HOW_TO_RUN.md`, `SETUP.md`
- Comparison: `VERSION_GUIDE.md`
- Skill: `SKILL_TESTCASE_GUIDE.md`

### Troubleshooting
See: `SETUP.md` (Troubleshooting section)

---

## ✨ YOU'RE READY!

### Start Here:
```powershell
# Option 1: Use the skill
/testcase GAAM-933

# Option 2: Use V4 directly
node jira_testcase_generator_v4.js GAAM-933

# Option 3: Use quick-start script
.\quick-start-v4.ps1 GAAM-933
```

Your smart test cases will be ready in **seconds!** 🎉

---

## 📊 TECHNOLOGY STACK

- **Runtime:** Node.js v12+
- **Test Cases:** Excel format (.xlsx)
- **Dependencies:** exceljs, dotenv
- **API:** JIRA REST API v2
- **Code Quality:** Clean architecture, well-documented
- **Skills:** Custom Claude Code skill support

---

## 🎯 NEXT STEPS

1. **Read:** `START_HERE.md` or `V4_QUICK_GUIDE.md`
2. **Setup:** `npm install` + create `.env`
3. **Generate:** `/testcase GAAM-933`
4. **Use:** Open the Excel file
5. **Execute:** Run the test cases

---

**Happy Testing!** ✨

Generated with ❤️ for Arjun Puneeth
