# Visual Flowchart - How to Generate Test Cases

## 🎯 QUICK VISUAL GUIDE

```
START
  ↓
Have you done setup before?
  ├─ NO → Go to SETUP FLOWCHART below
  └─ YES → Go to GENERATION FLOWCHART below
```

---

## 📋 SETUP FLOWCHART (First Time Only)

```
┌─────────────────────────────────────────┐
│  SETUP: Do this ONCE                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  1️⃣ Install Node.js                     │
│  - Download: nodejs.org                 │
│  - Run installer                        │
│  - Restart computer                     │
│  - Verify: node --version               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2️⃣ Get JIRA API Token                  │
│  - Visit: id.atlassian.com/             │
│          manage-profile/security/       │
│          api-tokens                     │
│  - Click "Create API token"             │
│  - Copy the token                       │
│  - Save it (you'll need it next)        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3️⃣ Create .env File                    │
│  Location:                              │
│  C:\Users\PuneethAM\GA_testcases\.env   │
│                                         │
│  Content:                               │
│  JIRA_EMAIL=your_email@domain.com       │
│  JIRA_API_TOKEN=your_token_here         │
│                                         │
│  Save and close                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  4️⃣ Install Dependencies                │
│  Open PowerShell in:                    │
│  C:\Users\PuneethAM\GA_testcases\       │
│                                         │
│  Run: npm install                       │
│  Wait 30-60 seconds                     │
│  Should see: "added XX packages"        │
└─────────────────────────────────────────┘
              ↓
    ✅ SETUP COMPLETE! ✅
```

---

## 🚀 GENERATION FLOWCHART (Every Time)

```
┌─────────────────────────────────────────┐
│  GENERATE: Do this each time            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  OPTION A: Use Quick-Start Script       │
│  (EASIEST - RECOMMENDED)                │
│                                         │
│  Open PowerShell                        │
│  cd C:\Users\PuneethAM\GA_testcases     │
│                                         │
│  Command:                               │
│  .\quick-start.ps1 GAAM-933             │
│                                         │
│  For multiple:                          │
│  .\quick-start.ps1 GAAM-933 GAAM-934    │
└─────────────────────────────────────────┘
              ↓ OR ↓
┌─────────────────────────────────────────┐
│  OPTION B: Direct Command               │
│                                         │
│  Open PowerShell                        │
│  cd C:\Users\PuneethAM\GA_testcases     │
│                                         │
│  Command:                               │
│  node jira_testcase_generator.js        │
│  GAAM-933                               │
│                                         │
│  For multiple:                          │
│  node jira_testcase_generator.js        │
│  GAAM-933 GAAM-934                      │
└─────────────────────────────────────────┘
              ↓
        ⏳ WAITING...
        (Usually 5-10 seconds)
              ↓
        Did it succeed?
         ├─ YES → Go to "OPEN FILES"
         └─ NO → Go to "TROUBLESHOOTING"
              ↓
┌─────────────────────────────────────────┐
│  OPEN FILES                             │
│                                         │
│  Location:                              │
│  C:\Users\PuneethAM\GA_testcases\       │
│  GA_testcases\                          │
│                                         │
│  Files like:                            │
│  GAAM-933_Feature_Name.xlsx             │
│                                         │
│  Double-click to open in Excel          │
└─────────────────────────────────────────┘
              ↓
        ✅ TEST CASES GENERATED! ✅
```

---

## ⚙️ QUICK COMMAND CHEAT SHEET

```
╔════════════════════════════════════════════════════════════╗
║            COPY & PASTE COMMANDS                           ║
╚════════════════════════════════════════════════════════════╝

📂 Navigate to project:
   cd C:\Users\PuneethAM\GA_testcases

📦 Install dependencies (ONE TIME):
   npm install

✅ Generate test cases (EASIEST):
   .\quick-start.ps1 GAAM-933

✅ Generate multiple tickets:
   .\quick-start.ps1 GAAM-933 GAAM-934 GAAM-935

📄 Generate (direct command):
   node jira_testcase_generator.js GAAM-933

📊 Open output folder:
   explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\

📝 View .env file:
   Get-Content .env

🔧 Edit .env file:
   notepad .env
```

