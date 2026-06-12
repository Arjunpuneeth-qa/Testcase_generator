#!/usr/bin/env node

/**
 * JIRA Test Case Generator - ULTIMATE VERSION
 * Combines best features from all 4 versions:
 * - v1: Well-organized architecture & configuration management
 * - v2: Feature-specific test detection (click tracking, links)
 * - v3: Detailed step-by-step instructions with login flows
 * - v4: Intelligent tests based on acceptance criteria analysis
 *
 * Usage: node jira_testcase_generator_ultimate.js TICKET_KEY [...]
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

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

// Feature detection patterns
const FEATURE_PATTERNS = {
  clickTracking: ['click', 'event', 'tracking', 'analytics', 'gtag', 'gtm'],
  linkTests: ['link', 'external', 'url', 'href', 'navigation'],
  formValidation: ['form', 'input', 'validation', 'field', 'submit'],
  authentication: ['login', 'auth', 'permission', 'access', 'saml', 'sso'],
  aemComponent: ['component', 'banner', 'card', 'template', 'aem'],
  responsive: ['mobile', 'responsive', 'tablet', 'breakpoint', 'screen'],
  api: ['api', 'endpoint', 'rest', 'request', 'response', 'json'],
  database: ['database', 'query', 'sql', 'data', 'persistence'],
  accessibility: ['accessibility', 'wcag', 'aria', 'screen reader', 'keyboard']
};

// ============================================================================
// UTILITY CLASSES
// ============================================================================

class Logger {
  static info(msg) { console.log(`[INFO] ${msg}`); }
  static success(msg) { console.log(`✓ ${msg}`); }
  static error(msg) { console.error(`✗ ${msg}`); }
  static section(title) { console.log(`\n${'='.repeat(70)}\n${title}\n${'='.repeat(70)}`); }
}

class ConfigValidator {
  static validate() {
    const errors = [];
    if (!CONFIG.email) errors.push('JIRA_EMAIL not set');
    if (!CONFIG.apiToken) errors.push('JIRA_API_TOKEN not set');
    if (errors.length > 0) {
      Logger.error('Configuration validation failed:');
      errors.forEach(e => Logger.error(`  - ${e}`));
      process.exit(1);
    }
    Logger.success('Configuration validated');
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
// TEXT EXTRACTION & ANALYSIS
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

class FeatureAnalyzer {
  static analyzeTicket(summary, description) {
    const text = `${summary} ${description}`.toLowerCase();
    const detectedFeatures = {};

    Object.keys(FEATURE_PATTERNS).forEach(feature => {
      const patterns = FEATURE_PATTERNS[feature];
      detectedFeatures[feature] = patterns.some(pattern => text.includes(pattern));
    });

    return detectedFeatures;
  }

  static extractAcceptanceCriteria(description) {
    const lines = description.split('\n');
    const criteria = [];
    let isInCriteria = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('acceptance criteria')) {
        isInCriteria = true;
      } else if (isInCriteria && trimmed) {
        if (/^[-*•]|^\d+\./.test(trimmed)) {
          criteria.push(trimmed.replace(/^[-*•]\s*|\d+\.\s*/, ''));
        }
      }
    });

    return criteria.length > 0 ? criteria : null;
  }
}

// ============================================================================
// TEST CASE GENERATORS
// ============================================================================

class TestCaseGenerators {
  // V4: INTELLIGENT TEST CASES (Based on acceptance criteria)
  static generateIntelligentTests(summary, description, tcCounter) {
    const testCases = [];
    const criteria = FeatureAnalyzer.extractAcceptanceCriteria(description);

    if (criteria && criteria.length > 0) {
      criteria.forEach((criterion, idx) => {
        testCases.push({
          TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
          'Test Scenario': `Verify: ${criterion.substring(0, 80)}`,
          'Test Type': 'Functional - Acceptance Criteria',
          'Pre-Condition': 'Application is properly configured; User has required access',
          'Test Steps': `• Open the application\n• Navigate to the feature\n• Perform actions to verify: ${criterion}\n• Validate results match criteria`,
          'Test Data': 'Valid data as per acceptance criteria',
          'Expected Result': criterion,
          'Brief Description': `Acceptance criteria test ${idx + 1}: ${criterion.substring(0, 50)}`,
          'Status': ''
        });
      });
    }

    return { testCases, counter: tcCounter };
  }

