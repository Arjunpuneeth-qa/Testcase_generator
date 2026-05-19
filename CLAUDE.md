# JIRA Test Case Generator Agent

## Overview
Automated test case generator that creates comprehensive test cases from JIRA tickets.

## Custom Skills

### /testcase (ENHANCED MASTER VERSION) ⭐ **RECOMMENDED**
Generate comprehensive test cases with reference-quality detail + ALL generators combined + Boundary Testing + Professional formatting.

**Usage:**
```bash
/testcase GAAM-933                          # Single ticket
/testcase GAAM-933 GAAM-524 GAAM-687       # Multiple tickets
```

**Features:**
- 🚀 **ALL Generators Combined** (V2 + V3 + V4 + Ultimate + Enhanced)
- 📊 **83 Test Cases Per Ticket** (reference-quality)
- ✅ **26 Boundary Value Tests Included**
- 📋 **TEST CASE SUMMARY Sheet** with professional breakdown
- 🧠 Intelligent JIRA ticket analysis
- 🎯 Acceptance criteria extraction
- 🔍 Feature-specific detection with detailed specifications
- 📝 Detailed step-by-step test instructions with exact measurements
- 🛡️ Security tests (SQL injection, CSRF, XSS, encryption)
- 🌐 Responsive design tests (9 specific device breakpoints: 320px to 2560px)
- ♿ Accessibility tests (WCAG 2.2, color contrast 4.5:1, tool-specific: NVDA, JAWS, Level Access)
- 🔧 Compatibility tests (Chrome/Firefox/Safari/Edge desktop + mobile)
- 📈 Performance, Integration, UI/UX tests with specific measurements (#6B46C1 colors, 44x44px touch targets, etc.)

**Test Cases Generated (83 Total):**
- ✅ 7 Positive (rendering, fields, design, interactions, hierarchy, forms, responsive)
- ✅ 7 Negative (empty, XSS, long text, special chars, missing fields, large datasets, invalid)
- ✅ 7 Edge Cases (single chars, Unicode, whitespace, mixed fields, boundaries, case sensitivity)
- ✅ 4 Security Tests (SQL injection, CSRF, authentication, encryption)
- ✅ 3 Performance Tests (load time <3s, large datasets, image optimization)
- ✅ 7 Accessibility Tests (WCAG 2.2, contrast, screen readers, keyboard nav, 200% zoom, touch)
- ✅ 9 Responsive Design Tests (320px, 414px, 768px, 1024px, 1366px, 1920px, 2560px + transitions)
- ✅ 7 Cross-Browser Tests (Chrome, Firefox, Safari, Edge desktop, Safari mobile, Chrome mobile, API)
- ✅ 7 UI/UX Tests (purple header, typography, spacing, bullets, statistics, hierarchy, states)
- ✅ 3 Integration Tests (API, database, third-party services)
- ✅ **26 Boundary Value Tests** ⭐ (numeric, string, date, array, null/undefined)

**Sheets Included:**
1. **Test Cases** - All 83 comprehensive test cases with specific measurements
2. **Summary** - Professional breakdown table by test type
3. **Ticket Details** - JIRA ticket metadata and generation info

**File Format:**
- Output: `{TICKET_ID}_ENHANCED_MASTER_{Description}.xlsx`
- Location: `GA_testcases/` folder (automatically created)
- Format: .xlsx (Excel 2007+) with 3 professional sheets

**Command:**
```bash
/testcase GAAM-933
testcase-master GAAM-933
node jira_testcase_generator_master_enhanced.js GAAM-933
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