---

## 🎯 3-STEP QUICK START

```
┌──────────────────────────────────────────────────┐
│  IF YOU'RE IN A HURRY - 3 STEPS                  │
└──────────────────────────────────────────────────┘

STEP 1: Open PowerShell
   └─ Right-click → Open PowerShell here

STEP 2: Run these commands one by one:
   npm install
   
STEP 3: Create .env with your credentials:
   notepad .env
   └─ Add: JIRA_EMAIL=am.puneeth@bounteous.com
   └─ Add: JIRA_API_TOKEN=your_token_here

STEP 4: Generate!
   .\quick-start.ps1 GAAM-933

DONE! ✅ Check: C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

---

## 🆘 QUICK TROUBLESHOOTING

```
┌──────────────────────────────────────────────────┐
│  ERROR → SOLUTION                                │
└──────────────────────────────────────────────────┘

❌ "Can't find module 'exceljs'"
   └─ Run: npm install

❌ "JIRA_EMAIL not set"
   └─ Create .env file with credentials

❌ "HTTP 401 Error"
   └─ Get new API token from id.atlassian.com

❌ "HTTP 404 Error"
   └─ Verify ticket exists (GAAM-933)

❌ "PowerShell: File cannot be loaded"
   └─ Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

❌ "Node not found"
   └─ Download & install from nodejs.org

✅ All working but no Excel file created?
   └─ Create output folder:
      New-Item -Path "C:\Users\PuneethAM\GA_testcases\GA_testcases" -ItemType Directory -Force
```

---

## 📊 WHAT YOU'LL GET

```
YOUR GENERATED EXCEL FILE CONTAINS:

┌────────────────────────────────────────┐
│  Test Case Report                      │
│  File: GAAM-933_Feature_Name.xlsx      │
├────────────────────────────────────────┤
│                                        │
│  Row 1: Header Info                    │
│  ├─ Test ID: GAAM-933                  │
│  ├─ Test Name: Feature Name            │
│  └─ Tested URL: Dev/DR Environment     │
│                                        │
│  Row 2: Column Headers (Blue)          │
│  ├─ TC_ID                              │
│  ├─ Test Scenario                      │
│  ├─ Test Type                          │
│  ├─ Pre-Condition                      │
│  ├─ Test Steps                         │
│  ├─ Test Data                          │
│  ├─ Expected Result                    │
│  ├─ Brief Description                  │
│  └─ Status                             │
│                                        │
│  Row 3+: Test Cases (6-100)            │
│  ├─ GAAM-933_TC_001: Positive Test     │
│  ├─ GAAM-933_TC_002: Negative Test     │
│  ├─ GAAM-933_TC_003: Edge Case         │
│  ├─ GAAM-933_TC_004: Security          │
│  ├─ GAAM-933_TC_005: Performance       │
│  ├─ GAAM-933_TC_006: Error Handling    │
│  ├─ GAAM-933_TC_007: Data Integrity    │
│  ├─ GAAM-933_TC_008: Integration       │
│  ├─ GAAM-933_TC_009: UI Responsive     │
│  ├─ GAAM-933_TC_010: Accessibility     │
│  └─ More... (based on complexity)      │
│                                        │
└────────────────────────────────────────┘
```

---

## ✨ YOU'RE READY!

```
   🎉 RUN THIS NOW 🎉

   cd C:\Users\PuneethAM\GA_testcases
   .\quick-start.ps1 GAAM-933

   Your test cases will be ready in seconds!
```

---

## 📖 DETAILED GUIDES

- `HOW_TO_RUN.md` - Complete step-by-step guide
- `SETUP.md` - Full setup with troubleshooting
- `RUN_GUIDE.md` - Running instructions
- `QUICK_START.md` - Quick reference
