# JIRA Test Case Generator - Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Automated Setup (Easiest)

1. **Open PowerShell** in the project directory
2. **Run this command:**
   ```powershell
   .\quick-start.ps1 GAAM-618
   ```
3. Done! Your test cases will be generated

### Option 2: Manual Setup (3 minutes)

1. **Open PowerShell** in the project directory
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create `.env` file with credentials** (see below)
4. **Run the generator:**
   ```bash
   node jira_testcase_generator.js GAAM-618
   ```

---

## 📋 Detailed Setup Instructions

### Step 1: Install Node.js

**Windows:**
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Follow the installation wizard (default settings are fine)
4. Restart your computer

**Verify installation:**
```bash
node --version
npm --version
```

You should see version numbers like `v18.17.0` and `9.6.7`

### Step 2: Navigate to Project Directory

```powershell
cd C:\Users\PuneethAM\GA_testcases
```

### Step 3: Install Project Dependencies

```bash
npm install
```

**What this does:**
- Downloads `exceljs` (for Excel file generation)
- Downloads `dotenv` (for reading environment variables)
- Creates `node_modules` folder

### Step 4: Create `.env` File with JIRA Credentials

**Method 1: Using PowerShell**

```powershell
# Create .env file
New-Item -Path ".env" -ItemType File

# Edit it (opens in Notepad)
notepad .env
```

**Method 2: Manual Creation**

1. Right-click in the folder → New → Text Document
2. Name it `.env` (with the dot at the start)
3. Open with Notepad
4. Add your credentials

**What to put in `.env`:**

```
JIRA_EMAIL=am.puneeth@bounteous.com
JIRA_API_TOKEN=your_api_token_here
```

⚠️ **Important:** Replace `your_api_token_here` with your actual API token!

### Step 5: Get Your JIRA API Token

1. Visit: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Give it a name: `Test Case Generator`
4. Click **"Create"**
5. Copy the token that appears
6. Paste it in your `.env` file
7. Save the `.env` file

**Note:** Keep this token secret! Don't share it in emails or repositories.

### Step 6: Verify Setup

```bash
# This should show usage instructions without errors
node jira_testcase_generator.js
```

If you see usage instructions, you're ready to go! ✅

---

## 🎯 Running the Generator

### Single Ticket

```bash
node jira_testcase_generator.js GAAM-618
```

### Multiple Tickets

```bash
node jira_testcase_generator.js GAAM-618 GAAM-687 GAAM-625
```

### Using Quick-Start Script

**PowerShell:**
```powershell
.\quick-start.ps1 GAAM-618
```

**Batch (Command Prompt):**
```cmd
quick-start.bat GAAM-618
```

### Using npm Script

Create a shortcut in `package.json`:

```json
{
  "scripts": {
    "generate": "node jira_testcase_generator.js"
  }
}
```

Then run:
```bash
npm run generate GAAM-618
```

---

## 📁 Output Files

Test cases are saved in:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

**File naming:**
- `GAAM-618_Feature_Name.xlsx`
- `GAAM-687_Another_Feature.xlsx`

Each file contains:
- Professional Excel formatting
- Color-coded headers
- Auto-sized columns
- Multiple test cases per ticket

---

## 🔧 Troubleshooting

### ❌ "JIRA_EMAIL environment variable is not set"

**Problem:** The `.env` file is missing or empty

**Solution:**
1. Check if `.env` file exists in the project folder
2. If not, create it (see Step 4)
3. Add your email and token
4. Save the file

### ❌ "JIRA API error (HTTP 401)"

**Problem:** Authentication failed

**Solutions:**
1. Verify your email is correct
2. Get a new API token (old ones expire):
   - https://id.atlassian.com/manage-profile/security/api-tokens
3. Update `.env` with the new token

### ❌ "Cannot find module 'exceljs'"

**Problem:** Dependencies not installed

**Solution:**
```bash
npm install
```

