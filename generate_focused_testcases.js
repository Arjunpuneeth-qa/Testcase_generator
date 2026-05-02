#!/usr/bin/env node

/**
 * JIRA Focused Test Case Generator - DYNAMIC
 * Fetches JIRA ticket data and generates test cases based on actual functionalities
 * Parses description to extract specific requirements and generates focused tests
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

class DynamicFocusedTestCaseGenerator {
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

  // Extract functionalities from ticket description
  extractFunctionalities(description) {
    const functionalities = [];

    // Look for "Functionality:" patterns
    const funcRegex = /Functionality:\s*(.+?)(?=Functionality:|$)/gs;
    let match;
    while ((match = funcRegex.exec(description)) !== null) {
      functionalities.push(match[1].trim());
    }

    // If no structured functionalities found, look for bullet points starting with "Component"
    if (functionalities.length === 0) {
      const bulletRegex = /^[\s-•]*(.+?)$/gm;
      const lines = description.split('\n');
      lines.forEach(line => {
        const cleaned = line.trim();
        if (cleaned.length > 20 && (cleaned.startsWith('-') || cleaned.startsWith('•') || cleaned.includes('renders') || cleaned.includes('display'))) {
          functionalities.push(cleaned.replace(/^[-•]\s*/, ''));
        }
      });
    }

    return functionalities.slice(0, 6); // Limit to 6 main functionalities
  }

  // Generate test cases based on extracted functionalities
  generateDynamicTestCases(ticketKey, description, functionalities) {
    const testCases = [];
    let tcId = 1;

    if (functionalities.length === 0) {
      // Fallback if no functionalities extracted
      functionalities = [
        'Component renders correctly',
        'Component displays content',
        'Component styling matches design',
        'Component is responsive',
        'Component handles optional fields',
        'Component meets accessibility standards'
      ];
    }

    // For each functionality, create multiple test cases
    functionalities.forEach((functionality, funcIndex) => {
      // Clean up the functionality text
      const funcName = functionality.replace(/^[•-]\s*/, '').split('\n')[0];

      // Test 1: Positive/Basic functionality
      testCases.push({
        TC_ID: tcId++,
        'Test Scenario': `Verify ${funcName.substring(0, 60)}`,
        'Test Type': 'Positive',
        'Pre-Condition': 'Component added to page in AEM Author',
        'Test Steps': `• Log in to AEM Author\n• Navigate to page with component\n• Open component in edit mode\n• Verify ${funcName.substring(0, 40).toLowerCase()}\n• Save and preview\n• Verify rendering is correct`,
        'Test Data': 'Component with valid configuration',
        'Expected Result': `${funcName.substring(0, 60)} displays correctly as expected`,
        'Status': ''
      });

      // Test 2: UI/Styling verification
      testCases.push({
        TC_ID: tcId++,
        'Test Scenario': `Verify styling for: ${funcName.substring(0, 50)}`,
        'Test Type': 'UI',
        'Pre-Condition': 'Feature rendered',
        'Test Steps': `• Preview page\n• Inspect styling using DevTools\n• Compare with Figma design specifications\n• Verify colors, fonts, spacing\n• Check visual hierarchy`,
        'Test Data': 'Figma design specification',
        'Expected Result': 'Styling matches Figma design exactly',
        'Status': ''
      });

      // Test 3: Edge case or empty state
      testCases.push({
        TC_ID: tcId++,
        'Test Scenario': `Verify ${funcName.substring(0, 50)} handles optional fields`,
        'Test Type': 'Functional',
        'Pre-Condition': 'Component configured',
        'Test Steps': `• Log in to AEM Author\n• Configure component with minimal required fields\n• Leave optional fields empty\n• Save and preview\n• Verify no empty placeholders\n• Verify clean rendering`,
        'Test Data': 'N/A',
        'Expected Result': 'Optional fields render only when authored, no empty space when absent',
        'Status': ''
      });

      // Test 4: Responsive behavior
      if (funcIndex === 0) { // Only add responsive tests once
        testCases.push({
          TC_ID: tcId++,
          'Test Scenario': 'Verify desktop layout is correct',
          'Test Type': 'Responsive',
          'Pre-Condition': 'Component configured',
          'Test Steps': `• Preview on desktop (1920px+)\n• Verify all elements display\n• Check spacing and alignment\n• Verify no overflow or truncation\n• Compare with Figma desktop spec`,
          'Test Data': 'Desktop breakpoint: 1920px',
          'Expected Result': 'Desktop layout matches design specification',
          'Status': ''
        });

        testCases.push({
          TC_ID: tcId++,
          'Test Scenario': 'Verify mobile layout is correct',
          'Test Type': 'Responsive',
          'Pre-Condition': 'Component configured',
          'Test Steps': `• Preview on mobile (375px)\n• Verify single-column stacked layout\n• Check text readability\n• Verify proper padding and margins\n• Compare with Figma mobile spec`,
          'Test Data': 'Mobile breakpoint: 375px',
          'Expected Result': 'Mobile layout adapts correctly and matches specification',
          'Status': ''
        });
      }

      // Test 5: Accessibility
      if (funcIndex === 0) {
        testCases.push({
          TC_ID: tcId++,
          'Test Scenario': 'Verify semantic HTML and accessibility',
          'Test Type': 'Accessibility',
          'Pre-Condition': 'Component rendered',
          'Test Steps': `• Inspect HTML structure\n• Verify semantic tags (h1, h2, p, ul, li)\n• Run Level Access accessibility checker\n• Verify color contrast >= 4.5:1\n• Test with screen reader`,
          'Test Data': 'N/A',
          'Expected Result': 'Semantic HTML used, WCAG AA compliance met, screen reader friendly',
          'Status': ''
        });
      }
    });

    // Add Figma reference tests if we haven't reached minimum
    if (testCases.length < 15) {
      testCases.push({
        TC_ID: tcId++,
        'Test Scenario': 'Verify all visual specifications match Figma',
        'Test Type': 'UI',
        'Pre-Condition': 'Component rendered',
        'Test Steps': `• Open Figma design file\n• Compare colors, typography, spacing\n• Use DevTools to inspect CSS\n• Verify all elements position and size\n• Reference grid and breakpoints`,
        'Test Data': 'Figma file URL from ticket',
        'Expected Result': 'Component implementation matches Figma design specification',
        'Status': ''
      });

      testCases.push({
        TC_ID: tcId++,
        'Test Scenario': 'Verify component configuration options work correctly',
        'Test Type': 'Functional',
        'Pre-Condition': 'Component added to page',
        'Test Steps': `• Log in to AEM Author\n• Open component dialog\n• Test each configuration option\n• Verify all inputs save correctly\n• Preview changes reflect on page`,
        'Test Data': 'All valid configuration combinations',
        'Expected Result': 'All configuration options function correctly and apply properly',
        'Status': ''
      });

      testCases.push({
        TC_ID: tcId++,
        'Test Scenario': 'Verify no JavaScript console errors',
        'Test Type': 'Regression',
        'Pre-Condition': 'Component on published page',
        'Test Steps': `• Open published page\n• Open DevTools (F12)\n• Go to Console tab\n• Interact with component\n• Scroll and perform actions`,
        'Test Data': 'N/A',
        'Expected Result': 'No JavaScript errors or warnings in console',
        'Status': ''
      });
    }

    return testCases;
  }

  async createExcelFile(testCases, ticketKey, summary, functionalities) {
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
    worksheet.getCell('A1').value = 'Test ID';
    worksheet.getCell('B1').value = ticketKey;
    worksheet.getCell('A2').value = 'Test Name';
    worksheet.getCell('B2').value = summary;
    worksheet.getCell('A3').value = 'Functionalities Tested';
    worksheet.getCell('B3').value = functionalities.length > 0 ? functionalities.join(' | ') : 'N/A';
    worksheet.getCell('A4').value = 'Total Test Cases';
    worksheet.getCell('B4').value = testCases.length;

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
      'B': 28,
      'C': 14,
      'D': 22,
      'E': 38,
      'F': 16,
      'G': 32,
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
      console.log(`\nFetching JIRA ticket: ${ticketKey}`);
      const ticket = await this.fetchTicket(ticketKey);
      const fields = ticket.fields || {};
      const summary = fields.summary || 'No Summary';
      const description = this.extractText(fields.description) || '';

      console.log(`Summary: ${summary}`);
      console.log('Extracting functionalities from description...');

      // Extract functionalities from the description
      const functionalities = this.extractFunctionalities(description);
      console.log(`Found ${functionalities.length} functionalities`);

      if (functionalities.length > 0) {
        functionalities.forEach((func, idx) => {
          console.log(`  ${idx + 1}. ${func.substring(0, 70)}...`);
        });
      }

      // Generate test cases based on extracted functionalities
      const testCases = this.generateDynamicTestCases(ticketKey, description, functionalities);
      console.log(`Generated ${testCases.length} test cases`);

      // Create Excel file
      const filepath = await this.createExcelFile(testCases, ticketKey, summary, functionalities);
      console.log(`✓ Excel file created: ${path.basename(filepath)}`);

      return { filepath, testCaseCount: testCases.length, functionalities };
    } catch (error) {
      console.error(`✗ Error processing ${ticketKey}:`, error.message);
      throw error;
    }
  }
}

