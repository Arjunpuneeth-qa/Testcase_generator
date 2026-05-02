# JIRA Test Case Generator Suite

## Overview

Complete test case generation system for JIRA tickets with comprehensive coverage of all testing scenarios. The system dynamically analyzes JIRA tickets and generates 30-100+ test cases covering:

✅ **Positive Tests** - All functionalities working as expected  
✅ **Negative Tests** - Error handling, invalid inputs  
✅ **Edge Cases** - Boundary conditions, optional fields, empty states  
✅ **Accessibility** - WCAG 2.2 AA compliance, screen readers, contrast  
✅ **Responsive Design** - Mobile (320px), Tablet (768px), Desktop (1920px+)  
✅ **Browser Compatibility** - Chrome, Firefox, Safari, Edge, Mobile browsers  
✅ **QA & Documentation** - Performance, styling, documentation verification  

---

## Generators Available

### 1. **UNIVERSAL Test Case Generator** ⭐ (RECOMMENDED)
**File:** `universal_testcase_generator.js`

**What it does:**
- Analyzes ANY JIRA ticket dynamically
- Extracts requirements from ticket description
- Categorizes requirements by type
- Generates 30-50 test cases specific to the ticket
- Works for ANY ticket type (not hardcoded)

**Usage:**
```bash
# Single ticket
node universal_testcase_generator.js GAAM-744

# Multiple tickets
node universal_testcase_generator.js GAAM-744 GAAM-618 GAAM-687

# Or via batch file
testcases GAAM-744
testcases GAAM-744 GAAM-618 GAAM-687
```

**Output:**
- Excel file: `{TICKET_ID}_UNIVERSAL_TESTCASES_{Description}.xlsx`
- 30-50 test cases with complete coverage
- Organized by category (Positive, Negative, Edge Cases, etc.)

**Example:**
```bash
$ node universal_testcase_generator.js GAAM-744

==========================================================================================
UNIVERSAL Test Case Generator - Dynamic Analysis and Generation
Processing 1 ticket(s)
Coverage: Positive | Negative | Edge Cases | Accessibility | Responsive | Browser Compatibility
==========================================================================================

[1/1] GAAM-744
Fetching JIRA ticket: GAAM-744
Summary: CMS FE: Product Path Summary Card
Analyzing ticket requirements...
Found 4 main requirements
  1. [responsive] Responsive Rendering...
  2. [accessibility] WCAG 2.2 Level AA...
  3. [functional] Semantic HTML structure...
  4. [functional] Rate Admin exclusion...

Generating comprehensive test scenarios...
✓ Generated 39 comprehensive test cases
✓ Excel file created: GAAM-744_UNIVERSAL_TESTCASES_CMS_FE__Product_Path_Summary_Card.xlsx
```

---

### 2. **Comprehensive Test Case Generator**
**File:** `comprehensive_testcases.js`

**What it does:**
- Generates 100+ test cases per ticket
- Includes all test types with detailed steps
- Organized into 10 sections
- More detailed than universal generator

**Usage:**
```bash
node comprehensive_testcases.js GAAM-744
```

**Output:**
- Excel file: `{TICKET_ID}_COMPREHENSIVE_{Description}.xlsx`
- 100+ test cases with extensive coverage

---

### 3. **Focused Test Case Generator**
**File:** `generate_focused_testcases.js`

**What it does:**
- Focuses on core functionalities
- Creates 15-30 test cases
- Good for quick verification
- Dynamic based on ticket content

**Usage:**
```bash
node generate_focused_testcases.js GAAM-744
```

---

## Test Coverage Details

### Positive Tests (5-8 per requirement)
- ✅ Basic functionality verification
- ✅ Styling/UI verification
- ✅ Responsive behavior
- ✅ Content rendering
- ✅ Field combinations

### Negative Tests (6-8 tests)
- ❌ Empty/null input handling
- ❌ Very long text (200+ chars)
- ❌ XSS/HTML injection security
- ❌ Special characters
- ❌ Large datasets

### Edge Cases (5-6 tests)
- 🔸 All fields vs. required only
- 🔸 Unicode and international characters
- 🔸 Boundary values (min/max)
- 🔸 Single vs. multiple items
- 🔸 Whitespace handling

### Accessibility Tests (6-8 tests)
- ♿ Semantic HTML (WCAG 2.0)
- ♿ Color contrast >= 4.5:1 (WCAG AA)
- ♿ Screen reader compatibility
- ♿ Keyboard navigation
- ♿ 200% zoom readability
- ♿ Level Access scan (no critical issues)

### Responsive Design Tests (8-10 tests)
- 📱 Mobile Small (320px)
- 📱 Mobile (375px)
- 📱 Mobile Large (414px)
- 📱 Tablet Portrait (768px)
- 📱 Tablet Landscape (1024px)
- 🖥️ Desktop (1366px)
- 🖥️ Large Desktop (1920px)
- 📱 Landscape/Portrait orientation
- 📱 Touch target sizing (44x44px)

### Browser Compatibility Tests (6-8 tests)
- Chrome (Desktop & Mobile)
- Firefox (Desktop)
- Safari (Desktop & Mobile)
- Edge (Desktop)
- CSS Grid/Flexbox support
- Console error checking

### QA Tests (3-5 tests)
- ✓ Styling matches design
- ✓ Performance (load time)
- ✓ Documentation complete
- ✓ No JavaScript errors
- ✓ Template availability

---

## Excel File Format

Each generated Excel file includes:

**Header Section (Row 1-4):**
- Ticket ID
- Summary
- Total test cases count
- Generation timestamp