### ❌ "JIRA API error (HTTP 404)"

**Problem:** Ticket not found

**Solutions:**
1. Verify the ticket key is correct (e.g., `GAAM-618`)
2. Check the ticket exists in JIRA
3. Make sure you have access to the ticket

### ❌ "JIRA API request timeout"

**Problem:** Network request took too long

**Solutions:**
1. Check your internet connection
2. Try again in a few moments
3. Try a different ticket

### ❌ "No Excel file created"

**Problem:** Output directory doesn't exist

**Solution:**
```powershell
# Create the output directory
New-Item -Path "C:\Users\PuneethAM\GA_testcases\GA_testcases" -ItemType Directory -Force
```

---

## 🎓 Configuration Reference

### Environment Variables (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `JIRA_EMAIL` | Your JIRA email | `am.puneeth@bounteous.com` |
| `JIRA_API_TOKEN` | Your JIRA API token | `atatt1234567890...` |

### Generator Configuration

Edit `jira_testcase_generator.js` to customize:

```javascript
// Change JIRA instance
CONFIG = {
  jiraUrl: 'https://your-jira.com',
  httpTimeout: 10000
}

// Change output directory
const generator = new JiraTestCaseGenerator('C:\\custom\\path');

// Change complexity thresholds
TEST_CASE_THRESHOLDS = [ ... ]

// Change Excel styling
EXCEL_CONFIG = { ... }
```

---

## 📊 What Gets Generated

For each ticket, you get:

1. **6 Core Test Cases:**
   - ✅ Positive (Happy Path)
   - ❌ Negative (Invalid Input)
   - 🔚 Edge Case (Boundaries)
   - 🔒 Security (Unauthorized Access)
   - ⚡ Performance (Load & Concurrency)
   - 💥 Error Handling (Recovery)

2. **Additional Test Cases** (based on complexity):
   - Data Integrity
   - Integration
   - UI Responsive
   - UI Accessibility
   - And more...

3. **Complexity Score:** 0-100
   - Higher complexity = More test cases
   - Calculated from ticket size, keywords, priority

---

## 📖 Command Reference

| What | Command |
|------|---------|
| Install dependencies | `npm install` |
| Generate single ticket | `node jira_testcase_generator.js GAAM-618` |
| Generate multiple tickets | `node jira_testcase_generator.js GAAM-618 GAAM-687` |
| Quick start (PowerShell) | `.\quick-start.ps1 GAAM-618` |
| Quick start (Batch) | `quick-start.bat GAAM-618` |
| Check Node version | `node --version` |
| Check npm version | `npm --version` |
| View .env file | `Get-Content .env` |

---

## 🎯 Common Workflows

### Workflow 1: Generate for a Single Feature

```bash
node jira_testcase_generator.js GAAM-618
# Open C:\Users\PuneethAM\GA_testcases\GA_testcases\GAAM-618_*.xlsx
```

### Workflow 2: Batch Generate for Sprint

```bash
node jira_testcase_generator.js GAAM-618 GAAM-687 GAAM-625 GAAM-700
# All Excel files are created in one command
```

### Workflow 3: Automated Daily Generation

**Using Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Generate Test Cases"
4. Trigger: Daily at 9:00 AM
5. Action: Run `quick-start.bat` in `C:\Users\PuneethAM\GA_testcases`

---

## ✅ Health Check

Run this to verify everything is set up correctly:

```powershell
# 1. Check Node.js
node --version

# 2. Check dependencies
npm list exceljs dotenv

# 3. Check .env file
Get-Content .env

# 4. Try generating
node jira_testcase_generator.js GAAM-618
```

All should complete without errors.

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify your `.env` file is correct
3. Make sure you have internet connection
4. Try a different ticket to isolate the problem

---

## 🎉 Ready to Generate!

You're all set! Run your first test case generation:

```bash
node jira_testcase_generator.js GAAM-618
```

Your Excel file will be ready in seconds! 🚀
