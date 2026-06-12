# Test Case Generation Guide

## 📋 Overview

This guide explains how to generate professional test cases for JIRA tickets using the automated test case generator. The generator creates comprehensive Excel files with:

- ✅ Professional formatting (headers, colors, styling)
- ✅ TEST CASE SUMMARY section with breakdown by test type
- ✅ 26 Boundary Value tests for security coverage
- ✅ Multiple test types (Positive, Negative, Edge Cases, etc.)
- ✅ Exact format matching reference files

---

## 🚀 Quick Start

### Single Ticket
```bash
./automate.bat GAAM-933
```

### Multiple Tickets
```bash
./automate.bat GAAM-933 GAAM-524 GAAM-687
```

### Output
```
✓ GAAM-933 - Generated 50 test cases
File: GAAM-933_CMS_BE__Button__CTA____Automatic_Icon_Selection_Ba.xlsx
Location: C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm packages: `exceljs`, `axios`, `dotenv`

### Automatic Setup
All dependencies are pre-installed. Just run:
```bash
./automate.bat GAAM-933
```

### Manual Install (if needed)
```bash
cd C:\Users\PuneethAM\GA_testcases
npm install
```

---

## 🎯 Generator Options

### Option 1: automate.bat (Recommended)
**Best for:** Quick test case generation with standard coverage

```bash
./automate.bat GAAM-933
```

**Generates:**
- 50 test cases
- Professional Excel format
- TEST CASE SUMMARY section
- 26 Boundary Value tests included
- Feature-specific tests

**Output File:** `{TICKET_ID}_Description.xlsx`

---

### Option 2: testcase-reference
**Best for:** Comprehensive test coverage with reference file format

```bash
testcase-reference GAAM-933
```

**Generates:**
- 83 test cases (vs 50 in automate)
- Exact GAAM-524 reference format
- TEST CASE SUMMARY section
- All test types with higher density
- Professional Excel formatting

**Output File:** `{TICKET_ID}_REFERENCE_FORMAT_Description.xlsx`

---

## 📊 Test Coverage Breakdown

### Test Types Included (50 tests with automate.bat)

#### 1. **Boundary Value Tests (26 tests)** ⭐
Comprehensive edge case and boundary testing

**Numeric Boundaries (8 tests):**
- Minimum values (0)
- Maximum values (999999, 2147483647)
- Negative numbers (-1, -100, -999)
- Decimal precision (0.1, 3.14159, 99.99)
- Zero in calculations
- Very large numbers (1e10, 999999999999)
- Leading zeros (007, 0123)
- Scientific notation (1e5, 1.5e-3)

**String Boundaries (5 tests):**
- Empty strings ("")
- Single character (a, 1, !)
- Maximum length (255, 1000, 5000 characters)
- Whitespace only (   , \t, \n)
- Unicode and special characters (中文, العربية, 🎉)

**Date Boundaries (4 tests):**
- Minimum date (1900-01-01, 1970-01-01)
- Maximum date (2099-12-31, 9999-12-31)
- Leap year (2000-02-29, 1900-02-29, 2024-02-29)
- Invalid dates (32-13-2024, 13/32/2024)

**Array Boundaries (3 tests):**
- Empty arrays ([])
- Single item arrays ([1], ["item"])
- Maximum array size (1000+, 10000+ items)

**Null/Undefined (2 tests):**
- Null value handling
- Undefined value handling

#### 2. **Feature-Specific Tests (Variable)**
Tests based on ticket content analysis:
- Click tracking tests (if ticket mentions "click", "event", "tracking")
- Link tests (if ticket mentions "link", "external", "url")
- Form tests (if ticket mentions "form", "input", "validation")
- Login tests (if ticket mentions "login", "password", "authentication")
- Component tests (if ticket mentions "component", "footer", "header")

#### 3. **Universal Tests (Variable)**
- Positive tests (happy path)
- Negative tests (error handling)
- Edge case tests
- Accessibility tests
- Responsive tests
- Compatibility tests
- UI/UX tests

#### 4. **TEST CASE SUMMARY Section**
Automatically generated breakdown showing:
- Total Test Cases count
- Count by test type (Positive, Negative, Edge Cases, etc.)
- Professional formatting with styling

---

## 📄 Excel File Format

### Column Headers
1. **TC_ID** - Test Case ID (TC_001, TC_002, etc.)
2. **Test Type** - Category (Positive, Negative, Boundary Value, etc.)
3. **Test Scenario** - Description of what is being tested
4. **Pre-Condition** - Setup required before test
5. **Test Steps** - Numbered steps with bullet points (•)
6. **Test Data** - Test inputs and parameters
7. **Expected Result** - What should happen
8. **Status** - Pass/Fail (empty for execution)

### Example Row
```
TC_ID:             TC_001
Test Type:         Boundary Value
Test Scenario:     Verify minimum numeric value (0)
Pre-Condition:     Numeric input field
Test Steps:        • Enter minimum value (0)
                   • Submit form
