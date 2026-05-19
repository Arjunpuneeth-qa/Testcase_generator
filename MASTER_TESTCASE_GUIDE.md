# 🧪 MASTER TEST CASE GENERATOR - Quick Start Guide

## 🚀 How to Run (3 Simple Ways)

### Method 1: Using Batch File (EASIEST)
```bash
testcase-master GAAM-933
testcase-master GAAM-933 GAAM-524 GAAM-687
```

### Method 2: Direct Node Command
```bash
node jira_testcase_generator_master.js GAAM-933
node jira_testcase_generator_master.js GAAM-933 GAAM-524 GAAM-687
```

### Method 3: Using Skill Wrapper
```bash
node testcase-master-skill.js GAAM-933
node testcase-master-skill.js GAAM-933 GAAM-524 GAAM-687
```

---

## 📊 What You Get

Each Excel file includes **83 comprehensive test cases** with reference-quality detail:

| Category | Count | Includes |
|----------|-------|----------|
| **Positive Tests** | 7 | Basic rendering, field display, design matching, interactions, hierarchy, form submission, responsive behavior |
| **Negative Tests** | 7 | Empty inputs, XSS/HTML injection, long text, special characters, missing fields, large datasets, invalid formats |
| **Edge Cases** | 7 | Single characters, Unicode, whitespace, mixed fields, boundary values, case sensitivity, concurrent users |
| **Security Tests** | 4 | SQL injection, CSRF, secure authentication, data encryption |
| **Accessibility Tests** | 7 | WCAG 2.2 HTML, color contrast (4.5:1), screen readers (NVDA/JAWS), keyboard nav, 200% zoom, critical violations, touch targets |
| **Responsive Tests** | 9 | 7 specific viewports (320px, 414px, 768px, 1024px, 1366px, 1920px, 2560px) + transitions + orientation |
| **Compatibility Tests** | 7 | Chrome, Firefox, Safari, Edge (desktop), Safari mobile, Chrome mobile, API handling |
| **Performance Tests** | 3 | Page load time (<3 seconds), large datasets, image optimization |
| **UI/UX Tests** | 7 | Purple header (#6B46C1), typography, spacing, bullet points, statistics, visual hierarchy, states |
| **Integration Tests** | 3 | API integration, database persistence, third-party services |
| **Boundary Value Tests** | 26 | Numeric min/max/zero/negative/decimal, string length/content, date validity, array size, null/undefined |
| **TOTAL** | **83** | Reference-quality comprehensive coverage |

---

## 📋 Excel Sheets Included

### Sheet 1: Test Cases
- All 49 test cases with detailed information
- Columns: TC_ID, Test Type, Test Scenario, Pre-Condition, Test Steps, Test Data, Expected Result, Status
- Professional formatting with color-coded headers

### Sheet 2: Summary
- TEST CASE SUMMARY breakdown table
- Quick reference for test count by type
- Visual representation of coverage

### Sheet 3: Ticket Details
- JIRA ticket information
- Project details
- Generation metadata

---

## 💡 Examples

### Single Ticket
```bash
testcase-master GAAM-933
```

**Output:**
```
✓ Generating 80+ comprehensive test cases...
✓ Including boundary value testing (26 tests)...
✓ Reference file quality and detail...
✓ Excel file created: GAAM-933_ENHANCED_MASTER_....xlsx
✓ GAAM-933 - Generated 83 test cases
  Comprehensive Breakdown:
    • 7 Positive Tests
    • 7 Negative Tests
    • 7 Edge Case Tests
    • 4 Security Tests
    • 3 Performance Tests
    • 7 Accessibility Tests (WCAG 2.2)
    • 9 Responsive Design Tests (9 device breakpoints)
    • 7 Compatibility Tests (Cross-browser)
    • 7 UI/UX Tests
    • 3 Integration Tests
    • 26 Boundary Value Tests
```

### Multiple Tickets
```bash
testcase-master GAAM-933 GAAM-524 GAAM-687
```

**Output:** 3 separate Excel files, each with 83 test cases + professional summary sheet

---

## 📁 Output Location

All generated files are saved to:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

File naming format:
```
{TICKET_ID}_MASTER_{Description}.xlsx
```

Example:
```
GAAM-933_MASTER_GAAM_933___Feature_Implementation.xlsx
```

---

## ⚙️ Features Combined

✅ **V2 Generator** - Feature-specific tests  
✅ **V3 Generator** - AEM detailed tests  
✅ **V4 Generator** - Intelligent analysis  
✅ **Ultimate Generator** - All features combined  
✅ **Boundary Testing** - 26 comprehensive boundary tests  
✅ **Summary Sheet** - Test breakdown table  
✅ **Professional Formatting** - Color-coded, ready-to-use Excel  

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution:**
```bash
npm install axios
```

### Issue: "File not found"
**Solution:** Make sure you're in the correct directory:
```bash
cd C:\Users\PuneethAM\GA_testcases
testcase-master GAAM-933
```

### Issue: "JIRA unreachable"
**Solution:** Generator uses mock data if JIRA API is unavailable. Test cases are still generated with full coverage.

---

## 📝 Quick Commands Reference

| Task | Command |
|------|---------|
| Single ticket | `testcase-master GAAM-933` |
| Multiple tickets | `testcase-master GAAM-933 GAAM-524 GAAM-687` |
| Using Node directly | `node jira_testcase_generator_master.js GAAM-933` |
| View this guide | Open `MASTER_TESTCASE_GUIDE.md` |
| Check JIRA integration | Check `CLAUDE.md` |

---

## 🎯 Best Practices

1. **Always use the Master Generator** - It combines all features
2. **Batch multiple tickets together** - More efficient
3. **Check the Summary Sheet** - Quick reference for coverage
4. **Customize test cases** - Edit Excel file as needed
5. **Keep Excel files** - Reference for regression testing

---

## 📚 Files in This Directory

| File | Purpose |
|------|---------|
| `jira_testcase_generator_master.js` | Main generator (all features combined) |
| `testcase-master-skill.js` | Skill wrapper for CLI integration |
| `testcase-master.bat` | Easy batch file execution |
| `MASTER_TESTCASE_GUIDE.md` | This file |
| `CLAUDE.md` | Project documentation |
| `GA_testcases/` | Output folder (auto-created) |

---

## 🚀 Get Started Now!

```bash
cd C:\Users\PuneethAM\GA_testcases
testcase-master GAAM-933
```

That's it! Your Excel file with 49 comprehensive test cases will be generated in seconds! ✨

---

**Questions?** Check the CLAUDE.md file for more details.
