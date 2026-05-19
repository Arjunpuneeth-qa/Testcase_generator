# 🎯 START HERE - Generate Test Cases in 5 Minutes

## ⚡ ULTRA QUICK START

```
1. Install Node.js → https://nodejs.org/
2. Get API token → https://id.atlassian.com/manage-profile/security/api-tokens
3. Create .env file with credentials
4. Run: npm install
5. Run: .\quick-start.ps1 GAAM-933
6. Open Excel file from: C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

**Time needed:** ~5 minutes ⏱️

---

## 📚 Documentation Map

Choose your learning style:

| 🎯 I Want To... | Read This | Time |
|-----------------|-----------|------|
| Get started NOW | **This file** | 5 min |
| Visual flowchart | `FLOWCHART.md` | 2 min |
| Copy-paste commands | `QUICK_START.md` | 3 min |
| Complete guide | `HOW_TO_RUN.md` | 15 min |
| Full setup details | `SETUP.md` | 20 min |
| Detailed running guide | `RUN_GUIDE.md` | 15 min |

---

## ✅ VERIFICATION CHECKLIST

Before you start, check:

- [ ] Internet connection working
- [ ] Have JIRA account access
- [ ] Administrator rights on computer
- [ ] About 5 minutes free time

---

## 🚀 LET'S DO IT!

### Phase 1: ONE-TIME SETUP (5 minutes)

#### 1.1 Install Node.js (2 minutes)

1. Open browser → https://nodejs.org/
2. Click "LTS" download
3. Run installer → Click "Next" → "Install"
4. **Restart computer**

**Verify:**
```powershell
node --version
# Should show: v18.17.0 (or similar)
```

---

#### 1.2 Get JIRA API Token (1 minute)

1. Visit: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it: `TestCaseGenerator`
4. Click "Create"
5. **Copy the token** (long string)
6. **Save it somewhere** - you'll use it next

---

#### 1.3 Create .env File (1 minute)

1. **Open PowerShell**
2. **Navigate to project:**
   ```powershell
   cd C:\Users\PuneethAM\GA_testcases
   ```

3. **Create .env file:**
   ```powershell
   New-Item -Path ".env" -ItemType File
   ```

4. **Open it:**
   ```powershell
   notepad .env
   ```

5. **Paste this:**
   ```
   JIRA_EMAIL=am.puneeth@bounteous.com
   JIRA_API_TOKEN=your_token_here
   ```

6. **Replace** `your_token_here` with your actual token from step 1.2

7. **Save:** `Ctrl + S`

8. **Close** Notepad

---

#### 1.4 Install Dependencies (1 minute)

In the same PowerShell:

```powershell
npm install
```

Wait for it to finish (you should see "added XX packages")

✅ **SETUP COMPLETE!**

---

### Phase 2: GENERATE TEST CASES (30 seconds)

#### Option A: EASIEST WAY 👈

In PowerShell:

```powershell
.\quick-start.ps1 GAAM-933
```

Replace `GAAM-933` with your ticket number

**For multiple tickets:**
```powershell
.\quick-start.ps1 GAAM-933 GAAM-934 GAAM-935
```

---

#### Option B: DIRECT COMMAND

In PowerShell:

```powershell
node jira_testcase_generator.js GAAM-933
```

---

### Phase 3: OPEN YOUR TEST CASES (10 seconds)

1. Navigate to:
   ```
   C:\Users\PuneethAM\GA_testcases\GA_testcases\
   ```

2. Open the file:
   ```
   GAAM-933_Feature_Name.xlsx
   ```

3. You'll see professional test cases! 🎉

---

## 🎊 What You Get

Each Excel file has:

✅ **6-100 Test Cases** based on complexity
- Positive (Happy Path)
- Negative (Invalid Input)
- Edge Cases (Boundaries)
- Security Tests
- Performance Tests
- Error Handling
- Data Integrity
- Integration Tests
- UI Responsive Design
- UI Accessibility
- And more...

✅ **Professional Format**
- Color-coded headers
- Auto-sized columns
- Proper spacing
- Ready to use

---

## 🆘 QUICK FIXES

### PowerShell says: "File cannot be loaded"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\quick-start.ps1 GAAM-933
```

### Says: "Cannot find module 'exceljs'"

```powershell
npm install
```

### Says: "JIRA_EMAIL not set"

```powershell
# Check .env exists
Get-Content .env

# If missing or wrong, recreate it
notepad .env
```

### Says: "HTTP 401 Error"

```powershell
# Get new API token from:
# https://id.atlassian.com/manage-profile/security/api-tokens
# Then update .env file
```

### Says: "HTTP 404 Error"

```powershell
# Make sure ticket exists
# Try: .\quick-start.ps1 GAAM-933 GAAM-934
```

---

## 🎯 DONE? Here's what's next

1. **Use the test cases** in your testing
2. **Fill in the Status column** with Pass/Fail
3. **Generate more tickets** as needed:
   ```powershell
   .\quick-start.ps1 GAAM-NEW-NUMBER
   ```

4. **Create more .env tokens** if you have multiple JIRA accounts

---

## 📞 NEED DETAILED HELP?

- **Visual guide:** Read `FLOWCHART.md`
- **Commands cheat sheet:** Read `QUICK_START.md`
- **Step-by-step:** Read `HOW_TO_RUN.md`
- **Full setup guide:** Read `SETUP.md`
- **Running details:** Read `RUN_GUIDE.md`

---

## 🚀 READY?

Copy and paste this command:

```powershell
cd C:\Users\PuneethAM\GA_testcases ; .\quick-start.ps1 GAAM-933
```

Your test cases will be ready in **seconds!** ✨

---

## 📋 COMMAND REFERENCE

```powershell
# Navigate to project
cd C:\Users\PuneethAM\GA_testcases

# Setup (first time only)
npm install

# Create .env file
notepad .env

# Generate test cases
.\quick-start.ps1 GAAM-933

# Generate multiple
.\quick-start.ps1 GAAM-933 GAAM-934 GAAM-935

# Open output folder
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\

# View .env
Get-Content .env

# Edit .env
notepad .env
```

---

## ✨ LET'S GO!

```
┌─────────────────────────────────────┐
│  NOW GO RUN:                        │
│                                     │
│  cd C:\Users\PuneethAM\GA_testcases │
│  .\quick-start.ps1 GAAM-933         │
│                                     │
│  You got this! 🚀                   │
└─────────────────────────────────────┘
```
