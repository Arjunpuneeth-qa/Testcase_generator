# JIRA Test Case Generator - Running Guide

## Prerequisites

1. **Node.js** (v12 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (usually comes with Node.js)
   - Verify: `npm --version`

## Setup Instructions

### Step 1: Install Dependencies

Navigate to the project directory and install required packages:

```bash
cd C:\Users\PuneethAM\GA_testcases
npm install
```

This installs:
- `exceljs` - For Excel file generation
- `dotenv` - For environment variable management

### Step 2: Configure Environment Variables

Create a `.env` file in the project root directory with your JIRA credentials:

```bash
# Windows PowerShell
# Create the file
New-Item -Path ".env" -ItemType File

# Then edit it and add:
JIRA_EMAIL=am.puneeth@bounteous.com
JIRA_API_TOKEN=your_api_token_here
```

**How to get your JIRA API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Test Case Generator")
4. Copy the token and paste it in the `.env` file

### Step 3: Verify Setup

Test that everything is configured correctly:

```bash
node jira_testcase_generator.js
```

You should see usage instructions. If you see errors about missing environment variables, double-check your `.env` file.

## Running the Generator

### Single Ticket

```bash
node jira_testcase_generator.js GAAM-618
```

### Multiple Tickets

```bash
node jira_testcase_generator.js GAAM-618 GAAM-687 GAAM-625
```

### Using Windows PowerShell

```powershell
# Single ticket
node jira_testcase_generator.js GAAM-618

# Multiple tickets
node jira_testcase_generator.js GAAM-618 GAAM-687 GAAM-625
```

### Using npm script

Edit `package.json` to add a custom script:

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

## Output

The generator creates Excel files in: `C:\Users\PuneethAM\GA_testcases\GA_testcases\`

File naming format: `{TICKET_ID}_{Description}.xlsx`

Example output files:
- `GAAM-618_Your_Feature_Name.xlsx`
- `GAAM-687_Another_Feature.xlsx`

## Sample Output

When you run the generator, you'll see:

```
======================================================================
Generating test cases for 1 ticket(s)
======================================================================

[INFO] Configuration validated
[1/1] Processing: GAAM-618
✓ GAAM-618 - Generated 15 test cases

======================================================================
GENERATION SUMMARY
======================================================================

1. GAAM-618: ✓ Success
   Summary: Feature Name
   Complexity: 65/100
   Test Cases: 15
   Output: GAAM-618_Feature_Name.xlsx

======================================================================
Total: 1/1 test case(s) generated successfully
Output Directory: C:\Users\PuneethAM\GA_testcases\GA_testcases
======================================================================
```

## Troubleshooting

### Error: "JIRA_EMAIL environment variable is not set"

**Solution:** Check your `.env` file exists in the project root with correct credentials.

```bash
# View .env file content
Get-Content .env
```

### Error: "JIRA API error (HTTP 401)"

**Solution:** Your API token is invalid or expired. Get a new one from:
https://id.atlassian.com/manage-profile/security/api-tokens

### Error: "Cannot find module 'exceljs'"

**Solution:** Install dependencies:

```bash
npm install
```

### Error: "JIRA API request timeout"

**Solution:** The network request took too long. Try again, or check your internet connection.

### No Excel file created

**Solution:** Check the output directory exists:

```bash
# Create if missing
New-Item -Path "C:\Users\PuneethAM\GA_testcases\GA_testcases" -ItemType Directory -Force
```

## Advanced Usage

### Batch Processing Script

Create `batch_generate.ps1`:

```powershell
$tickets = @("GAAM-618", "GAAM-687", "GAAM-625", "GAAM-700")
node jira_testcase_generator.js $tickets
```

Run it:

```bash
.\batch_generate.ps1
```

### Custom Output Directory

Modify in the code:

```javascript
const generator = new JiraTestCaseGenerator('C:\custom\output\path');
await generator.generate('GAAM-618');
```

### Scheduling (Windows Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily, weekly, etc.)
4. Set action: `node C:\Users\PuneethAM\GA_testcases\jira_testcase_generator.js GAAM-618`
5. Set location: `C:\Users\PuneethAM\GA_testcases`

## Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `node jira_testcase_generator.js GAAM-618` | Generate for single ticket |
| `node jira_testcase_generator.js GAAM-618 GAAM-687` | Generate for multiple tickets |
| `Get-Content .env` | Check environment variables |
| `npm run generate` | Run custom npm script |

## Notes

- Each ticket generates 6-100 test cases based on complexity
- Complexity score affects number of test cases generated
- All test cases are saved in Excel format with professional formatting
- The generator is safe to run multiple times (overwrites previous files)