  // V3: DETAILED STEP-BY-STEP TESTS (With login flows)
  static generateDetailedStepTests(summary, description, tcCounter) {
    const testCases = [];
    const descLower = description.toLowerCase();

    // AEM Component Tests (detailed steps with AEM Author login)
    if (descLower.includes('component') || descLower.includes('aem')) {
      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component renders on all supported templates',
        'Test Type': 'Functional - Component',
        'Pre-Condition': 'User has access to AEM Author environment',
        'Test Steps': `• Log in to AEM Author with valid credentials\n• Navigate to Pages section\n• Open a page with supported template\n• Locate and add the component\n• Configure component properties\n• Save the page\n• Preview the page in publish mode\n• Verify component renders correctly`,
        'Test Data': 'Valid AEM credentials; Component configuration details',
        'Expected Result': 'Component available in all supported templates and renders without errors',
        'Brief Description': 'Verify component is accessible and renders on all templates',
        'Status': ''
      });

      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component properties are editable in AEM Author',
        'Test Type': 'Functional - Component Properties',
        'Pre-Condition': 'Component is added to a page; User is logged into AEM Author',
        'Test Steps': `• Log in to AEM Author\n• Navigate to page with component\n• Double-click component to open edit dialog\n• Modify component properties (title, description, etc.)\n• Click OK to save changes\n• Verify changes are reflected in page preview\n• Save the page\n• Reload the page and verify persistence`,
        'Test Data': 'Component with modifiable properties; Test values for each property',
        'Expected Result': 'All component properties are editable, changes persist after page reload',
        'Brief Description': 'Verify all component properties can be edited and saved',
        'Status': ''
      });
    }

    return { testCases, counter: tcCounter };
  }

  // V2: FEATURE-SPECIFIC TESTS (Click tracking, links, forms)
  static generateFeatureSpecificTests(summary, description, features, tcCounter) {
    const testCases = [];
    const descLower = description.toLowerCase();

    // Click Tracking Tests
    if (features.clickTracking) {
      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify click events are tracked and logged',
        'Test Type': 'Functional - Analytics',
        'Pre-Condition': 'Analytics tracking is enabled; Browser dev tools are open (Network tab)',
        'Test Steps': `• Open application in browser with dev tools\n• Navigate to feature with click tracking\n• Click on trackable elements\n• Monitor Network tab for tracking calls\n• Verify event name, parameters, and values\n• Check Analytics dashboard for event logs`,
        'Test Data': 'Valid click events with expected parameters',
        'Expected Result': 'All clicks are tracked with correct event names, parameters, and values',
        'Brief Description': 'Verify click tracking events fire correctly',
        'Status': ''
      });

      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify click tracking includes correct user context',
        'Test Type': 'Functional - Analytics Context',
        'Pre-Condition': 'User is logged in; Analytics tracking enabled',
        'Test Steps': `• Log in with valid credentials\n• Open dev tools Network tab\n• Perform tracked actions\n• Inspect tracking call payloads\n• Verify user ID, session ID, and timestamp are included`,
        'Test Data': 'Logged-in user credentials',
        'Expected Result': 'Tracking calls include user context (user ID, session, timestamp)',
        'Brief Description': 'Verify tracking includes correct user context data',
        'Status': ''
      });
    }

    // Link Tests
    if (features.linkTests) {
      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify all links are functional and navigate correctly',
        'Test Type': 'Functional - Navigation',
        'Pre-Condition': 'Application is loaded; All external services are operational',
        'Test Steps': `• Identify all links in the feature\n• Click each link\n• Verify navigation to correct destination\n• Check for 404 errors or timeouts\n• Verify links open in correct target (same/new window)`,
        'Test Data': 'List of all links in the feature',
        'Expected Result': 'All links navigate to correct destinations without errors',
        'Brief Description': 'Verify all links work correctly',
        'Status': ''
      });

      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify external links are secure and have proper referrer policy',
        'Test Type': 'Security - External Links',
        'Pre-Condition': 'External links are present; Security tools available',
        'Test Steps': `• Inspect link elements with dev tools\n• Verify external links have target="_blank"\n• Verify rel="noopener noreferrer" is set\n• Click external links and monitor Network tab\n• Verify referrer policy headers`,
        'Test Data': 'External URLs to test',
        'Expected Result': 'External links have proper security attributes and headers',
        'Brief Description': 'Verify external links have proper security settings',
        'Status': ''
      });
    }

    // Form Validation Tests
    if (features.formValidation) {
      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form validation messages appear for required fields',
        'Test Type': 'Functional - Validation',
        'Pre-Condition': 'Form is loaded; Browser console is open',
        'Test Steps': `• Locate form with required fields\n• Attempt to submit empty form\n• Verify validation error messages appear\n• Check error message text and styling\n• Verify focus moves to first invalid field\n• Fill required fields and re-submit`,
        'Test Data': 'Form with various required field types',
        'Expected Result': 'Clear validation messages appear for empty required fields',
        'Brief Description': 'Verify form validation for required fields',
        'Status': ''
      });
    }

    // Authentication Tests
    if (features.authentication) {
      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify authentication flow with valid credentials',
        'Test Type': 'Functional - Authentication',
        'Pre-Condition': 'Application login page is accessible',
        'Test Steps': `• Navigate to login page\n• Enter valid email/username\n• Enter valid password\n• Click Login button\n• Verify user is authenticated\n• Verify session token/cookie is set\n• Verify user dashboard/home page loads`,
        'Test Data': 'Valid user credentials (email/password)',
        'Expected Result': 'User is successfully authenticated and session is established',
        'Brief Description': 'Verify login with valid credentials',
        'Status': ''
      });

      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify unauthorized access is denied',
        'Test Type': 'Security - Authorization',
        'Pre-Condition': 'User without permissions exists',
        'Test Steps': `• Log in with user lacking permissions\n• Attempt to access restricted feature\n• Verify access is denied\n• Verify error message is displayed\n• Check security logs for access attempt`,
        'Test Data': 'Non-admin user credentials',
        'Expected Result': 'Access is denied with appropriate error message',
        'Brief Description': 'Verify unauthorized access is blocked',
        'Status': ''
      });
    }

    return { testCases, counter: tcCounter };
  }

  // STANDARD TEST CASES (Always included)
  static generateStandardTests(summary, description, tcCounter) {
    const testCases = [];

    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': 'Positive - Happy Path Test',
      'Test Type': 'Functional - Positive',
      'Pre-Condition': 'Application is properly configured; User has required permissions',
      'Test Steps': `• Navigate to the feature\n• Verify all UI elements are displayed\n• Perform primary action with valid data\n• Verify successful completion`,
      'Test Data': 'Valid test data matching specification',
      'Expected Result': 'Feature works as designed; All requirements met',
      'Brief Description': 'Verify feature works with valid input',
      'Status': ''
    });

    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': 'Negative - Invalid Input Test',
      'Test Type': 'Functional - Negative',
      'Pre-Condition': 'Feature is accessible',
      'Test Steps': `• Try submitting with invalid/empty data\n• Verify error message is displayed\n• Verify data is NOT saved`,
      'Test Data': 'Invalid inputs; Missing required fields',
      'Expected Result': 'Error messages displayed; No data saved',
      'Brief Description': 'Verify feature rejects invalid inputs',
      'Status': ''
    });

    testCases.push({
      TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
      'Test Scenario': 'Edge Case - Boundary Conditions',
      'Test Type': 'Functional - Edge Case',
      'Pre-Condition': 'Feature is loaded',
      'Test Steps': `• Test with maximum input length\n• Test with minimum input (0, null, empty)\n• Test with special characters\n• Verify system handles gracefully`,
      'Test Data': 'Boundary values; Special characters',
      'Expected Result': 'System handles edge cases without crashing',
      'Brief Description': 'Verify boundary conditions are handled',
      'Status': ''
    });

    return { testCases, counter: tcCounter };
  }
}

