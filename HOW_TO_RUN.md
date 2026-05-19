# How to Run and Generate Test Cases - Complete Guide

## 📋 Prerequisites Checklist

- [ ] Node.js installed (version 12+)
- [ ] Internet connection
- [ ] JIRA credentials (email & API token)
- [ ] Access to JIRA tickets

---

## 🎯 Complete Step-by-Step Instructions

### PART 1: ONE-TIME SETUP (Do this once)

#### Step 1.1: Download and Install Node.js

1. Go to: https://nodejs.org/
2. Click "LTS" (Long Term Support) version
3. Download the Windows Installer
4. Run the installer:
   - Click "Next" through all screens
   - Use default settings
   - Click "Install"
5. **Restart your computer**

**Verify installation:**
```
Open PowerShell or Command Prompt and type:
node --version

You should see something like: v18.17.0
```

---

#### Step 1.2: Get Your JIRA API Token

1. Visit: https://id.atlassian.com/manage-profile/security/api-tokens
2. Login with your JIRA account (if not already logged in)
3. Click **"Create API token"** button
4. Enter name: `Test Case Generator`
5. Click **"Create"**
6. **Copy the token** that appears (it's a long string)
7. **Save it somewhere safe** - you'll need it in next step

**Example token looks like:**
```
atatt12345abcde67890xyz...
```

---

#### Step 1.3: Create the .env File

This file stores your JIRA credentials.

**Method A: Using PowerShell (Recommended)**

1. Open PowerShell
2. Navigate to project folder:
   ```powershell
   cd C:\Users\PuneethAM\GA_testcases
   ```

3. Create .env file:
   ```powershell
   New-Item -Path ".env" -ItemType File
   ```

4. Open it in Notepad:
   ```powershell
   notepad .env
   ```

5. Copy and paste this:
   ```
   JIRA_EMAIL=am.puneeth@bounteous.com
   JIRA_API_TOKEN=paste_your_token_here
   ```

6. Replace `paste_your_token_here` with your actual API token from Step 1.2

7. Save file: `Ctrl + S`

8. Close Notepad

**Method B: Manual File Creation**

1. Open File Explorer
2. Navigate to: `C:\Users\PuneethAM\GA_testcases\`
3. Right-click → New → Text Document
4. Name it: `.env` (with the dot)
5. Open with Notepad
6. Add your credentials (as shown above)
7. Save and close

---

#### Step 1.4: Install Project Dependencies

1. Open PowerShell
2. Go to project folder:
   ```powershell
   cd C:\Users\PuneethAM\GA_testcases
   ```

3. Run:
   ```powershell
   npm install
   ```

4. Wait for it to finish (should take 30-60 seconds)

5. You should see:
   ```
   added XX packages
   ```

✅ **Setup is complete!** You only need to do this once.

---

### PART 2: GENERATE TEST CASES (Do this every time you need test cases)

#### Option A: Using the Quick-Start Script (EASIEST) 👈 RECOMMENDED

1. Open PowerShell
2. Go to project folder:
   ```powershell
   cd C:\Users\PuneethAM\GA_testcases
   ```

3. Run script with ticket number:
   ```powershell
   .\quick-start.ps1 GAAM-933
   ```

4. Wait for it to complete (usually 5-10 seconds)

5. You'll see:
   ```
   ✓ GAAM-933 - Generated XX test cases
   [INFO] Test cases have been generated in:
      C:\Users\PuneethAM\GA_testcases\GA_testcases\
   ```

**For multiple tickets:**
```powershell
.\quick-start.ps1 GAAM-933 GAAM-934 GAAM-935
```

---

#### Option B: Direct Command (More Control)

1. Open PowerShell
2. Go to project folder:
   ```powershell
   cd C:\Users\PuneethAM\GA_testcases
   ```

3. Run single ticket:
   ```powershell
   node jira_testcase_generator.js GAAM-933
   ```

4. Run multiple tickets:
   ```powershell
   node jira_testcase_generator.js GAAM-933 GAAM-934 GAAM-935
   ```

5. Wait for completion

---

#### Option C: Using npm (For Advanced Users)

If you added the npm script to `package.json`:

```powershell
npm run generate GAAM-933
```

---

## 📁 Finding Your Generated Test Cases

### Location:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

### File Names:
```
GAAM-933_Test_Case_Name.xlsx
GAAM-934_Another_Feature.xlsx
```

### How to Open:
1. Open File Explorer
2. Navigate to: `C:\Users\PuneethAM\GA_testcases\GA_testcases\`
3. Double-click the .xlsx file
4. It opens in Excel

---

## 📊 What You'll Get

Each Excel file contains:

| Column | Description |
|--------|-------------|
| TC_ID | Test Case ID (e.g., GAAM-933_TC_001) |
| Test Scenario | Detailed test scenario name |
| Test Type | Type of test (Functional, Security, Performance, etc.) |
| Pre-Condition | Setup required before test |
| Test Steps | Step-by-step test instructions |
| Test Data | Test data to use |
| Expected Result | What should happen |
| Brief Description | Short summary |
| Status | Pass/Fail status (for you to fill) |

### Example Test Cases Generated:
1. **Positive - Happy Path** ✅
2. **Negative - Invalid Input** ❌
3. **Edge Case - Boundary Conditions** 🔚
4. **Security - Unauthorized Access** 🔒
5. **Performance - Load & Concurrency** ⚡
6. **Error Handling & Recovery** 💥
7. **Data Integrity** 📊
8. **Integration** 🔗
9. **UI Responsive Design** 📱
10. **UI Accessibility** ♿

And more... based on ticket complexity!

---

## 🎯 Quick Reference Commands

```powershell
# Navigate to project
cd C:\Users\PuneethAM\GA_testcases

# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies (one-time)
npm install

# Generate for single ticket (EASIEST)
.\quick-start.ps1 GAAM-933

# Generate for single ticket (direct)
node jira_testcase_generator.js GAAM-933

# Generate for multiple tickets
node jira_testcase_generator.js GAAM-933 GAAM-934 GAAM-935

# View .env file contents
Get-Content .env

# Open output folder
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

---

## ✅ Verification Checklist

Before generating test cases, verify everything is ready:

```powershell
# 1. Check Node.js is installed
node --version
# Should show: v18.17.0 (or similar)

# 2. Check npm is installed
npm --version
# Should show: 9.6.7 (or similar)

# 3. Check .env file exists
Get-Content .env
# Should show your email and token

# 4. Check dependencies installed
Get-ChildItem node_modules
# Should show folders like exceljs, dotenv, etc.

# 5. Try generating test case
node jira_testcase_generator.js GAAM-933
# Should complete successfully
```

---

## ❓ Troubleshooting

### Issue: "PowerShell: File cannot be loaded"

**Solution:**
```powershell
# Run this command once:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again:
.\quick-start.ps1 GAAM-933
```

---

### Issue: "JIRA_EMAIL environment variable is not set"

**Solution:**
1. Check .env file exists: `Get-Content .env`
2. If missing, create it (see Step 1.3)
3. Make sure it has your credentials
4. Save the file
5. Try again

---

### Issue: "Cannot find module 'exceljs'"

**Solution:**
```powershell
# Install dependencies
npm install

# Try generating again
node jira_testcase_generator.js GAAM-933
```

---

### Issue: "JIRA API error (HTTP 401)"

**Solution:**
1. Get new API token: https://id.atlassian.com/manage-profile/security/api-tokens
2. Update .env file with new token
3. Try again

---

### Issue: "JIRA API error (HTTP 404)"

**Solution:**
1. Make sure ticket exists (e.g., GAAM-933)
2. Make sure you have access to it
3. Try a different ticket to verify it works

---

### Issue: Excel file not created

**Solution:**
```powershell
# Create output folder if missing
New-Item -Path "C:\Users\PuneethAM\GA_testcases\GA_testcases" -ItemType Directory -Force

# Try generating again
node jira_testcase_generator.js GAAM-933
```

---

## 🚀 Let's Get Started!

### Quick Start (Copy & Paste)

```powershell
# 1. Navigate to project
cd C:\Users\PuneethAM\GA_testcases

# 2. Install (one time only)
npm install

# 3. Create .env file (one time only)
# - Use Notepad to create .env
# - Add your JIRA email and API token

# 4. Generate test cases
.\quick-start.ps1 GAAM-933

# 5. Open the Excel file
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

---

## 📞 Need Help?

1. Check the **Troubleshooting** section above
2. Verify your `.env` file is correct
3. Try with a different ticket
4. Check your internet connection
5. Get a fresh API token if needed

---

## 💡 Tips & Tricks

**Batch Generate Multiple Tickets:**
```powershell
.\quick-start.ps1 GAAM-933 GAAM-934 GAAM-935
```

**Open Output Folder Directly:**
```powershell
explorer C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

**View Generated File:**
```powershell
# Find the latest file
Get-ChildItem C:\Users\PuneethAM\GA_testcases\GA_testcases\ -Latest
```

**Update API Token Anytime:**
```powershell
# Edit .env file
notepad .env
```

---

## ✨ You're Ready!

Run this command now:
```powershell
cd C:\Users\PuneethAM\GA_testcases
.\quick-start.ps1 GAAM-933
```

Your test cases will be generated in seconds! 🎉
