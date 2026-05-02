---
name: automate
description: Generate test cases from JIRA tickets
command: node jira_testcase_generator.js
args: true
---

# /automate

Generate comprehensive test cases from JIRA tickets.

## Usage

```
/automate GAAM-618                          # Single ticket
/automate GAAM-618 GAAM-687 GAAM-625       # Multiple tickets
```

## Features

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

## Output

- Format: Excel 2007+ (.xlsx)
- Location: `GA_testcases/` folder
- Filename: `{TICKET_ID}_{Description}.xlsx`
