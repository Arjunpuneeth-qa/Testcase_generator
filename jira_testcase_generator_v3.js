#!/usr/bin/env node

/**
 * JIRA Test Case Generator v3
 * Generates detailed test cases with step-by-step instructions from login
 * Format matches reference files: detailed Test Steps with bullet points
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

class DetailedTestCaseGenerator {
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

  // Detailed test cases with step-by-step login flow
  generateDetailedTestCases(ticket) {
    const fields = ticket.fields || {};
    const ticketKey = ticket.key || 'UNKNOWN';
    const summary = fields.summary || 'No Summary';
    const description = this.extractText(fields.description) || '';

    const testCases = [];
    let tcCounter = 1;

    const descLower = (description + summary).toLowerCase();

    // Component/Feature Tests
    if (descLower.includes('component') || descLower.includes('banner') || descLower.includes('card')) {
      testCases.push(
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component renders on supported templates`,
          'Test Type': 'Positive',
          'Pre-Condition': 'User has access to AEM Author',
          'Test Steps': `• Log in to AEM Author\n• Navigate to Pages\n• Open a supported page template\n• Search and add component\n• Verify component appears in page`,
          'Test Data': 'Component name',
          'Expected Result': 'Component available and renders on all supported templates',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify default configuration renders correctly`,
          'Test Type': 'Positive',
          'Pre-Condition': 'User logged into AEM Author',
          'Test Steps': `• Log in to AEM Author\n• Open a page\n• Add component with default settings\n• Save and publish\n• Preview page\n• Verify default styling applied`,
          'Test Data': 'Default configuration',
          'Expected Result': 'Component displays with correct default styling',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component styling options apply correctly`,
          'Test Type': 'Positive',
          'Pre-Condition': 'Component added to page',
          'Test Steps': `• Log in to AEM Author\n• Open page with component\n• Edit component dialog\n• Select different style option\n• Save and preview\n• Verify new styling applied`,
          'Test Data': 'Different style options (colors, layouts)',
          'Expected Result': 'Styling changes apply correctly without UI breaks',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify optional fields can be left empty`,
          'Test Type': 'Functional',
          'Pre-Condition': 'Component dialog open',
          'Test Steps': `• Log in to AEM Author\n• Add component\n• Leave optional fields empty\n• Save component\n• Publish page\n• Preview and verify no empty spaces`,
          'Test Data': 'N/A',
          'Expected Result': 'Component renders without gaps or empty containers',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component works with all content types`,
          'Test Type': 'Positive',
          'Pre-Condition': 'Component available',
          'Test Steps': `• Log in to AEM Author\n• Add component\n• Configure with text content\n• Add image media\n• Add video media\n• Save and preview\n• Verify all content displays correctly`,
          'Test Data': 'Text, images, videos',
          'Expected Result': 'All content types render properly',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify responsive design on mobile`,
          'Test Type': 'Positive',
          'Pre-Condition': 'Component configured',
          'Test Steps': `• Log in to AEM Author\n• Publish page with component\n• Open page on mobile device\n• Resize browser to mobile width\n• Verify layout adjusts properly\n• Check all content visible`,
          'Test Data': 'N/A',
          'Expected Result': 'Component displays correctly on mobile without overflow',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify responsive design on desktop`,
          'Test Type': 'Positive',
          'Pre-Condition': 'Component configured',
          'Test Steps': `• Log in to AEM Author\n• Publish page with component\n• Open page on desktop (1920px+)\n• Verify layout spans correctly\n• Check spacing and alignment`,
          'Test Data': 'N/A',
          'Expected Result': 'Component displays correctly on desktop with proper spacing',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component styling matches Figma design`,
          'Test Type': 'UI',
          'Pre-Condition': 'Component rendered',
          'Test Steps': `• Log in to AEM Author\n• Publish page\n• Open page in browser\n• Open Figma design spec\n• Compare colors, fonts, spacing\n• Inspect CSS with dev tools`,
          'Test Data': 'Figma design file',
          'Expected Result': 'Component styling matches design specification exactly',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component accessibility`,
          'Test Type': 'Accessibility',
          'Pre-Condition': 'Component rendered',
          'Test Steps': `• Log in to AEM Author\n• Publish page\n• Open page in browser\n• Enable screen reader\n• Tab through component\n• Verify all content announced properly`,
          'Test Data': 'N/A',
          'Expected Result': 'All elements accessible, proper ARIA labels present',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify color contrast meets WCAG standards`,
          'Test Type': 'Accessibility',
          'Pre-Condition': 'Component rendered',
          'Test Steps': `• Log in to AEM Author\n• Publish page\n• Open page in browser\n• Run accessibility checker\n• Check color contrast ratios\n• Verify WCAG AA compliance`,
          'Test Data': 'N/A',
          'Expected Result': 'All text has contrast ratio >= 4.5:1 (WCAG AA)',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component works across different page templates`,
          'Test Type': 'Functional',
          'Pre-Condition': 'Component deployed',
          'Test Steps': `• Log in to AEM Author\n• Create page on Template A\n• Add component and publish\n• Create page on Template B\n• Add component and publish\n• Verify works on all templates`,
          'Test Data': 'Multiple templates',
          'Expected Result': 'Component works consistently on all supported templates',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify no JavaScript console errors`,
          'Test Type': 'Regression',
          'Pre-Condition': 'Dev tools open',
          'Test Steps': `• Log in to AEM Author\n• Publish page with component\n• Open page in browser\n• Open Developer Tools (F12)\n• Go to Console tab\n• Load page and interact with component`,
          'Test Data': 'N/A',
          'Expected Result': 'No JavaScript errors logged in console',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component performance`,
          'Test Type': 'Performance',
          'Pre-Condition': 'Page with multiple components',
          'Test Steps': `• Log in to AEM Author\n• Create page with multiple component instances\n• Publish page\n• Open page in browser\n• Check page load time\n• Monitor performance in DevTools`,
          'Test Data': 'N/A',
          'Expected Result': 'Page loads in < 3 seconds, no lag when interacting',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify cross-browser compatibility`,
          'Test Type': 'Compatibility',
          'Pre-Condition': 'Component deployed',
          'Test Steps': `• Log in to AEM Author\n• Publish page\n• Test in Chrome\n• Test in Safari\n• Test in Firefox\n• Test in Edge\n• Compare rendering across browsers`,
          'Test Data': 'N/A',
          'Expected Result': 'Consistent appearance and behavior across all browsers',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify authoring guide is accessible`,
          'Test Type': 'Documentation',
          'Pre-Condition': 'Documentation published',
          'Test Steps': `• Open style guide page\n• Verify all component variations documented\n• Check that authoring instructions clear\n• Verify examples show different configurations`,
          'Test Data': 'Style guide URL',
          'Expected Result': 'Complete authoring documentation available',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component registration in AEM`,
          'Test Type': 'Functional',
          'Pre-Condition': 'Component deployed',
          'Test Steps': `• Log in to AEM Author\n• Navigate to Component browser\n• Search for component\n• Verify appears in correct category\n• Verify correct name and description`,
          'Test Data': 'Component name',
          'Expected Result': 'Component properly registered and discoverable',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component persistence after page refresh`,
          'Test Type': 'Functional',
          'Pre-Condition': 'Component added to page',
          'Test Steps': `• Log in to AEM Author\n• Add component with configuration\n• Save page\n• Refresh page (F5)\n• Verify component still there with same configuration`,
          'Test Data': 'Component configuration',
          'Expected Result': 'Component and its settings persist after refresh',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component on different browsers - Chrome`,
          'Test Type': 'Compatibility',
          'Pre-Condition': 'Component deployed',
          'Test Steps': `• Open Chrome browser\n• Log in to AEM Author\n• Navigate to page with component\n• Verify rendering\n• Interact with component\n• Verify functionality`,
          'Test Data': 'N/A',
          'Expected Result': 'Component displays and functions correctly in Chrome',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component on different browsers - Safari`,
          'Test Type': 'Compatibility',
          'Pre-Condition': 'Component deployed',
          'Test Steps': `• Open Safari browser\n• Log in to AEM Author\n• Navigate to page with component\n• Verify rendering\n• Interact with component\n• Verify functionality`,
          'Test Data': 'N/A',
          'Expected Result': 'Component displays and functions correctly in Safari',
          'Status': ''
        },
        {
          TC_ID: tcCounter++,
          'Test Scenario': `Verify component on different browsers - Firefox`,
          'Test Type': 'Compatibility',
          'Pre-Condition': 'Component deployed',
          'Test Steps': `• Open Firefox browser\n• Log in to AEM Author\n• Navigate to page with component\n• Verify rendering\n• Interact with component\n• Verify functionality`,
          'Test Data': 'N/A',
          'Expected Result': 'Component displays and functions correctly in Firefox',
          'Status': ''
        }
      );
    }

    // Add more test cases if needed
    while (testCases.length < 25) {
      testCases.push({
        TC_ID: tcCounter++,
        'Test Scenario': `Verify additional test case ${tcCounter}`,
        'Test Type': 'Functional',
        'Pre-Condition': 'Component loaded',
        'Test Steps': `• Log in to AEM Author\n• Navigate to feature\n• Perform action\n• Verify result`,
        'Test Data': 'N/A',
        'Expected Result': 'Feature behaves as expected',
        'Status': ''
      });
    }

    return { testCases: testCases.slice(0, 50), ticketKey, summary };
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
      worksheet.getRow(rowNum).height = 80;
    });

    // Column widths
    const columnWidths = {
      'A': 8,   // TC_ID
      'B': 28,  // Test Scenario
      'C': 13,  // Test Type
      'D': 18,  // Pre-Condition
      'E': 35,  // Test Steps (wider for detailed steps)
      'F': 12,  // Test Data
      'G': 28,  // Expected Result
      'H': 10   // Status
    };

    Object.keys(columnWidths).forEach(col => {
      worksheet.getColumn(col).width = columnWidths[col];
    });

    const filename = `${ticketKey}.xlsx`;
    const filepath = path.join(this.outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  async generate(ticketKey) {
    try {
      const ticket = await this.fetchTicket(ticketKey);
      const { testCases, ticketKey: responseKey, summary } = this.generateDetailedTestCases(ticket);
      const filepath = await this.createExcelFile(testCases, responseKey, summary);

      return { filepath, testCaseCount: testCases.length };
    } catch (error) {
      throw error;
    }
  }
}

// Main entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node jira_testcase_generator_v3.js <TICKET_KEY_1> [TICKET_KEY_2] ...');
  console.log('');
  console.log('Examples:');
  console.log('  node jira_testcase_generator_v3.js GAAM-744');
  console.log('  node jira_testcase_generator_v3.js GAAM-744 GAAM-618');
  process.exit(1);
}

const ticketKeys = args.map(key => key.toUpperCase());
const generator = new DetailedTestCaseGenerator();

console.log(`\n${'='.repeat(70)}`);
console.log(`Generating detailed test cases for ${ticketKeys.length} ticket(s)`);
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
      console.log(`   Test Cases: ${result.testCaseCount}`);
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.status.includes('Success')).length;
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Total: ${successCount}/${ticketKeys.length} test case(s) generated successfully`);
  console.log(`Location: C:\\Users\\PuneethAM\\GA_testcases\\GA_testcases\\`);
  console.log(`Format: Detailed test steps with step-by-step login flow`);
  console.log(`${'='.repeat(70)}\n`);

  process.exit(successCount === ticketKeys.length ? 0 : 1);
})();
