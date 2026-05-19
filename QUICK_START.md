# Quick Start - 3 Simple Steps

## Step 1️⃣: Install Node.js (one-time only)

1. Download from https://nodejs.org/ (LTS version)
2. Install it
3. Restart your computer

Verify:
```bash
node --version
```

## Step 2️⃣: Setup JIRA Credentials (one-time only)

1. Get your API token:
   - Visit: https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Copy the token

2. Create `.env` file in `C:\Users\PuneethAM\GA_testcases\`:
   ```
   JIRA_EMAIL=am.puneeth@bounteous.com
   JIRA_API_TOKEN=paste_your_token_here
   ```

3. Save the file

## Step 3️⃣: Install Dependencies (one-time only)

Open PowerShell in `C:\Users\PuneethAM\GA_testcases\` and run:

```bash
npm install
```

---

# 🎯 Now Generate Test Cases!

## Easiest Way: Use Quick Start Script

```powershell
# Single ticket
.\quick-start.ps1 GAAM-618

# Multiple tickets
.\quick-start.ps1 GAAM-618 GAAM-687 GAAM-625
```

## Direct Command

```bash
# Single ticket
node jira_testcase_generator.js GAAM-618

# Multiple tickets
node jira_testcase_generator.js GAAM-618 GAAM-687 GAAM-625
```

## Using npm

```bash
npm run generate GAAM-618
```

---

# 📁 Output Location

Your Excel files are saved in:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

Look for: `GAAM-618_Feature_Name.xlsx`

---

# ❓ Common Issues

| Problem | Solution |
|---------|----------|
| "Environment variable not set" | Create `.env` file with credentials |
| "Cannot find module exceljs" | Run `npm install` |
| "JIRA API error 401" | Get a new API token and update `.env` |
| "Node not found" | Install Node.js from nodejs.org |

---

# 📖 For More Details

See:
- `SETUP.md` - Complete setup guide
- `RUN_GUIDE.md` - Detailed running instructions
- `.env.example` - Example environment file

---

**Ready?** Run this now:

```powershell
.\quick-start.ps1 GAAM-618
```

Your test cases will be generated in seconds! ✅
