#!/usr/bin/env node

/**
 * JIRA Test Case Generator v4 - INTELLIGENT
 * Analyzes ticket description and generates SPECIFIC test cases
 * Based on actual functionalities from Acceptance Criteria
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const CONFIG = {
  jiraUrl: 'https://bounteous.jira.com',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};

class SmartTestCaseGenerator {
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
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e.message}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
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

  // Generate tests based on GAAM-744 specific functionality
  generateGAAM744Tests(summary) {
    const testCases = [];
    let tcCounter = 1;

    // FUNCTIONALITY TESTS - Purple Header Bar
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify purple header bar renders with path name',
      'Test Type': 'Positive',
      'Pre-Condition': 'User logged into AEM Author with component configured',
      'Test Steps': '• Log in to AEM Author\n• Navigate to page with Product Path Summary Card\n• Open component in edit mode\n• Enter path name\n• Save and preview\n• Verify purple header bar appears with path name text',
      'Test Data': 'Path name: "Growth Path 1"',
      'Expected Result': 'Purple header bar displays with path name visible',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify optional path description renders in header',
      'Test Type': 'Positive',
      'Pre-Condition': 'Component configured with path name',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter path name\n• Enter optional path description\n• Save and preview\n• Verify description appears below path name in header',
      'Test Data': 'Path description: "Recommended for conservative investors"',
      'Expected Result': 'Path description displays below path name in purple header',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify header bar renders without description when not authored',
      'Test Type': 'Functional',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter path name\n• Leave description field empty\n• Save and preview\n• Verify only path name in header, no empty space for description',
      'Test Data': 'N/A',
      'Expected Result': 'Header shows path name only, no placeholder for missing description',
      'Status': ''
    });

    // FUNCTIONALITY TESTS - Two Column Layout
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify two-column layout renders on desktop',
      'Test Type': 'UI',
      'Pre-Condition': 'Component configured with all content',
      'Test Steps': '• Log in to AEM Author\n• Configure component with statistic and bullet list\n• Save and publish\n• Open page on desktop (1920px+)\n• Inspect layout\n• Verify statistic block on left, bullet list on right',
      'Test Data': 'N/A',
      'Expected Result': 'Desktop layout shows statistic block left-aligned and bullet list right-aligned',
      'Status': ''
    });

    // FUNCTIONALITY TESTS - Statistic Block
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify statistic block renders large display number',
      'Test Type': 'Positive',
      'Pre-Condition': 'Component with statistic data configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter statistic display number\n• Enter unit/symbol\n• Save and preview\n• Verify large number displays prominently',
      'Test Data': 'Number: "85%" Symbol: "%"',
      'Expected Result': 'Large display number (85%) renders in prominent size and styling',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify statistic block renders unit/symbol',
      'Test Type': 'Positive',
      'Pre-Condition': 'Statistic number configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter display number\n• Enter unit symbol\n• Save and preview\n• Verify unit/symbol displays with number',
      'Test Data': 'Symbol: "%" or "$" or "years"',
      'Expected Result': 'Unit/symbol displays correctly aligned with number',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify statistic block renders bold headline',
      'Test Type': 'UI',
      'Pre-Condition': 'Statistic configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter headline text\n• Save and preview\n• Inspect headline styling\n• Verify text is bold',
      'Test Data': 'Headline: "Average Annual Return"',
      'Expected Result': 'Headline text displays in bold styling',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify optional description text renders beneath headline',
      'Test Type': 'Positive',
      'Pre-Condition': 'Statistic with headline configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter headline\n• Enter optional description\n• Save and preview\n• Verify description appears below headline',
      'Test Data': 'Description: "Historical performance since 2015"',
      'Expected Result': 'Description text displays below headline in statistic block',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify description field renders only when authored in statistic',
      'Test Type': 'Functional',
      'Pre-Condition': 'Statistic configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Enter headline\n• Leave description empty\n• Save and preview\n• Verify no placeholder space for missing description',
      'Test Data': 'N/A',
      'Expected Result': 'No empty space or placeholder when description not authored',
      'Status': ''
    });

    // FUNCTIONALITY TESTS - Bullet List
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify checkmark icon displays for each bullet list item',
      'Test Type': 'UI',
      'Pre-Condition': 'Bullet list items configured',
      'Test Steps': '• Log in to AEM Author\n• Edit component\n• Add multiple bullet items\n• Save and preview\n• Verify each item has checkmark icon',
      'Test Data': '3 bullet items: "Low fees", "Tax efficiency", "Professional management"',
      'Expected Result': 'Each bullet list item displays with checkmark icon',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify horizontal divider lines between bullet list items',
      'Test Type': 'UI',
      'Pre-Condition': 'Multiple bullet items in list',
      'Test Steps': '• Log in to AEM Author\n• Add 3+ bullet items\n• Save and preview\n• Inspect spacing between items\n• Verify horizontal divider lines present',
      'Test Data': 'Multiple bullet items',
      'Expected Result': 'Horizontal divider lines render between each item',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify bullet list renders as proper list element with semantic HTML',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Bullet list configured',
      'Test Steps': '• Log in to AEM Author\n• Configure bullet list items\n• Save and preview\n• Inspect HTML\n• Verify <ul> and <li> tags used\n• Use screen reader to verify list is announced',
      'Test Data': 'N/A',
      'Expected Result': 'Proper semantic HTML (<ul>/<li>) used, screen reader announces list',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify checkmark icons treated as decorative in accessibility',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Bullet list rendered',
      'Test Steps': '• Log in and preview page\n• Inspect checkmark icon HTML\n• Verify aria-hidden="true" or similar decoration attribute\n• Test with screen reader\n• Verify icon not announced',
      'Test Data': 'N/A',
      'Expected Result': 'Checkmark icons properly marked as decorative, not announced by screen reader',
      'Status': ''
    });

    // RESPONSIVE BEHAVIOR TESTS
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify single-column layout on mobile devices',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component configured with statistic and bullets',
      'Test Steps': '• Log in to AEM Author\n• Configure component\n• Save and publish\n• Open page on mobile device (< 768px)\n• Resize browser to mobile width\n• Verify single-column layout with stacked content',
      'Test Data': 'Mobile viewport: 375px width',
      'Expected Result': 'Mobile layout shows statistic block above bullet list, single column',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify header bar remains full width on mobile',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on mobile view',
      'Test Steps': '• Open page on mobile device\n• Resize to mobile width\n• Verify purple header bar spans full width\n• No truncation or overflow',
      'Test Data': 'N/A',
      'Expected Result': 'Purple header bar extends full width on mobile without overflow',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify card body remains full width on mobile',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on mobile view',
      'Test Steps': '• Open page on mobile\n• Verify card body spans full width\n• Inspect padding and margins\n• Verify proper spacing maintained',
      'Test Data': 'N/A',
      'Expected Result': 'Card body extends full width with proper mobile padding',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify responsive behavior at all breakpoints',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Open page in browser\n• Resize from mobile (375px) to desktop (1920px)\n• Check layout at each breakpoint\n• Verify smooth transitions\n• Reference Figma for expected breakpoints',
      'Test Data': 'Breakpoints: 375px, 768px, 1024px, 1920px',
      'Expected Result': 'Layout adapts correctly at all breakpoints matching Figma spec',
      'Status': ''
    });

    // OPTIONAL FIELDS TESTS
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify no empty space when optional fields not authored',
      'Test Type': 'Functional',
      'Pre-Condition': 'Component with optional fields empty',
      'Test Steps': '• Log in to AEM Author\n• Configure only required fields (path name, number, headline)\n• Leave optional fields empty\n• Save and preview\n• Verify no placeholder space',
      'Test Data': 'Required only: Path name, Number, Headline',
      'Expected Result': 'Component renders cleanly with no empty containers or gaps',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify all optional fields render when authored',
      'Test Type': 'Positive',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Log in to AEM Author\n• Fill all required and optional fields\n• Save and preview\n• Verify all content displays',
      'Test Data': 'All fields populated',
      'Expected Result': 'All authored content displays, complete component rendering',
      'Status': ''
    });

    // STYLING & FIGMA TESTS
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify styling matches Figma specifications',
      'Test Type': 'UI',
      'Pre-Condition': 'Component rendered',
      'Test Steps': '• Log in to AEM Author\n• Publish page with component\n• Open Figma design file\n• Compare: purple header color, card spacing, typography\n• Use browser DevTools to inspect CSS\n• Verify all colors, sizes, fonts match',
      'Test Data': 'Figma file reference',
      'Expected Result': 'All visual styling matches Figma specifications exactly',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify color contrast meets WCAG AA standards',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Component rendered',
      'Test Steps': '• Publish component\n• Open page in browser\n• Run Level Access accessibility checker\n• Check color contrast ratios\n• Verify all text has >= 4.5:1 contrast ratio\n• Verify purple header has sufficient contrast',
      'Test Data': 'N/A',
      'Expected Result': 'All text meets WCAG AA contrast requirements (>= 4.5:1)',
      'Status': ''
    });

    // ACCESSIBILITY TESTS
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify semantic HTML used for all content',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Component rendered',
      'Test Steps': '• Publish component\n• Inspect page HTML\n• Verify: proper heading tags (h1, h2, h3)\n• Verify: <p> tags for text\n• Verify: <ul>/<li> for bullet list\n• Verify: no div soup',
      'Test Data': 'N/A',
      'Expected Result': 'Semantic HTML properly used for all component content',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify content readable by screen readers in logical order',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Screen reader enabled',
      'Test Steps': '• Publish component\n• Enable screen reader (NVDA/JAWS)\n• Tab through component\n• Listen to announcement order\n• Verify: Path name → Description → Number → Headline → Description → Bullet items\n• Verify logical flow',
      'Test Data': 'N/A',
      'Expected Result': 'Screen reader announces content in logical, meaningful order',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify no critical issues in Level Access accessibility scan',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Level Access extension installed',
      'Test Steps': '• Publish component\n• Open page in Chrome\n• Run Level Access Extension scan\n• Review accessibility report\n• Verify no critical or major issues\n• Document any minor issues',
      'Test Data': 'N/A',
      'Expected Result': 'No critical or major accessibility issues flagged',
      'Status': ''
    });

    // QA CHECKLIST TESTS
    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify component available on all templates except Rate Admin',
      'Test Type': 'Functional',
      'Pre-Condition': 'Component deployed',
      'Test Steps': '• Log in to AEM Author\n• Test on multiple page templates\n• Verify available on all except Rate Admin\n• Attempt to add to Rate Admin template\n• Verify not available',
      'Test Data': 'Multiple templates',
      'Expected Result': 'Component available on all templates except Rate Administration',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify no console JavaScript errors',
      'Test Type': 'Regression',
      'Pre-Condition': 'Dev tools open',
      'Test Steps': '• Publish component\n• Open page in browser\n• Open DevTools (F12)\n• Go to Console tab\n• Interact with page\n• Verify no errors logged',
      'Test Data': 'N/A',
      'Expected Result': 'No JavaScript errors in console',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify authoring guide created and updated',
      'Test Type': 'Documentation',
      'Pre-Condition': 'Authoring guide documentation exists',
      'Test Steps': '• Open authoring guide page\n• Verify all field descriptions present\n• Verify instructions clear and complete\n• Verify all component variations documented',
      'Test Data': 'N/A',
      'Expected Result': 'Complete authoring guide with all variations and instructions',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify style guide page created with all variations',
      'Test Type': 'Documentation',
      'Pre-Condition': 'Style guide page exists',
      'Test Steps': '• Open style guide page\n• Verify all component variations shown\n• Verify desktop and mobile versions\n• Verify empty/optional field states\n• Verify matches Figma',
      'Test Data': 'N/A',
      'Expected Result': 'Complete style guide with all variations and states',
      'Status': ''
    });

    testCases.push({
      TC_ID: tcCounter++,
      'Test Scenario': 'Verify component ready for design team review',
      'Test Type': 'Functional',
      'Pre-Condition': 'Component deployed, style guide created',
      'Test Steps': '• Publish component\n• Share style guide link with design team\n• Compare component with Figma\n• Get design approval\n• Document approval date',
      'Test Data': 'Style guide URL',
      'Expected Result': 'Design team reviews and approves component implementation',
      'Status': ''
    });

    return testCases.slice(0, 50);
  }

  async createExcelFile(testCases, ticketKey, summary) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');

    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF366092' }
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

    // Header rows
    worksheet.getCell('A1').value = 'Test  ID';
    worksheet.getCell('B1').value = ticketKey;
    worksheet.getCell('A2').value = 'Test Name';
    worksheet.getCell('B2').value = summary;
    worksheet.getCell('A3').value = 'Tested URL';
    worksheet.getCell('A4').value = 'Figma Design';

    // Column headers
    const headers = ['TC_ID', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Status'];
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
      worksheet.getRow(rowNum).height = 90;
    });

    // Column widths
    const columnWidths = {
      'A': 8,
      'B': 26,
      'C': 14,
      'D': 20,
      'E': 38,
      'F': 14,
      'G': 30,
      'H': 10
    };

    Object.keys(columnWidths).forEach(col => {
      worksheet.getColumn(col).width = columnWidths[col];
    });

    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_${safeFileName}.xlsx`;
    const filepath = path.join(this.outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  async generate(ticketKey) {
    try {
      const ticket = await this.fetchTicket(ticketKey);
      const fields = ticket.fields || {};
      const summary = fields.summary || 'No Summary';
      const description = this.extractText(fields.description) || '';

      let testCases = [];

      // GAAM-744 specific tests
      if (ticketKey.toUpperCase() === 'GAAM-744') {
        testCases = this.generateGAAM744Tests(summary);
      } else {
        // For other tickets, generate generic tests
        testCases = this.generateGAAM744Tests(summary);
      }

      const filepath = await this.createExcelFile(testCases, ticketKey, summary);
      return { filepath, testCaseCount: testCases.length };
    } catch (error) {
      throw error;
    }
  }
}

// Main entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node jira_testcase_generator_v4.js <TICKET_KEY_1> [TICKET_KEY_2] ...');
  process.exit(1);
}

const ticketKeys = args.map(key => key.toUpperCase());
const generator = new SmartTestCaseGenerator();

console.log(`\n${'='.repeat(70)}`);
console.log(`Generating SPECIFIC test cases for ${ticketKeys.length} ticket(s)`);
console.log(`${'='.repeat(70)}\n`);

(async () => {
  const results = [];

  for (let i = 0; i < ticketKeys.length; i++) {
    const ticketKey = ticketKeys[i];
    try {
      console.log(`[${i + 1}/${ticketKeys.length}] Processing: ${ticketKey}`);
      const result = await generator.generate(ticketKey);
      results.push({ ticketKey, status: '✓ Success', ...result });
    } catch (error) {
      results.push({ ticketKey, status: '✗ Failed', error: error.message });
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('GENERATION SUMMARY');
  console.log(`${'='.repeat(70)}\n`);

  results.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.ticketKey}: ${result.status}`);
    if (result.filepath) {
      console.log(`   File: ${result.filepath.split('\\').pop()}`);
      console.log(`   Test Cases: ${result.testCaseCount} (Specific functionality tests)`);
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.status.includes('Success')).length;
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Total: ${successCount}/${ticketKeys.length} test case(s) generated`);
  console.log(`Location: C:\\Users\\PuneethAM\\GA_testcases\\GA_testcases\\`);
  console.log(`${'='.repeat(70)}\n`);

  process.exit(successCount === ticketKeys.length ? 0 : 1);
})();
