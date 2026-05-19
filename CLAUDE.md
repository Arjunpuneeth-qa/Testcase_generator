# JIRA Test Case Generator Agent

## Overview
Automated test case generator that creates comprehensive test cases from JIRA tickets.

## Custom Skills

### /testcase (REFERENCE FORMAT VERSION) ⭐ **RECOMMENDED**
Generate comprehensive test cases in EXACT reference format + 83 tests + Same columns/summary as GAAM-524.

**Usage:**
```bash
testcase-reference GAAM-933                          # Single ticket
testcase-reference GAAM-933 GAAM-524 GAAM-687       # Multiple tickets
```

**Features:**
- ✅ **EXACT Same Format** as GAAM-524 reference file
  - Same column headers: TC_ID, Test Type, Test Scenario, Pre-Condition, Test Steps, Test Data, Expected Result, Status
  - Same summary layout: TEST CASE SUMMARY section at bottom with breakdown by test type
  - Professional Excel formatting with styling
- 📊 **83 Test Cases Per Ticket** (vs 57 in reference)
- ✅ **26 Boundary Value Tests** (Numeric, String, Date, Array, Null/Undefined)
- 🧠 Intelligent JIRA ticket analysis
- 🎯 Acceptance criteria extraction
- 🔍 Feature-specific detection with detailed specifications
- 📝 Detailed step-by-step test instructions with exact measurements
- 🛡️ Security tests (SQL injection, CSRF, XSS, encryption) - 4 tests
- 🌐 Responsive design tests (9 tests: 320px, 414px, 768px, 1024px, 1366px, 1920px, 2560px + transitions + orientation)
- ♿ Accessibility tests (7 tests: WCAG 2.2, color contrast 4.5:1, NVDA, JAWS, Level Access, keyboard nav, touch targets 44x44px)
- 🔧 Cross-Browser tests (7 tests: Chrome, Firefox, Safari, Edge desktop, Safari mobile, Chrome mobile, API)
- 📈 Performance (3 tests), Integration (3 tests), UI/UX (7 tests) with specific measurements (#6B46C1, 24px spacing, etc.)

**Test Cases Generated (83 Total):**
- ✅ 7 Positive (rendering, fields, design, interactions, hierarchy, forms, responsive)
- ✅ 7 Negative (empty, XSS, long text, special chars, missing fields, large datasets, invalid)
- ✅ 7 Edge Cases (single chars, Unicode, whitespace, mixed fields, boundaries, case sensitivity, concurrent)
- ✅ 4 Security Tests (SQL injection, CSRF, authentication, encryption)
- ✅ 3 Performance Tests (load time <3s, large datasets, image optimization)
- ✅ 7 Accessibility Tests (WCAG 2.2, contrast 4.5:1, NVDA/JAWS, keyboard nav, 200% zoom, critical violations, touch 44x44px)
- ✅ 9 Responsive Design Tests (320x568px, 414x896px, 768x1024px, 1024x768px, 1366x768px, 1920x1080px, 2560x1440px + transitions + orientation)
- ✅ 7 Cross-Browser Tests (Chrome, Firefox, Safari, Edge desktop, Safari mobile, Chrome mobile, API)
- ✅ 7 UI/UX Tests (purple header #6B46C1, typography, spacing, bullets, statistics, hierarchy, hover/focus states)
- ✅ 3 Integration Tests (API, database, third-party services)
- ✅ **26 Boundary Value Tests** ⭐ (numeric, string, date, array, null/undefined)

**Excel Structure (Same as GAAM-524 Reference):**
- **Test Cases Data**: All 83 test cases with 8 columns (TC_ID, Test Type, Test Scenario, Pre-Condition, Test Steps, Test Data, Expected Result, Status)
- **Summary Section**: TEST CASE SUMMARY at bottom with breakdown by test type (Total: 83, Positive: 7, Negative: 7, etc.)

**File Format:**
- Output: `{TICKET_ID}_REFERENCE_FORMAT_{Description}.xlsx`
- Location: `GA_testcases/` folder (automatically created)
- Format: .xlsx (Excel 2007+) - EXACT same structure as GAAM-524 reference file

**Command:**
```bash
testcase-reference GAAM-933
node jira_testcase_generator_reference_format.js GAAM-933
```

**Benefits:**
- ✅ Most comprehensive test coverage
- ✅ Combines all test types
- ✅ Includes boundary value testing
- ✅ Professional summary sheet
- ✅ Ready-to-execute instructions
- ✅ Single Excel file with everything

---

### /testcase (Original Version)
Generate test cases from JIRA tickets with comprehensive coverage.

**Usage:**
```bash
/testcase GAAM-618                          # Single ticket
/testcase GAAM-618 GAAM-687 GAAM-625       # Multiple tickets
```

**Features:**
- 🧠 Intelligent JIRA ticket analysis
- 🎯 Acceptance criteria extraction
- 🔍 Feature-specific detection (AEM, forms, links, tracking)
- 📝 Detailed step-by-step test instructions
- 🛡️ Security tests (SQL injection, XSS)
- ⚡ 6-100 test cases based on complexity
- 📊 Professional Excel formatting

**Test Cases Generated:**
- ✅ Positive (Happy Path)
- ✅ Negative (Invalid Input)
- ✅ Edge Cases (Boundary Conditions)
- ✅ Security (Unauthorized Access)
- ✅ Performance (Load & Concurrency)
- ✅ Error Handling (Recovery)
- ✅ Feature-specific tests

**File Format:**
- Output: `{TICKET_ID}_{Description}.xlsx`
- Location: `GA_testcases/` folder (automatically created)
- Format: .xlsx (Excel 2007+)

**Command:**
```bash
/testcase GAAM-618
node testcase-skill.js GAAM-618
```

**Benefits:**
- ✅ Smart, not generic tests
- ✅ Specific to your feature
- ✅ Ready-to-execute instructions
- ✅ 26 boundary value tests included
- ✅ Security-focused testing
- ✅ Professional output

### /automate
Generate test cases with comprehensive coverage (Current/Refactored version).

**Usage:**
```bash
/automate GAAM-618                          # Single ticket
/automate GAAM-618 GAAM-687 GAAM-625       # Multiple tickets
```

**Features:**
- 10+ different test types
- Fetches data from JIRA automatically
- Generates 6-100 test cases based on complexity score
- Creates individual Excel files per ticket
- Professional formatting with styling

**Test Cases Generated:**
- TC_001: Positive (Happy Path)
- TC_002: Negative (Invalid Input)
- TC_003: Edge Case (Boundary Conditions)
- TC_004: Security (Unauthorized Access)
- TC_005: Performance (Load & Concurrency)
- TC_006: Error Handling (Recovery)
- + Data Integrity, Integration, UI Responsive, UI Accessibility, etc.

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

## Boundary Value Testing

The system now includes **26 comprehensive boundary value test cases**:

### Boundary Test Categories:
- **Numeric Boundaries** (8 tests): Min/max values, zero, negative, decimal, overflow
- **String Boundaries** (9 tests): Length limits, empty, whitespace, special chars, SQL/XSS injection
- **Date Boundaries** (4 tests): Min/max dates, invalid formats, leap year
- **Array Boundaries** (3 tests): Empty, single item, maximum size
- **Null Handling** (2 tests): Null vs undefined states

### Automatic Inclusion:
Boundary tests are **automatically included** when using:
- `/testcase GAAM-933` (V4 - Intelligent)
- `node jira_testcase_generator_v4.js GAAM-933`
- `node jira_testcase_generator_ultimate.js GAAM-933`

### Manual Access:
```bash
const { BOUNDARY_TEST_TEMPLATES } = require('./boundary_test_generator.js');
const numericTests = require('./boundary_test_generator.js').getBoundaryTestsByCategory('numeric');
```

**See:** `BOUNDARY_TEST_GUIDE.md` for complete details and examples

## Project Structure

```
GA_testcases/
├── jira_testcase_generator.js           # Main generator (Refactored)
├── jira_testcase_generator_v2.js        # Feature-specific tests
├── jira_testcase_generator_v3.js        # AEM detailed tests
├── jira_testcase_generator_v4.js        # Intelligent (Smart) ⭐
├── jira_testcase_generator_ultimate.js  # All features combined
├── boundary_test_generator.js           # 26 Boundary value tests ⭐
├── testcase.js                          # /testcase skill wrapper
├── quick-start.ps1                      # Quick-start script
├── quick-start-v4.ps1                   # V4 quick-start script
├── automate.bat                         # Windows batch wrapper
├── GA_testcases/                        # Output folder for Excel files
└── package.json                         # Dependencies (exceljs, etc.)
```
