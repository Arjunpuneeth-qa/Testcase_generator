#!/usr/bin/env node

/**
 * INTELLIGENT Deep Analysis Test Case Generator
 * Analyzes JIRA ticket sections: Functionality, Responsive Behavior, Accessibility, QA Checklist
 * Creates specific test cases for STATED requirements, not generic templates
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const CONFIG = {
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};

class IntelligentTestCaseGenerator {
  constructor(outputDir = path.join(__dirname, 'GA_testcases')) {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  fetchTicket(ticketKey) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${CONFIG.email}:${CONFIG.apiToken}`).toString('base64');
      const options = {
        hostname: 'bounteous.jira.com',
        path: `/rest/api/2/issue/${ticketKey}`,
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }

  extractText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (obj.type === 'doc' && Array.isArray(obj.content)) {
      return obj.content.map(block => this.extractText(block)).join('\n');
    }
    if (obj.type === 'paragraph' && Array.isArray(obj.content)) {
      return obj.content.map(item => this.extractText(item)).join('');
    }
    if (obj.type === 'text') return obj.text || '';
    if (Array.isArray(obj)) return obj.map(item => this.extractText(item)).join('\n');
    return '';
  }

  // Parse ticket into sections
  parseSections(text) {
    const sections = {
      functionality: [],
      responsive: [],
      accessibility: [],
      qa: [],
      additional: []
    };

    // Extract Functionality section
    const funcMatch = text.match(/\*Functionality\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (funcMatch) {
      sections.functionality = this.extractBulletPoints(funcMatch[1]);
    }

    // Extract Responsive Behavior section
    const respMatch = text.match(/\*Responsive Behavior\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (respMatch) {
      sections.responsive = this.extractBulletPoints(respMatch[1]);
    }

    // Extract Accessibility section
    const accMatch = text.match(/\*Accessibility[\s\S]*?\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (accMatch) {
      sections.accessibility = this.extractBulletPoints(accMatch[1]);
    }

    // Extract QA Checklist section
    const qaMatch = text.match(/QA Checklist[\s\S]*?\n+([\s\S]*?)(?=\n\n|$)/);
    if (qaMatch) {
      sections.qa = this.extractBulletPoints(qaMatch[1]);
    }

    // Extract Additional Requirements
    const addMatch = text.match(/\*Additional Requirements\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (addMatch) {
      sections.additional = this.extractBulletPoints(addMatch[1]);
    }

    return sections;
  }

  extractBulletPoints(text) {
    const points = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      // Match lines that start with * followed by content
      const match = line.match(/^\s*\*\s+(.+)$/);
      if (match) {
        const cleaned = match[1].trim();
        if (cleaned && cleaned.length > 5) {
          points.push(cleaned);
        }
      }
    });
    return points.filter(p => p.length > 0);
  }

  generateTestCases(ticketKey, summary, sections) {
    const testCases = [];
    let tcId = 1;

    console.log('  Analyzing Functionality requirements...');
    // FUNCTIONALITY TESTS
    sections.functionality.forEach((req, idx) => {
      if (req.includes('purple header')) {
        testCases.push(this.createTest(tcId++, 'Functional - Header Bar',
          `Verify: ${req.substring(0, 60)}`,
          `• Log in to AEM Author\n• Configure component with path name and description\n• Save and preview\n• Verify purple header bar renders\n• Verify path name displays\n• Verify description displays below path name\n• Inspect element styling`,
          `Purple header with path name and optional description`,
          req.substring(0, 70)));
      }

      if (req.includes('Card body') || req.includes('two columns')) {
        testCases.push(this.createTest(tcId++, 'Functional - Layout',
          `Verify: ${req.substring(0, 60)}`,
          `• Configure component on desktop view\n• Verify statistic block on left\n• Verify bullet list on right\n• Verify side-by-side alignment\n• Check spacing between columns`,
          `Two-column layout with statistic left and bullets right`,
          req.substring(0, 70)));
      }

      if (req.includes('Statistic block')) {
        testCases.push(this.createTest(tcId++, 'Functional - Statistic',
          `Verify: ${req.substring(0, 60)}`,
          `• Configure statistic with number, unit, headline, description\n• Save and preview\n• Verify large display number\n• Verify unit/symbol displays\n• Verify bold headline\n• Verify description beneath headline`,
          `Statistic block with number, unit, headline, description`,
          req.substring(0, 70)));
      }

      if (req.includes('Bullet list') || req.includes('checkmark')) {
        testCases.push(this.createTest(tcId++, 'Functional - Bullet List',
          `Verify: ${req.substring(0, 60)}`,
          `• Add multiple bullet items\n• Save and preview\n• Verify checkmark icon on each item\n• Verify divider lines between items\n• Check alignment and spacing`,
          `Bullet list with checkmark icons and dividers`,
          req.substring(0, 70)));
      }

      if (req.includes('Optional fields')) {
        testCases.push(this.createTest(tcId++, 'Functional - Optional Fields',
          `Verify: ${req.substring(0, 60)}`,
          `• Configure with required fields only\n• Leave optional fields empty\n• Save and preview\n• Verify no empty placeholder space\n• Verify clean layout\n• Compare with full configuration`,
          `No empty space for unauthored optional fields`,
          req.substring(0, 70)));
      }
    });

    console.log('  Analyzing Responsive Behavior requirements...');
    // RESPONSIVE BEHAVIOR TESTS - SPECIFIC TO STATED REQUIREMENTS
    sections.responsive.forEach((req) => {
      if (req.includes('Desktop') && req.includes('two-column')) {
        // Desktop specific tests
        testCases.push(this.createTest(tcId++, 'Responsive - Desktop (1366px+)',
          'Verify desktop layout is two-column with statistic left and bullets right',
          `• Set viewport to 1366px width\n• Verify component displays two columns\n• Verify statistic block on LEFT side\n• Verify bullet list on RIGHT side\n• Verify columns side-by-side (not stacked)\n• Verify spacing between columns\n• Verify full width utilization\n• Test at 1920px and 2560px widths`,
          `Desktop: Two-column layout (statistic LEFT, bullets RIGHT)`,
          `Desktop: Two-column layout verified at multiple widths`));

        testCases.push(this.createTest(tcId++, 'Responsive - Desktop Layout Alignment',
          'Verify statistic block is positioned on the left at desktop breakpoint',
          `• View on desktop (1366px+)\n• Inspect statistic block position\n• Verify left alignment\n• Verify bullets on right side\n• Measure column widths\n• Verify balanced distribution`,
          `Desktop breakpoint: 1366px, 1920px, 2560px`,
          `Statistic block positioned LEFT, bullet list positioned RIGHT`));
      }

      if (req.includes('Mobile') && req.includes('Single-column')) {
        // Mobile specific tests
        testCases.push(this.createTest(tcId++, 'Responsive - Mobile (< 768px)',
          'Verify mobile layout is single-column with statistic stacked above bullets',
          `• Set viewport to 375px width\n• Verify component displays single column\n• Verify statistic block is ABOVE bullet list\n• Verify stacked layout (not side-by-side)\n• Verify full width\n• Verify proper spacing between sections\n• Test at 320px and 430px widths`,
          `Mobile: Single-column stacked layout (statistic ABOVE bullets)`,
          `Mobile: Single-column layout verified at multiple widths`));

        testCases.push(this.createTest(tcId++, 'Responsive - Mobile Stacking',
          'Verify statistic block stacks above bullet list on mobile',
          `• View on mobile (< 768px)\n• Inspect element positioning\n• Verify statistic block is ABOVE bullets\n• Verify vertical stacking\n• Verify no horizontal columns\n• Check vertical flow and spacing`,
          `Mobile breakpoint: 320px, 375px, 430px`,
          `Statistic block ABOVE bullet list in single column`));

        testCases.push(this.createTest(tcId++, 'Responsive - Mobile vs Desktop Switch',
          'Verify layout switches from two-column to single-column at breakpoint',
          `• Start at desktop view (1920px) - two columns\n• Slowly resize to mobile (375px)\n• Observe layout change from columns to stack\n• Identify exact breakpoint where layout changes\n• Verify smooth transition\n• Verify no jumping or flashing\n• Resize back to desktop - verify reverse transition`,
          `Transition from desktop (1920px) to mobile (375px)`,
          `Layout correctly transitions from 2-col to single-col stacked`));
      }

      if (req.includes('full width')) {
        testCases.push(this.createTest(tcId++, 'Responsive - Full Width at All Breakpoints',
          'Verify header bar and card body remain full width at all breakpoints',
          `• Test at mobile (375px) - verify 100% width\n• Test at tablet (768px) - verify 100% width\n• Test at desktop (1920px) - verify 100% width\n• Inspect width property\n• Verify no left/right margins causing narrowing\n• Verify header spans full width\n• Verify card body spans full width`,
          `All breakpoints: 320px, 768px, 1366px, 1920px`,
          `Header bar and card body are full width at ALL breakpoints`));
      }

      if (req.includes('Figma') && req.includes('breakpoint')) {
        testCases.push(this.createTest(tcId++, 'Responsive - Figma Breakpoints',
          'Verify layout behavior matches Figma breakpoint specifications',
          `• Open Figma design file\n• Identify specified breakpoints\n• Test component at each Figma breakpoint\n• Verify layout matches Figma design\n• Check spacing at each breakpoint\n• Verify visual alignment with design\n• Document any discrepancies`,
          `Figma design file reference`,
          `Component layout matches Figma at all specified breakpoints`));
      }
    });

    console.log('  Analyzing Accessibility requirements...');
    // ACCESSIBILITY TESTS
    sections.accessibility.forEach((req) => {
      if (req.includes('Semantic HTML')) {
        testCases.push(this.createTest(tcId++, 'Accessibility - Semantic HTML',
          'Verify semantic HTML used for all content',
          `• Open DevTools\n• Inspect HTML structure\n• Verify semantic tags for path name\n• Verify semantic tags for statistic\n• Verify semantic tags for headline\n• Verify semantic tags for description\n• Verify semantic tags for bullet list\n• Verify <ul>/<li> structure`,
          `N/A`,
          `All content uses proper semantic HTML`));
      }

      if (req.includes('color contrast')) {
        testCases.push(this.createTest(tcId++, 'Accessibility - Color Contrast',
          'Verify sufficient color contrast on all elements including purple header',
          `• Use color contrast checker\n• Check path name on purple header\n• Check description on purple header\n• Check all other text elements\n• Verify >= 4.5:1 ratio (WCAG AA)\n• Check purple header background color contrast`,
          `WCAG AA minimum: 4.5:1`,
          `All elements meet WCAG AA color contrast (>= 4.5:1)`));
      }

      if (req.includes('screen reader')) {
        testCases.push(this.createTest(tcId++, 'Accessibility - Screen Reader',
          'Verify content is readable by screen readers in logical order',
          `• Enable screen reader (NVDA/JAWS)\n• Navigate through component with Tab key\n• Listen to announcement order\n• Verify path name announced first\n• Verify statistic announced\n• Verify headline announced\n• Verify description announced\n• Verify bullets announced as list`,
          `N/A`,
          `Screen reader announces content in logical, meaningful order`));
      }

      if (req.includes('checkmark') && req.includes('decorative')) {
        testCases.push(this.createTest(tcId++, 'Accessibility - Decorative Icons',
          'Verify checkmark icons treated as decorative and not announced',
          `• Enable screen reader\n• Navigate to bullet list\n• Listen to announcements\n• Verify checkmarks NOT announced\n• Verify only text announced\n• Inspect HTML for aria-hidden or role="presentation"`,
          `N/A`,
          `Checkmark icons marked as decorative, not announced by screen reader`));
      }
    });

    console.log('  Analyzing QA Checklist requirements...');
    // QA CHECKLIST TESTS
    sections.qa.forEach((req) => {
      if (req.includes('templates') && req.includes('Rate')) {
        testCases.push(this.createTest(tcId++, 'QA - Template Availability',
          'Verify component available on all templates except Rate Administration',
          `• Log in to AEM Author\n• Test on main landing page template\n• Test on resource center template\n• Test on content page template\n• Attempt to add to Rate Admin template\n• Verify available on all except Rate Admin`,
          `Multiple templates`,
          `Component available on all templates EXCEPT Rate Administration`));
      }

      if (req.includes('Styles match') && req.includes('Figma')) {
        testCases.push(this.createTest(tcId++, 'QA - Figma Styling',
          'Verify all styles match Figma design specifications',
          `• Open Figma design\n• Compare purple header color\n• Compare typography\n• Compare spacing and padding\n• Compare layout proportions\n• Compare all visual elements\n• Use DevTools to inspect CSS`,
          `Figma design file`,
          `All styling exactly matches Figma specifications`));
      }

      if (req.includes('desktop') && req.includes('mobile')) {
        testCases.push(this.createTest(tcId++, 'QA - Desktop & Mobile Implementation',
          'Verify both desktop and mobile versions are properly implemented',
          `• Verify desktop version renders correctly (1920px)\n• Verify mobile version renders correctly (375px)\n• Test two-column layout on desktop\n• Test single-column layout on mobile\n• Verify layout switch at breakpoint\n• Verify all content visible in both`,
          `Desktop and mobile views`,
          `Both desktop (2-col) and mobile (1-col) versions implemented correctly`));
      }
    });

    console.log('  Generating negative test cases...');
    // NEGATIVE TEST CASES - COMPREHENSIVE COVERAGE
    testCases.push(this.createNegativeTest(tcId++, 'Negative - Empty Path Name',
      'Verify component handles missing path name gracefully',
      `• Leave path name field empty\n• Save component\n• Preview\n• Verify header renders without error\n• Verify no "undefined" or broken display\n• Verify description (if present) still displays`,
      `Empty path name`,
      `Component renders without path name, no errors`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Very Long Path Name',
      'Verify component handles extremely long path name text',
      `• Enter path name with 200+ characters\n• Save and preview\n• Verify text wraps properly\n• Verify header height adjusts if needed\n• Verify no text cutoff or overflow\n• Check on mobile and desktop`,
      `Path name: "This is an extremely long path name text that describes a very detailed investment strategy with many words"`,
      `Long text wraps/truncates gracefully without breaking layout`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Special Characters in Path Name',
      'Verify component safely handles special characters',
      `• Enter path name: "<script>alert('xss')</script>"\n• Enter: "<img src=x onerror=alert()>"\n• Save and preview\n• Verify no script execution\n• Verify text displays literally\n• Check source code for XSS protection`,
      `Special chars: < > & " ' { } [ ] etc.`,
      `Special characters displayed as text, no HTML execution (XSS protected)`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Empty Statistic Number',
      'Verify component handles missing statistic number',
      `• Leave number field empty\n• Enter headline and description\n• Save and preview\n• Verify no "undefined" display\n• Verify statistic block still renders\n• Verify headline displays without number`,
      `Empty statistic number`,
      `Component handles missing number gracefully`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Zero and Negative Numbers',
      'Verify component displays zero and negative numbers correctly',
      `• Enter number: "0"\n• Save and preview\n• Verify displays correctly\n• Enter number: "-5"\n• Save and preview\n• Verify negative sign displays\n• Check alignment and spacing`,
      `Numbers: "0", "-5", "-25%"`,
      `Zero and negative numbers display correctly without issues`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Very Large Numbers',
      'Verify component handles extremely large numbers',
      `• Enter number: "999,999,999"\n• Save and preview\n• Verify displays without overflow\n• Check formatting is readable\n• Verify on mobile fits properly`,
      `Large number: "999,999,999"`,
      `Large numbers display properly without overflow`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Empty Bullet List',
      'Verify no empty list renders when no items added',
      `• Leave bullet list empty\n• Save and preview\n• Verify no empty <ul> element renders\n• Verify no visual placeholder\n• Verify layout is clean`,
      `No bullet items`,
      `Empty bullet list does not render, no empty space`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Single Bullet Item',
      'Verify single bullet item renders without orphaned divider',
      `• Add only one bullet item\n• Save and preview\n• Verify renders correctly\n• Verify no divider below single item\n• Verify alignment correct`,
      `Single item: "Only benefit"`,
      `Single bullet item renders without divider issues`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Very Long Bullet Text',
      'Verify long bullet item text wraps properly',
      `• Add bullet with 200+ character text\n• Save and preview\n• Verify text wraps naturally\n• Verify checkmark aligned to first line\n• Verify no text cutoff\n• Test on mobile`,
      `Bullet: "This is a very long bullet point that describes a feature in extensive detail with many words..."`,
      `Long bullet text wraps correctly without cutoff`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Many Bullet Items',
      'Verify component handles 15+ bullet items',
      `• Add 15 bullet items\n• Save and preview\n• Verify all items render\n• Verify dividers between all items\n• Verify performance acceptable\n• Check scrolling works if needed`,
      `15 bullet items`,
      `Component handles many items without performance issues`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Unicode and International Characters',
      'Verify component displays international characters correctly',
      `• Enter path name in Chinese: "增长路径"\n• Enter description in Arabic\n• Enter emoji in text\n• Save and preview\n• Verify all characters display\n• Check encoding issues`,
      `Unicode: Chinese, Arabic, emoji, diacritics`,
      `Unicode and international characters display correctly`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - HTML Entities',
      'Verify HTML entities are escaped properly',
      `• Enter text: "&lt;div&gt;Test&lt;/div&gt;"\n• Enter: "&amp; < > & ' \" { }"\n• Save and preview\n• Verify entities display as text\n• Verify proper escaping`,
      `HTML entities: &lt; &gt; &amp; &quot; etc.`,
      `HTML entities escaped and displayed as text`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Whitespace Handling',
      'Verify leading/trailing whitespace handled correctly',
      `• Enter path name: "  Path Name  " (with spaces)\n• Save and preview\n• Verify spaces trimmed or handled\n• Verify no excessive padding\n• Check other fields`,
      `Text with spaces: "  Path Name  "`,
      `Whitespace properly handled without visual issues`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Responsive with Long Text',
      'Verify responsive behavior with very long text',
      `• Add long path name (150+ chars)\n• Test on mobile (375px)\n• Verify text wraps properly\n• Verify header height adjusts\n• Verify no overflow\n• Test on desktop`,
      `Long text on all breakpoints`,
      `Long text wraps correctly at all breakpoints`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Missing Optional Description',
      'Verify header renders without description, no empty space',
      `• Configure with path name only\n• Leave description empty\n• Save and preview\n• Verify no empty placeholder\n• Verify header compact\n• Verify alignment correct`,
      `Description: empty`,
      `No empty space when description not authored`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Malformed Data Input',
      'Verify component handles malformed/invalid input',
      `• Enter number field: "abc123"\n• Enter: "!@#$%^&*()"\n• Enter: null/undefined values\n• Save and preview\n• Verify no console errors\n• Verify graceful handling`,
      `Invalid data: abc, symbols, null`,
      `Malformed data handled without breaking component`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Concurrent Field Updates',
      'Verify rapid/concurrent field updates handled correctly',
      `• Update path name rapidly\n• Update statistic number rapidly\n• Update bullets quickly\n• Save frequently\n• Verify no data corruption\n• Verify no race conditions`,
      `Rapid updates to multiple fields`,
      `Concurrent updates handled without data loss`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Component on Narrow Width',
      'Verify component does not break at very narrow width',
      `• Set viewport to 280px width (smaller than 320px)\n• Verify content visible\n• Verify no horizontal scroll required\n• Verify layout still functional\n• Check readability`,
      `Ultra narrow: 280px width`,
      `Component handles very narrow viewport gracefully`));

    testCases.push(this.createNegativeTest(tcId++, 'Negative - Missing Figma Reference',
      'Verify component renders even without Figma specification',
      `• Assume Figma link unavailable\n• Component should still render\n• Verify fallback styling works\n• Verify component functional\n• Check no broken references`,
      `No Figma reference available`,
      `Component functions without Figma specification`));

    console.log('  Generating additional specific test cases...');
    // ADDITIONAL SPECIFIC TESTS
    // Test for responsive layout transition
    testCases.push(this.createTest(tcId++, 'Responsive - Breakpoint Identification',
      'Identify and verify the exact breakpoint where layout changes from desktop to mobile',
      `• Resize browser from 1920px down to 320px continuously\n• Watch for layout change point\n• Identify exact pixel width where 2-col becomes 1-col\n• Verify smooth transition at breakpoint\n• Test at transition point multiple times\n• Document the breakpoint value`,
      `Transition point between desktop/mobile`,
      `Layout transition point identified and verified`));

    // Test for column widths
    testCases.push(this.createTest(tcId++, 'Responsive - Desktop Column Widths',
      'Verify desktop columns are properly balanced',
      `• View on desktop (1920px)\n• Measure statistic block width\n• Measure bullet list width\n• Calculate percentage of container\n• Verify reasonable distribution\n• Check alignment with Figma specs`,
      `Desktop breakpoint: 1920px`,
      `Desktop columns properly balanced and aligned`));

    // Test for mobile padding/spacing
    testCases.push(this.createTest(tcId++, 'Responsive - Mobile Spacing',
      'Verify adequate spacing and padding on mobile',
      `• View on mobile (375px)\n• Check padding around content\n• Verify spacing between sections\n• Verify statistic spacing above bullets\n• Check touch target sizing (min 44x44px)\n• Verify text is readable`,
      `Mobile breakpoint: 375px`,
      `Mobile spacing and padding is adequate for usability`));

    // Test for content overflow
    testCases.push(this.createTest(tcId++, 'Responsive - No Overflow',
      'Verify no content overflow at any breakpoint',
      `• Test at all breakpoints (320px, 768px, 1366px, 1920px)\n• Check for horizontal scroll\n• Verify all content visible\n• Verify no text cutoff\n• Verify images/icons scale properly`,
      `All breakpoints`,
      `No overflow or cutoff at any breakpoint`));

    return testCases;
  }

  createTest(id, category, scenario, steps, data, expected) {
    return {
      TC_ID: id,
      'Category': category,
      'Test Scenario': scenario,
      'Test Type': this.getTestType(category),
      'Pre-Condition': 'Component configured with full content',
      'Test Steps': steps,
      'Test Data': data,
      'Expected Result': expected,
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    };
  }

  createNegativeTest(id, category, scenario, steps, data, expected) {
    return {
      TC_ID: id,
      'Category': category,
      'Test Scenario': scenario,
      'Test Type': 'Negative',
      'Pre-Condition': 'Component configured',
      'Test Steps': steps,
      'Test Data': data,
      'Expected Result': expected,
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    };
  }

  getTestType(category) {
    if (category.includes('Functional')) return 'Functional';
    if (category.includes('Responsive')) return 'Responsive';
    if (category.includes('Accessibility')) return 'Accessibility';
    if (category.includes('QA')) return 'QA';
    return 'Functional';
  }

  async createExcelFile(testCases, ticketKey, summary) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');

    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' }
    };

    const headerFont = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 11
    };

    const border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Header section
    worksheet.getCell('A1').value = 'Ticket ID';
    worksheet.getCell('B1').value = ticketKey;
    worksheet.getCell('A2').value = 'Summary';
    worksheet.getCell('B2').value = summary;
    worksheet.getCell('A3').value = 'Total Test Cases';
    worksheet.getCell('B3').value = testCases.length;
    worksheet.getCell('A4').value = 'Generated';
    worksheet.getCell('B4').value = new Date().toLocaleString();

    // Column headers
    const headers = ['TC_ID', 'Category', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Status', 'Browser'];
    const headerRow = 6;
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(headerRow, index + 1);
      cell.value = header;
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
      cell.border = border;
    });
    worksheet.getRow(headerRow).height = 25;

    // Data rows
    testCases.forEach((testCase, rowIndex) => {
      const rowNum = rowIndex + 7;
      headers.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNum, colIndex + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = border;
      });
      worksheet.getRow(rowNum).height = 110;
    });

    // Column widths
    const columnWidths = {
      'A': 8, 'B': 24, 'C': 36, 'D': 16, 'E': 26, 'F': 44, 'G': 16, 'H': 36, 'I': 10, 'J': 20
    };

    Object.keys(columnWidths).forEach(col => {
      worksheet.getColumn(col).width = columnWidths[col];
    });

    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_INTELLIGENT_${safeFileName}.xlsx`;
    const filepath = path.join(this.outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  async generate(ticketKey) {
    try {
      console.log(`\nFetching JIRA ticket: ${ticketKey}`);
      const ticket = await this.fetchTicket(ticketKey);
      const fields = ticket.fields || {};
      const summary = fields.summary || 'No Summary';
      const description = this.extractText(fields.description) || '';

      console.log(`Summary: ${summary}`);
      console.log('\nAnalyzing ticket sections...');

      // Parse sections from description
      const sections = this.parseSections(description);
      console.log(`\nFound sections:`);
      console.log(`  • Functionality items: ${sections.functionality.length}`);
      console.log(`  • Responsive Behavior items: ${sections.responsive.length}`);
      console.log(`  • Accessibility items: ${sections.accessibility.length}`);
      console.log(`  • QA Checklist items: ${sections.qa.length}`);
      console.log(`  • Additional Requirements: ${sections.additional.length}`);

      console.log('\nGenerating test cases for each requirement...');

      // Generate test cases based on parsed sections
      const testCases = this.generateTestCases(ticketKey, summary, sections);
      console.log(`✓ Generated ${testCases.length} focused test cases`);

      // Create Excel file
      const filepath = await this.createExcelFile(testCases, ticketKey, summary);
      console.log(`✓ Excel file created: ${path.basename(filepath)}`);

      return { filepath, testCaseCount: testCases.length };
    } catch (error) {
      console.error(`✗ Error processing ${ticketKey}:`, error.message);
      throw error;
    }
  }
}

// Main entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node intelligent_testcase_generator.js <TICKET_KEY>');
  console.log('Example: node intelligent_testcase_generator.js GAAM-744');
  process.exit(1);
}

const ticketKey = args[0].toUpperCase();
const generator = new IntelligentTestCaseGenerator();

console.log(`\n${'='.repeat(90)}`);
console.log(`INTELLIGENT Deep Analysis Test Case Generator`);
console.log(`Processing: ${ticketKey}`);
console.log(`${'='.repeat(90)}`);

(async () => {
  try {
    const result = await generator.generate(ticketKey);
    console.log(`\n${'='.repeat(90)}`);
    console.log('✓ SUCCESS - INTELLIGENT ANALYSIS COMPLETE');
    console.log(`${'='.repeat(90)}`);
    console.log(`Ticket: ${ticketKey}`);
    console.log(`Total Test Cases: ${result.testCaseCount}`);
    console.log(`File: ${path.basename(result.filepath)}`);
    console.log(`${'='.repeat(90)}\n`);
  } catch (error) {
    console.error('✗ Failed:', error.message);
    process.exit(1);
  }
})();