**Column Headers (Row 6):**
| TC_ID | Category | Test Scenario | Test Type | Priority | Pre-Condition | Test Steps | Test Data | Expected Result | Status | Browser |
|-------|----------|---------------|-----------|----------|--------------|-----------|-----------|-----------------|--------|---------|

**Data Rows:**
- Organized by category (color-coded)
- 8-12 columns per test case
- Text wrapping enabled for readability
- Row height: 100px (auto-adjusts for content)

**Column Widths:**
- TC_ID: 8px
- Category: 24px
- Test Scenario: 35px
- Test Type: 18px
- Priority: 10px
- Pre-Condition: 24px
- Test Steps: 40px
- Test Data: 18px
- Expected Result: 35px
- Status: 10px (leave blank for manual entry)
- Browser: 20px

---

## Test Priorities

- **P0 - Critical:** Core functionality, security, accessibility WCAG
- **P1 - High:** Responsive, browser compatibility, styling
- **P2 - Medium:** Edge cases, performance, documentation
- **P3 - Low:** Nice-to-have validations

---

## Usage Examples

### Example 1: Generate for Single JIRA Ticket
```bash
cd C:\Users\PuneethAM\GA_testcases
node universal_testcase_generator.js GAAM-744
```

### Example 2: Generate for Multiple Tickets
```bash
node universal_testcase_generator.js GAAM-744 GAAM-618 GAAM-687
```

### Example 3: Using Batch File
```bash
cd C:\Users\PuneethAM\GA_testcases
testcases GAAM-744
```

### Example 4: Generate Different Complexity Levels
```bash
# Quick focused tests (15-30 cases)
node generate_focused_testcases.js GAAM-744

# Standard comprehensive tests (30-50 cases)
node universal_testcase_generator.js GAAM-744

# Extensive coverage (100+ cases)
node comprehensive_testcases.js GAAM-744
```

---

## Output Files

All test case files are generated in: `C:\Users\PuneethAM\GA_testcases\GA_testcases\`

**File naming pattern:**
```
{TICKET_ID}_{GENERATOR_TYPE}_{DESCRIPTION}.xlsx
```

**Examples:**
```
GAAM-744_UNIVERSAL_TESTCASES_CMS_FE__Product_Path_Summary_Card.xlsx
GAAM-618_UNIVERSAL_TESTCASES_CMS_FE__Prevent_multiple_validation.xlsx
GAAM-687_COMPREHENSIVE_Form_Validation_Enhancement.xlsx
```

---

## Configuration

**JIRA Connection:**
- URL: `https://bounteous.jira.com`
- Email: `am.puneeth@bounteous.com`
- API Token: Embedded in code (production ready)

**Output Directory:**
- Default: `GA_testcases/GA_testcases/`
- Can be customized via constructor parameter

---

## Test Case Categorization

```
├── Positive Tests (Functionality)
│   ├── Basic rendering
│   ├── Styling verification
│   └── Responsive behavior
│
├── Negative Tests (Error Handling)
│   ├── Empty/invalid input
│   ├── Long text
│   ├── Security (XSS)
│   └── Special characters
│
├── Edge Cases (Boundary Conditions)
│   ├── Optional fields
│   ├── Unicode support
│   ├── Min/Max values
│   └── Whitespace handling
│
├── Accessibility (WCAG 2.2 AA)
│   ├── Semantic HTML
│   ├── Color contrast
│   ├── Screen reader
│   ├── Keyboard navigation
│   ├── Zoom (200%)
│   └── Level Access scan
│
├── Responsive Design
│   ├── 7+ breakpoints
│   ├── Orientation changes
│   ├── Touch targets
│   └── Fluid resizing
│
├── Browser Compatibility
│   ├── Chrome
│   ├── Firefox
│   ├── Safari
│   ├── Edge
│   └── Mobile browsers
│
└── QA & Verification
    ├── Styling
    ├── Performance
    ├── Documentation
    └── Final review
```

---

## Tips for Best Results

1. **Run Universal Generator First** - It's dynamic and works for any ticket
2. **Review All Test Cases** - Customize pre-conditions and test data as needed
3. **Prioritize by P0/P1** - Focus testing on critical and high-priority cases first
4. **Test on Real Devices** - Responsive tests require actual mobile/tablet devices
5. **Document Results** - Use Status column to track test execution
6. **Keep Excel Updated** - Export final results for stakeholder review

---

## Troubleshooting

### Error: "HTTP 401: Unauthorized"
- JIRA API token may have expired
- Update token in generator file

### Error: "Module not found: exceljs"
```bash
npm install exceljs
```

### No test cases generated
- Check that ticket ID is correct (e.g., GAAM-744)
- Verify JIRA instance is accessible
- Check internet connection

### Excel file not opening
- Ensure ExcelJS is installed properly
- Try opening with different version of Excel
- Check file path for special characters

---

## Version History

**v3 - Universal Intelligent Generator** (Latest)
- Works with ANY ticket type
- Dynamic requirement extraction
- 30-50 test cases per ticket
- Intelligent categorization

**v2 - Comprehensive Generator**
- 100+ hardcoded test cases
- GAAM-744 specific (component)
- All test types covered
- Detailed step-by-step tests

**v1 - Focused Generator**
- 15-30 basic test cases
- Quick generation
- Core functionalities only

---

## Support

For issues or improvements:
1. Check JIRA connection settings
2. Verify Node.js and ExcelJS installation
3. Review JIRA ticket content for requirements
4. Check generated Excel for formatting issues

---

**Last Updated:** April 30, 2026  
**Author:** JIRA Test Case Generator Suite  
**Status:** Production Ready ✅
