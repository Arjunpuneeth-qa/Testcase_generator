# JIRA Test Case Generator Agent

## Overview
Automated test case generator that creates comprehensive test cases from JIRA tickets.

## Custom Skills

### /automate
Generate test cases from JIRA tickets with comprehensive coverage.

**Usage:**
```bash
/automate GAAM-618                          # Single ticket
/automate GAAM-618 GAAM-687 GAAM-625       # Multiple tickets
```

**Features:**
- Fetches data from JIRA automatically
- Generates 6 comprehensive test cases per ticket:
  - TC_001: Positive (Happy Path)
  - TC_002: Negative (Invalid Input)
  - TC_003: Edge Case (Boundary Conditions)
  - TC_004: Security (Unauthorized Access)
  - TC_005: Performance (Load & Concurrency)
  - TC_006: Error Handling (Recovery)
- Creates individual Excel files per ticket
- Professional formatting with styling

**File Format:**
- Output: `{TICKET_ID}_{Description}.xlsx`
- Location: `GA_testcases/` folder
- Format: .xlsx (Excel 2007+)

### /list-files
Display all generated test case files.

**Usage:**
```bash
/list-files
```

## Direct Commands (Alternative)

If the skill doesn't work, use these direct commands:

### Node.js
```bash
node GA_testcases/jira_testcase_generator.js GAAM-618
node GA_testcases/jira_testcase_generator.js GAAM-618 GAAM-687 GAAM-625
```

### Batch File (Windows)
```bash
cd GA_testcases
.\automate.bat GAAM-618
.\automate.bat GAAM-618 GAAM-687
```

## Configuration

- JIRA Instance: https://bounteous.jira.com
- Email: am.puneeth@bounteous.com
- API: Rest API v2

## Project Structure

```
GA_testcases/
├── jira_testcase_generator.js    # Main generator script
├── automate.bat                   # Windows batch wrapper
├── GA_testcases/                  # Output folder for Excel files
└── package.json                   # Dependencies (exceljs, etc.)
```