// ============================================================================
// EXCEL GENERATOR
// ============================================================================

class ExcelGenerator {
  static async generate(allTestCases, ticketKey, summary, outputDir) {
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
    allTestCases.forEach((testCase, rowIdx) => {
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
    const filename = `${ticketKey}.xlsx`;
    const filepath = path.join(outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

class JiraTestCaseGeneratorUltimate {
  constructor(outputDir = path.join(__dirname, 'GA_testcases')) {
    this.outputDir = outputDir;
    this.jiraClient = new JiraClient();
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generate(ticketKey) {
    try {
      const ticket = await this.jiraClient.fetchTicket(ticketKey);
      const fields = ticket.fields || {};
      const summary = fields.summary || 'No Summary';
      const description = TextExtractor.extractText(fields.description) || '';

      const allTestCases = [];
      let tcCounter = 1;

      // 1. V4: Intelligent tests based on acceptance criteria
      Logger.info('Analyzing acceptance criteria...');
      const { testCases: intelligentTests, counter: c1 } = TestCaseGenerators.generateIntelligentTests(summary, description, tcCounter);
      allTestCases.push(...intelligentTests);
      tcCounter = c1;

      // 2. V3: Detailed step-by-step tests
      Logger.info('Generating detailed step-by-step tests...');
      const { testCases: detailedTests, counter: c2 } = TestCaseGenerators.generateDetailedStepTests(summary, description, tcCounter);
      allTestCases.push(...detailedTests);
      tcCounter = c2;

      // 3. V2: Feature-specific tests
      Logger.info('Detecting features and generating specific tests...');
      const features = FeatureAnalyzer.analyzeTicket(summary, description);
      const { testCases: featureTests, counter: c3 } = TestCaseGenerators.generateFeatureSpecificTests(summary, description, features, tcCounter);
      allTestCases.push(...featureTests);
      tcCounter = c3;

      // 4. Standard tests
      Logger.info('Generating standard test cases...');
      const { testCases: standardTests, counter: c4 } = TestCaseGenerators.generateStandardTests(summary, description, tcCounter);
      allTestCases.push(...standardTests);
      tcCounter = c4;

      // Add TC_ID prefix
      allTestCases.forEach((tc, idx) => {
        tc.TC_ID = `${ticketKey}_${tc.TC_ID}`;
      });

      // Generate Excel
      const filepath = await ExcelGenerator.generate(allTestCases, ticketKey, summary, this.outputDir);

      return {
        success: true,
        ticketKey,
        summary,
        testCaseCount: allTestCases.length,
        filepath,
        detectedFeatures: features
      };
    } catch (error) {
      return {
        success: false,
        ticketKey,
        error: error.message
      };
    }
  }
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  ConfigValidator.validate();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node jira_testcase_generator_ultimate.js <TICKET_KEY> [TICKET_KEY_2] [...]');
    console.log('\nExamples:');
    console.log('  node jira_testcase_generator_ultimate.js GAAM-933');
    console.log('  node jira_testcase_generator_ultimate.js GAAM-933 GAAM-934 GAAM-935');
    process.exit(1);
  }

  const ticketKeys = args.map(k => k.toUpperCase());
  const generator = new JiraTestCaseGeneratorUltimate();

  Logger.section(`Generating test cases for ${ticketKeys.length} ticket(s) - ULTIMATE VERSION`);

  const results = [];

  for (let i = 0; i < ticketKeys.length; i++) {
    const ticketKey = ticketKeys[i];
    Logger.info(`[${i + 1}/${ticketKeys.length}] Processing: ${ticketKey}`);

    const result = await generator.generate(ticketKey);
    results.push(result);

    if (result.success) {
      Logger.success(`${ticketKey} - Generated ${result.testCaseCount} test cases`);
      console.log(`  Features detected: ${Object.keys(result.detectedFeatures).filter(f => result.detectedFeatures[f]).join(', ')}`);
    } else {
      Logger.error(`${ticketKey} - ${result.error}`);
    }
  }

  Logger.section('GENERATION SUMMARY');

  results.forEach((result, idx) => {
    const status = result.success ? '✓ Success' : '✗ Failed';
    console.log(`${idx + 1}. ${result.ticketKey}: ${status}`);

    if (result.success) {
      console.log(`   Summary: ${result.summary}`);
      console.log(`   Test Cases: ${result.testCaseCount}`);
      console.log(`   Output: ${path.basename(result.filepath)}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Total: ${successCount}/${ticketKeys.length} test case(s) generated successfully`);
  console.log(`Output Directory: ${generator.outputDir}`);
  console.log(`${'='.repeat(70)}\n`);

  process.exit(successCount === ticketKeys.length ? 0 : 1);
}

main().catch(error => {
  Logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