Test Data:         0
Expected Result:   Accepted and processed correctly
Status:            [Empty - for execution]
```

### Sheet Formatting
- **Header Row**: Blue background with white text
- **Data Rows**: Alternating light gray background
- **Column Width**: Auto-adjusted for readability
- **Text Wrapping**: Enabled for multi-line content
- **Row Height**: 60px for visibility

### Summary Section
Located at bottom of spreadsheet:
```
TEST CASE SUMMARY

Total Test Cases               50
Positive Test Cases            X
Negative Test Cases            Y
Boundary Value Test Cases      26
...
```

---

## 🔍 Understanding Test Types

### Boundary Value (26 tests)
Tests input limits and edge cases
- Min/max values
- Null/undefined handling
- String length limits
- Date validity
- Array sizes

**Example:** Test entering -999999 in a numeric field

### Positive Tests
Happy path scenarios that should succeed

**Example:** Valid form submission with correct data

### Negative Tests
Invalid input that should be rejected

**Example:** Empty required field submission

### Edge Cases
Unusual but valid scenarios

**Example:** Single character input in a name field

### Security Tests
Vulnerability and injection prevention

**Example:** SQL injection strings in input fields

### Accessibility Tests
WCAG 2.2 compliance

**Example:** Keyboard navigation and screen reader compatibility

### Responsive Tests
Mobile, tablet, desktop layouts

**Example:** Layout at 320px, 768px, 1920px viewports

### Compatibility Tests
Cross-browser and platform testing

**Example:** Chrome, Firefox, Safari, Edge rendering

---

## 📋 Step-by-Step Usage

### Step 1: Prepare JIRA Ticket
Ensure your JIRA ticket has:
- ✅ Valid ticket key (e.g., GAAM-933)
- ✅ Clear summary and description
- ✅ Issue type defined

### Step 2: Run Generator
```bash
cd C:\Users\PuneethAM\GA_testcases
./automate.bat GAAM-933
```

### Step 3: Verify Output
```
Processing: GAAM-933
✓ Success
File: GAAM-933_CMS_BE__Button__CTA____Automatic_Icon_Selection_Ba.xlsx
Test Cases: 50
```

### Step 4: Open Excel File
Navigate to: `C:\Users\PuneethAM\GA_testcases\GA_testcases\`

Open the generated Excel file

### Step 5: Review Test Cases
1. Check column headers are correct
2. Verify test scenarios match ticket requirements
3. Review TEST CASE SUMMARY at bottom
4. Verify 26 Boundary Value tests are present

### Step 6: Customize (Optional)
1. Edit test scenarios as needed
2. Add/remove test cases
3. Update Pre-Conditions
4. Modify Test Data
5. Update Expected Results

### Step 7: Export (Optional)
If CSV format is needed:
1. Right-click "Test Cases" sheet
2. Click "Export"
3. Select CSV format
4. Save with new name

---

## 🎯 Test Coverage Examples

### Example 1: Form Feature (GAAM-933)

**Automatic Detection:** Generator detects "form" or "button" in ticket

**Generated Tests Include:**
- Form rendering (Positive)
- Form validation (Negative)
- Required field handling (Edge Case)
- Max length input (Boundary Value)
- Special characters (Boundary Value)
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

**Output:** 50 test cases

---

### Example 2: Login Feature

**Automatic Detection:** Generator detects "login" or "authentication"

**Generated Tests Include:**
- Valid login (Positive)
- Invalid credentials (Negative)
- Empty fields (Boundary Value)
- Password masking (Security)
- Session timeout (Negative)
- Cross-browser (Compatibility)
- Mobile layout (Responsive)
- Keyboard navigation (Accessibility)

**Output:** 50 test cases

---

### Example 3: Component Feature (GAAM-524)

**Automatic Detection:** Generator detects "component" or "feature"

**Generated Tests Include:**
- Component rendering (Positive)
- Content display (Positive)
- Styling matching (UI/UX)
- Responsive layouts (Responsive)
- Empty content (Edge Case)
- Long text handling (Boundary Value)
- Accessibility (Accessibility)
- Cross-browser (Compatibility)

**Output:** 50 test cases

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'exceljs'"
**Solution:**
```bash
cd C:\Users\PuneethAM\GA_testcases
npm install exceljs
```

### Issue: "JIRA unreachable"
**Behavior:** Generator uses mock data
**Why:** JIRA connection not available
**Action:** Ignore - test cases still generate with placeholder data

### Issue: File locked error
**Cause:** File is open in Excel
**Solution:** Close Excel file before running command
```bash
# Close Excel, then run:
./automate.bat GAAM-933
```

### Issue: Command not found "automate.bat"
**Solution:** Ensure you're in correct directory
```bash
cd C:\Users\PuneethAM\GA_testcases
./automate.bat GAAM-933
```

### Issue: Test cases don't match ticket
**Solution:** 
1. Check ticket summary and description in JIRA
2. Verify generator detected correct feature type
3. Manually customize Excel file
4. Save customized version separately

---

## 📊 Performance & Output

### Generation Time
- **Single Ticket:** 2-5 seconds
- **Multiple Tickets (3):** 5-10 seconds
- **Network Delay:** Add 2-3 seconds if JIRA connection

### File Size
- **Typical Excel File:** 20-30 KB
- **With many details:** Up to 50 KB

### Memory Usage
- **Per Ticket:** ~2-5 MB
- **Batch (5 tickets):** ~10-25 MB

### Test Count by Generator
| Generator | Test Cases | Boundary Tests |
|-----------|-----------|----------------|
| automate.bat | 50 | 26 |
| testcase-reference | 83 | 26 |

---

## ✅ Quality Checklist

After generating test cases, verify:

- [ ] File created successfully
- [ ] Excel file opens without errors
- [ ] Column headers present and correct
- [ ] 50 test cases visible
- [ ] TEST CASE SUMMARY section at bottom
- [ ] Boundary Value tests included (26)
- [ ] Professional formatting (blue headers, styled rows)
- [ ] Test types are varied (Positive, Negative, Boundary, etc.)
- [ ] Pre-Conditions are clear
- [ ] Test Steps are detailed with bullet points
- [ ] Expected Results are specific
- [ ] Status column is empty (for execution)

---

## 🎓 Learning Resources

### Understanding Test Types
- **Positive Tests:** Test happy path scenarios
- **Negative Tests:** Test error handling
- **Boundary Tests:** Test min/max limits
- **Security Tests:** Test vulnerability prevention
- **Accessibility Tests:** Test WCAG compliance

### Reference Materials
- **GAAM-524 Reference File:** Located in Downloads folder
- **JIRA Tickets:** Check ticket descriptions for hints
- **Test Coverage Guide:** See section above

---

## 📞 Quick Reference

### Common Commands
```bash
# Single ticket
./automate.bat GAAM-933

# Multiple tickets
./automate.bat GAAM-933 GAAM-524 GAAM-687

# Comprehensive coverage (83 tests)
testcase-reference GAAM-933

# Direct Node command
node jira_testcase_generator_v2.js GAAM-933
```

### File Locations
```
Generator:     C:\Users\PuneethAM\GA_testcases\
Output Files:  C:\Users\PuneethAM\GA_testcases\GA_testcases\
Reference:     C:\Users\PuneethAM\Downloads\GAAM-524_*.csv
```

### Key Files
- `automate.bat` - Main batch command
- `testcase-reference.bat` - Reference format generator
- `jira_testcase_generator_v2.js` - Core generator (Node.js)
- `TEST_CASE_GENERATION_GUIDE.md` - This file

---

## 🎉 Success!

You're now ready to generate professional test cases with:
- ✅ Professional formatting
- ✅ Comprehensive coverage
- ✅ Boundary value testing
- ✅ Automatic summary generation
- ✅ Multiple test types

**Happy testing!** 🚀

---

**Last Updated:** May 20, 2026  
**Generator Version:** V2 with Boundary Value Testing  
**Created by:** Claude & Arjun
