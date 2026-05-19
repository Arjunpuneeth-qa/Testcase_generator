#!/usr/bin/env node

/**
 * /testcase Skill Handler for Claude Code
 * Integrates V4 intelligent test case generator as a custom Claude Code skill
 *
 * Usage in Claude Code:
 * /testcase GAAM-933
 * /testcase GAAM-933 GAAM-934 GAAM-935
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { spawn } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  jiraUrl: 'https://bounteous.jira.com',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  httpTimeout: 10000
};

const EXCEL_CONFIG = {
  headerFill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } },
  headerFont: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
  border: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  },
  columnWidths: { 'A': 15, 'B': 25, 'C': 15, 'D': 20, 'E': 25, 'F': 18, 'G': 25, 'H': 20, 'I': 12 },
  headers: ['TC_ID', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Brief Description', 'Status']
};

// ============================================================================
// LOGGER
// ============================================================================

class Logger {
  static info(msg) { console.log(`[INFO] ${msg}`); }
  static success(msg) { console.log(`✓ ${msg}`); }
  static error(msg) { console.error(`✗ ${msg}`); }
  static section(title) { console.log(`\n${'='.repeat(70)}\n${title}\n${'='.repeat(70)}\n`); }
}

// ============================================================================
// VALIDATOR
// ============================================================================

class ConfigValidator {
  static validate() {
    const errors = [];
    if (!CONFIG.email) errors.push('JIRA_EMAIL not set');
    if (!CONFIG.apiToken) errors.push('JIRA_API_TOKEN not set');
    if (errors.length > 0) {
      Logger.error('Configuration validation failed:');
      errors.forEach(e => Logger.error(`  - ${e}`));
      return false;
    }
    Logger.success('Configuration validated');
    return true;
  }
}

// ============================================================================
// JIRA CLIENT
// ============================================================================

class JiraClient {
  async fetchTicket(ticketKey) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${CONFIG.email}:${CONFIG.apiToken}`).toString('base64');
      const options = {
        hostname: 'bounteous.jira.com',
        path: `/rest/api/2/issue/${ticketKey}`,
        method: 'GET',
        rejectUnauthorized: false,
        timeout: CONFIG.httpTimeout,
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
              reject(new Error(`Failed to parse JIRA response: ${e.message}`));
            }
          } else {
            reject(new Error(`JIRA API error (HTTP ${res.statusCode}): ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`JIRA API request timeout`));
      });

      req.end();
    });
  }
}

// ============================================================================
// TEXT EXTRACTION
// ============================================================================

class TextExtractor {
  static extractText(obj) {
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
}

// ============================================================================
// TEST CASE GENERATOR
// ============================================================================

class TestCaseGenerator {
  generateBasicTests(summary, description, tcCounter) {
    const testCases = [];

    // Positive Test
    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': `Positive - ${summary}`,
      'Test Type': 'Functional - Positive',
      'Pre-Condition': 'Application is properly configured; User has required permissions',
      'Test Steps': '• Navigate to the feature\n• Verify all UI elements display correctly\n• Perform primary action with valid data\n• Verify successful completion and expected result',
      'Test Data': 'Valid data as per requirements',
      'Expected Result': 'Feature works as designed; All requirements met; No errors',
      'Brief Description': 'Test the feature with valid inputs following happy path',
      'Status': ''
    });

    // Negative Test
    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': `Negative - Invalid Input for ${summary}`,
      'Test Type': 'Functional - Negative',
      'Pre-Condition': 'Feature is accessible; Validation is enabled',
      'Test Steps': '• Navigate to the feature\n• Try submitting with invalid/empty required fields\n• Verify error message appears\n• Verify data is NOT saved',
      'Test Data': 'Invalid inputs; Missing required fields; Wrong data format',
      'Expected Result': 'Appropriate error messages displayed; No data saved',
      'Brief Description': 'Verify feature rejects invalid inputs',
      'Status': ''
    });

    // Edge Case Test
    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': `Edge Case - Boundary Values for ${summary}`,
      'Test Type': 'Boundary - Edge Case',
      'Pre-Condition': 'Feature is loaded; Boundary conditions are applicable',
      'Test Steps': '• Test with maximum input length\n• Test with minimum input (0, null, empty)\n• Test with special characters (@, #, $, %, &, <, >)\n• Verify system handles gracefully',
      'Test Data': 'Boundary values; Maximum/Minimum limits; Special characters',
      'Expected Result': 'System handles boundary conditions gracefully; No crashes',
      'Brief Description': 'Test edge cases and boundary conditions',
      'Status': ''
    });

    // Security Test
    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': `Security - Unauthorized Access to ${summary}`,
      'Test Type': 'Security - Negative',
      'Pre-Condition': 'User without required permissions exists',
      'Test Steps': '• Attempt to access feature without authentication\n• Attempt to access with expired session\n• Try to bypass authorization checks\n• Access with user having no permissions\n• Verify access is denied',
      'Test Data': 'User with minimal/no permissions; Invalid credentials',
      'Expected Result': 'Access denied; No unauthorized data exposed; Security policies enforced',
      'Brief Description': 'Verify unauthorized users cannot access restricted features',
      'Status': ''
    });

    // Performance Test
    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': `Performance - Load Test for ${summary}`,
      'Test Type': 'Performance - Non-Functional',
      'Pre-Condition': 'System is configured; Load testing tools available',
      'Test Steps': '• Load the feature with normal data volume\n• Execute action with large dataset (1000+ records)\n• Simulate 50+ concurrent users\n• Monitor response times\n• Verify UI remains responsive',
      'Test Data': 'Large dataset; Multiple simultaneous requests',
      'Expected Result': 'Response time acceptable; No timeout errors; System stable',
      'Brief Description': 'Test feature performance under load',
      'Status': ''
    });

    // Error Handling Test
    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': `Error Handling & Recovery for ${summary}`,
      'Test Type': 'Functional - Error Handling',
      'Pre-Condition': 'System is operational; Error scenarios can be simulated',
      'Test Steps': '• Simulate database connection failure\n• Simulate network timeout during operation\n• Trigger server error (500, 503)\n• Verify graceful error message\n• Verify system state is consistent',
      'Test Data': 'Database failure; Network timeout; Server errors',
      'Expected Result': 'Graceful error handling; User-friendly messages; Data consistency maintained',
      'Brief Description': 'Verify error handling and recovery',
      'Status': ''
    });

    return { testCases, counter: tcCounter };
  }
}

// ============================================================================
// EXCEL GENERATOR
// ============================================================================

class ExcelGenerator {
  static async generate(testCases, ticketKey, summary, outputDir) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');

    // Title row
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Test ID: ${ticketKey}   |   Test Name: ${summary}   |   Tested URL: Dev / DR Environment`;
    titleCell.font = { bold: true, size: 11 };
    titleCell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
    worksheet.getRow(1).height = 25;

    // Headers
    EXCEL_CONFIG.headers.forEach((header, idx) => {
      const cell = worksheet.getCell(2, idx + 1);
      cell.value = header;
      cell.fill = EXCEL_CONFIG.headerFill;
      cell.font = EXCEL_CONFIG.headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
      cell.border = EXCEL_CONFIG.border;
    });
    worksheet.getRow(2).height = 25;

    // Data rows
    testCases.forEach((testCase, rowIdx) => {
      const rowNum = rowIdx + 3;
      EXCEL_CONFIG.headers.forEach((header, colIdx) => {
        const cell = worksheet.getCell(rowNum, colIdx + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = EXCEL_CONFIG.border;
      });
      worksheet.getRow(rowNum).height = 70;
    });

    // Column widths
    Object.keys(EXCEL_CONFIG.columnWidths).forEach(col => {
      worksheet.getColumn(col).width = EXCEL_CONFIG.columnWidths[col];
    });

    // Save file
    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_${safeFileName}.xlsx`;
    const filepath = path.join(outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }
}

// ============================================================================
// MAIN SKILL HANDLER
// ============================================================================

class TestcaseSkill {
  constructor() {
    this.outputDir = path.join(__dirname, 'GA_testcases');
    this.jiraClient = new JiraClient();
    this.testGenerator = new TestCaseGenerator();
    this._ensureOutputDir();
  }

  _ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateForTicket(ticketKey) {
    try {
      Logger.info(`Fetching ticket: ${ticketKey}...`);
      const ticket = await this.jiraClient.fetchTicket(ticketKey);
      Logger.success(`Ticket fetched: ${ticketKey}`);

      const fields = ticket.fields || {};
      const summary = fields.summary || 'No Summary';
      const description = TextExtractor.extractText(fields.description) || '';

      Logger.info('Generating test cases...');
      const { testCases, counter } = this.testGenerator.generateBasicTests(summary, description, 1);

      // Add ticket key prefix
      testCases.forEach(tc => {
        tc.TC_ID = `${ticketKey}_${tc.TC_ID}`;
      });

      Logger.info('Creating Excel file...');
      const filepath = await ExcelGenerator.generate(testCases, ticketKey, summary, this.outputDir);
      Logger.success(`Excel file created: ${path.basename(filepath)}`);

      return {
        success: true,
        ticketKey,
        summary,
        testCaseCount: testCases.length,
        filepath,
        message: `Generated ${testCases.length} test cases for ${ticketKey}`
      };
    } catch (error) {
      return {
        success: false,
        ticketKey,
        error: error.message
      };
    }
  }

  async handle(ticketKeys) {
    Logger.section(`TESTCASE SKILL - INTELLIGENT TEST CASE GENERATOR`);

    // Validate configuration
    if (!ConfigValidator.validate()) {
      process.exit(1);
    }

    Logger.info(`Processing ${ticketKeys.length} ticket(s)...`);
    const results = [];

    for (let i = 0; i < ticketKeys.length; i++) {
      const ticketKey = ticketKeys[i];
      Logger.info(`\n[${i + 1}/${ticketKeys.length}] Processing: ${ticketKey}`);
      const result = await this.generateForTicket(ticketKey);
      results.push(result);

      if (result.success) {
        Logger.success(`${ticketKey} - ${result.message}`);
      } else {
        Logger.error(`${ticketKey} - ${result.error}`);
      }
    }

    // Summary
    Logger.section('SKILL EXECUTION SUMMARY');

    results.forEach((result, idx) => {
      const status = result.success ? '✓ Success' : '✗ Failed';
      console.log(`${idx + 1}. ${result.ticketKey}: ${status}`);

      if (result.success) {
        console.log(`   Summary: ${result.summary}`);
        console.log(`   Test Cases: ${result.testCaseCount}`);
        console.log(`   Output: ${path.basename(result.filepath)}`);
        console.log(`   Path: ${result.filepath}`);
      } else {
        console.log(`   Error: ${result.error}`);
      }
    });

    const successCount = results.filter(r => r.success).length;
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✓ Total: ${successCount}/${ticketKeys.length} test case(s) generated successfully`);
    console.log(`📁 Output Directory: ${this.outputDir}`);
    console.log(`${'='.repeat(70)}\n`);

    // Return results as JSON for Claude Code integration
    console.log('=== SKILL RESULTS ===');
    console.log(JSON.stringify({
      status: successCount === ticketKeys.length ? 'success' : 'partial',
      generated: successCount,
      total: ticketKeys.length,
      results: results,
      outputDir: this.outputDir
    }, null, 2));

    process.exit(successCount === ticketKeys.length ? 0 : 1);
  }
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: /testcase TICKET_KEY [TICKET_KEY_2] [...]');
    console.log('\nExamples:');
    console.log('  /testcase GAAM-933');
    console.log('  /testcase GAAM-933 GAAM-934 GAAM-935');
    console.log('\nOr direct command:');
    console.log('  node testcase-skill.js GAAM-933');
    process.exit(1);
  }

  const ticketKeys = args.map(key => key.toUpperCase());
  const skill = new TestcaseSkill();

  await skill.handle(ticketKeys);
}

// Execute
main().catch(error => {
  Logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