// Main entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node generate_focused_testcases.js <TICKET_KEY> [TICKET_KEY_2] ...');
  console.log('Example: node generate_focused_testcases.js GAAM-744');
  process.exit(1);
}

const ticketKeys = args.map(key => key.toUpperCase());
const generator = new DynamicFocusedTestCaseGenerator();

console.log(`\n${'='.repeat(70)}`);
console.log(`Generating FOCUSED test cases for ${ticketKeys.length} ticket(s)`);
console.log(`${'='.repeat(70)}`);

(async () => {
  const results = [];

  for (let i = 0; i < ticketKeys.length; i++) {
    const ticketKey = ticketKeys[i];
    try {
      console.log(`\n[${i + 1}/${ticketKeys.length}] Processing: ${ticketKey}`);
      const result = await generator.generate(ticketKey);
      results.push({ ticketKey, status: '✓ Success', ...result });
    } catch (error) {
      results.push({ ticketKey, status: '✗ Failed', error: error.message });
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(70)}`);
  results.forEach(r => {
    const status = r.status.includes('Success') ? '✓' : '✗';
    const details = r.status.includes('Success')
      ? `${r.testCaseCount} test cases`
      : r.error;
    console.log(`${status} ${r.ticketKey}: ${details}`);
  });
  console.log(`${'='.repeat(70)}\n`);
})();
