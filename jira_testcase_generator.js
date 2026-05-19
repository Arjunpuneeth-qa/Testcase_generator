#!/usr/bin/env node

/**
 * JIRA Test Case Generator Agent
 * Generates comprehensive test cases from JIRA tickets in Excel format
 * Format matches: DR_AEM_BE_AWS_API_TestCases.xlsx
 * Usage: node jira_testcase_generator.js TICKET_KEY [TICKET_KEY_2] [...]
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONFIG = {
  jiraUrl: 'https://bounteous.jira.com',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  apiVersion: '2',
  httpTimeout: 10000
};

const EXCEL_CONFIG = {
  headerFill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF366092' }
  },
  headerFont: {
    bold: true,
    color: { argb: 'FFFFFFFF' },
    size: 12
  },
  border: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  },
  columnWidths: {
    'A': 15,  // TC_ID
    'B': 25,  // Test Scenario
    'C': 15,  // Test Type
    'D': 20,  // Pre-Condition
    'E': 25,  // Test Steps
    'F': 18,  // Test Data
    'G': 25,  // Expected Result
    'H': 20,  // Brief Description
    'I': 12   // Status
  },
  headers: ['TC_ID', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Brief Description', 'Status'],
  rowHeight: 70,
  headerRowHeight: 25,
  titleRowHeight: 25
};

const COMPLEXITY_WEIGHTS = {
  typeScores: {
    'Epic': 35,
    'Story': 25,
    'Feature': 25,
    'Task': 15,
    'Bug': 10,
    'Sub-task': 8
  },
  priorityScores: {
    'Highest': 8,
    'High': 6,
    'Medium': 3,
    'Low': 1
  },
  descriptionLengthFactor: 100,
  maxComplexity: 100
};

const TEST_CASE_THRESHOLDS = [
  { complexity: 90, count: 100 },
  { complexity: 85, count: 90 },
  { complexity: 80, count: 80 },
  { complexity: 75, count: 70 },
  { complexity: 70, count: 60 },
  { complexity: 65, count: 50 },
  { complexity: 60, count: 45 },
  { complexity: 55, count: 40 },
  { complexity: 50, count: 35 },
  { complexity: 45, count: 30 },
  { complexity: 40, count: 25 },
  { complexity: 35, count: 20 },
  { complexity: 30, count: 15 },
  { complexity: 20, count: 12 },
  { complexity: 0, count: 10 }
];

const COMPLEXITY_KEYWORDS = [
  'integration', 'api', 'database', 'performance', 'security', 'authentication',
  'authorization', 'encryption', 'concurrent', 'scalability', 'migration',
  'complex', 'refactor', 'optimization', 'third-party', 'external service',
  'workflow', 'pipeline', 'cross-system', 'multi-step', 'critical'
];

// ============================================================================
// UTILITY CLASSES & FUNCTIONS
// ============================================================================

class Logger {
  static info(message) {
    console.log(`[INFO] ${message}`);
  }

  static success(message) {
    console.log(`✓ ${message}`);
  }

  static error(message) {
    console.error(`✗ ${message}`);
  }

  static section(title) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(title);
    console.log('='.repeat(70));
  }
}

class ConfigValidator {
  static validate() {
    const errors = [];

    if (!CONFIG.email) {
      errors.push('JIRA_EMAIL environment variable is not set');
    }
    if (!CONFIG.apiToken) {
      errors.push('JIRA_API_TOKEN environment variable is not set');
    }

    if (errors.length > 0) {
      Logger.error('Configuration Validation Failed:');
      errors.forEach(err => Logger.error(`  - ${err}`));
      process.exit(1);
    }

    Logger.success('Configuration validated');
  }
}

// ============================================================================
// JIRA API CLIENT
// ============================================================================

class JiraClient {
  constructor(config = CONFIG) {
    this.config = config;
    this.baseUrl = new URL('/rest/api/2', config.jiraUrl);
  }

  /**
   * Fetch JIRA ticket via REST API
   * @param {string} ticketKey - JIRA ticket key (e.g., GAAM-618)
   * @returns {Promise<Object>} - Ticket data
   */
  async fetchTicket(ticketKey) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64');

      const options = {
        hostname: this.baseUrl.hostname,
        path: `/rest/api/2/issue/${ticketKey}`,
        method: 'GET',
        rejectUnauthorized: false,
        timeout: this.config.httpTimeout,
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
        reject(new Error(`JIRA API request timeout after ${this.config.httpTimeout}ms`));
      });

      req.end();
    });
  }
}

// ============================================================================
// TEXT EXTRACTION & PARSING
// ============================================================================

class TextExtractor {
  /**
   * Extract plain text from JIRA document format
   * @param {*} obj - Object to extract from (can be string, doc, paragraph, etc.)
   * @returns {string} - Extracted text
   */
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

  /**
   * Parse test steps from description
   * @param {string} description - Raw description text
   * @returns {string} - Formatted steps
   */
  static parseSteps(description) {
    if (!description) {
      return '1. Verify requirements\n2. Execute test scenario';
    }

    const lines = description.split('\n');
    const steps = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && (
        /^\d/.test(trimmed) ||
        trimmed.startsWith('-') ||
        trimmed.startsWith('*')
      );
    });

    if (steps.length > 0) {
      return steps.slice(0, 15).join('\n');
    }

    return '1. Follow ticket requirements\n2. Validate results';
  }
}

// ============================================================================
// COMPLEXITY ANALYSIS
// ============================================================================

class ComplexityAnalyzer {
  /**
   * Calculate complexity score based on ticket analysis
   * @param {Object} ticket - JIRA ticket object
   * @returns {number} - Complexity score (0-100)
   */
  static calculate(ticket) {
    const fields = ticket.fields || {};
    const description = TextExtractor.extractText(fields.description) || '';
    const summary = fields.summary || '';
    const ticketType = fields.issuetype?.name || 'Task';
    const priority = fields.priority?.name || 'Medium';

    let score = 0;

    // Base score by ticket type
    score += COMPLEXITY_WEIGHTS.typeScores[ticketType] || 15;

    // Add points for description length
    score += Math.min(
      Math.floor(description.length / COMPLEXITY_WEIGHTS.descriptionLengthFactor),
      10
    );

    // Add points for complexity keywords
    const descLower = (description + summary).toLowerCase();
    COMPLEXITY_KEYWORDS.forEach(keyword => {
      if (descLower.includes(keyword)) score += 3;
    });

    // Add points for priority
    score += COMPLEXITY_WEIGHTS.priorityScores[priority] || 3;

    // Add points for components
    if (fields.components && fields.components.length > 1) {
      score += fields.components.length * 2;
    }

    return Math.min(score, COMPLEXITY_WEIGHTS.maxComplexity);
  }

  /**
   * Determine number of test cases based on complexity
   * @param {number} complexity - Complexity score
   * @returns {number} - Number of test cases to generate
   */
  static determineTestCaseCount(complexity) {
    for (const threshold of TEST_CASE_THRESHOLDS) {
      if (complexity >= threshold.complexity) {
        return threshold.count;
      }
    }
    return 10;
  }
}

// ============================================================================
// TEST CASE TEMPLATES & GENERATORS
// ============================================================================

const TEST_STEP_TEMPLATES = {
  positive: () => `1. Open the application and navigate to the feature
2. Verify UI elements are displayed correctly
3. Enter valid data as per specification
4. Execute the feature/action
5. Verify successful completion with all requirements met
6. Check for any warnings or errors`,

  negative: () => `1. Open the feature/form
2. Try submitting with empty/missing required fields
3. Enter invalid data (wrong format, wrong type)
4. Attempt to proceed without completing mandatory fields
5. Verify error messages are displayed
6. Verify data is NOT saved
7. Verify user is prevented from proceeding with invalid data`,

  edgeCase: () => `1. Test with maximum allowed input length
2. Test with minimum allowed input (0, empty, null)
3. Test with special characters (@, #, $, %, &, <, >)
4. Test with very large numbers or datasets
5. Test with SQL injection payloads
6. Test with whitespace-only input
7. Verify system handles all edge cases without crashing`,

  security: () => `1. Attempt to access feature without authentication
2. Attempt to access feature with expired session
3. Attempt to bypass authorization checks
4. Try to access with user having no permissions
5. Attempt cross-origin requests (CORS)
6. Try to manipulate URL parameters for unauthorized access
7. Verify access is denied; Verify security logs are recorded`,

  performance: () => `1. Load the feature with normal data volume
2. Execute action with large dataset (1000+ records)
3. Simulate 50+ concurrent users
4. Monitor response times and resource usage
5. Check for memory leaks during extended usage
6. Verify UI remains responsive
7. Confirm no data loss under load`,

  errorHandling: () => `1. Simulate database connection failure
2. Simulate network timeout during operation
3. Trigger server error (500, 503, 504)
4. Interrupt operation mid-execution
5. Verify graceful error message is shown
6. Verify system state is consistent after error
7. Verify automatic retry mechanism (if applicable)
8. Check error logs are properly recorded`,

  dataIntegrity: () => `1. Perform create operation and verify data persistence
2. Perform update operation and verify changes are saved
3. Perform delete operation and verify data is removed
4. Test cascading updates/deletes
5. Verify referential integrity constraints
6. Test concurrent data modifications
7. Verify audit logs record all changes
8. Rollback transaction and verify data consistency`,

  integration: () => `1. Test API integration with real endpoints
2. Test third-party service connectivity
3. Verify data transformation between systems
4. Test error handling when external service fails
5. Test retry logic for failed integrations
6. Verify proper logging of integration events
7. Test timeout handling for slow services
8. Verify security between integrated systems`,

  uiResponsive: () => `1. Test on iPhone 12/13/14 (375px width)
2. Test on iPad (768px width)
3. Test on Desktop (1920px width)
4. Test landscape and portrait modes
5. Verify layout doesn't break at any breakpoint
6. Check text readability on all sizes
7. Verify images scale properly
8. Test touch interactions on mobile`,

  uiAccessibility: () => `1. Test with screen reader (NVDA/JAWS)
2. Verify all buttons have text labels or ARIA labels
3. Verify form inputs have associated labels
4. Verify color is not the only indicator (also use text/icons)
5. Test keyboard navigation (Tab order)
6. Verify focus indicator is visible
7. Check color contrast with contrast checker
8. Verify images have alt text`
};

const CORE_TEST_CASES = [
  {
    type: 'POSITIVE',
    name: 'Positive - Happy Path',
    testType: 'Functional - Positive',
    preCondition: 'Application is properly configured with valid setup; User has required permissions',
    steps: TEST_STEP_TEMPLATES.positive(),
    testData: 'Valid data as per specification; All required fields filled correctly',
    expected: 'Feature works as designed; All requirements met; No errors',
    brief: 'Test the feature with valid inputs following the happy path'
  },
  {
    type: 'NEGATIVE_INPUT',
    name: 'Negative - Invalid/Missing Input',
    testType: 'Functional - Negative',
    preCondition: 'Application is in ready state; Form or input fields are accessible',
    steps: TEST_STEP_TEMPLATES.negative(),
    testData: 'Invalid inputs; Missing required fields; Wrong data format; Null/Empty values',
    expected: 'Appropriate error messages displayed; Input validation triggered; No data saved',
    brief: 'Verify feature rejects invalid inputs and shows appropriate error messages'
  },
  {
    type: 'EDGE_CASE',
    name: 'Edge Case - Boundary/Limit Conditions',
    testType: 'Functional - Edge Case',
    preCondition: 'Application loaded; Edge case conditions are applicable',
    steps: TEST_STEP_TEMPLATES.edgeCase(),
    testData: 'Boundary values; Maximum/Minimum limits; Special characters; SQL injection attempts',
    expected: 'System handles boundary conditions gracefully; No crashes; Data integrity maintained',
    brief: 'Test feature with edge cases like boundary values and special characters'
  },
  {
    type: 'SECURITY',
    name: 'Security - Unauthorized Access/Permissions',
    testType: 'Security - Negative',
    preCondition: 'User without required permissions is logged in; Feature is available',
    steps: TEST_STEP_TEMPLATES.security(),
    testData: 'User with minimal/no permissions; Invalid credentials; Expired session',
    expected: 'Access denied; No unauthorized data exposed; Security policies enforced',
    brief: 'Verify unauthorized users cannot access restricted features'
  },
  {
    type: 'PERFORMANCE',
    name: 'Performance - Load & Concurrency',
    testType: 'Performance - Non-Functional',
    preCondition: 'System is under load; Multiple concurrent users/requests enabled',
    steps: TEST_STEP_TEMPLATES.performance(),
    testData: 'Large dataset; Multiple simultaneous requests; Peak load conditions',
    expected: 'Response time acceptable; No timeout errors; System remains stable',
    brief: 'Test feature performance under load with multiple concurrent users'
  },
  {
    type: 'ERROR_HANDLING',
    name: 'Error Handling & Recovery',
    testType: 'Functional - Error Handling',
    preCondition: 'System is operational; Error scenarios can be simulated',
    steps: TEST_STEP_TEMPLATES.errorHandling(),
    testData: 'Database connection failure; Network timeout; Server errors (500, 503)',
    expected: 'Graceful error handling; User-friendly messages; Data consistency maintained',
    brief: 'Verify feature handles errors gracefully and recovers properly'
  }
];

const ADDITIONAL_TEST_CASES = [
  {
    type: 'DATA_INTEGRITY',
    name: 'Data Integrity - Consistency & Validation',
    testType: 'Functional - Data Integrity',
    preCondition: 'Database is accessible; Audit logging is enabled',
    steps: TEST_STEP_TEMPLATES.dataIntegrity(),
    testData: 'Create, update, delete operations; Duplicate data; Large data objects',
    expected: 'Data integrity maintained; No data loss; Referential integrity preserved',
    brief: 'Verify data is saved correctly and consistently across all operations'
  },
  {
    type: 'INTEGRATION',
    name: 'Integration - System Integration',
    testType: 'Integration - Functional',
    preCondition: 'All dependent systems operational; API endpoints accessible',
    steps: TEST_STEP_TEMPLATES.integration(),
    testData: 'Valid API requests; Third-party service responses; Integration payloads',
    expected: 'Integrations work seamlessly; Data flows correctly; Proper error handling',
    brief: 'Verify feature integrates correctly with external systems and APIs'
  },
  {
    type: 'UI_RESPONSIVE',
    name: 'UI - Responsive Design (Mobile)',
    testType: 'UI - Responsive Design',
    preCondition: 'Application loaded on mobile devices; Various screen sizes available',
    steps: TEST_STEP_TEMPLATES.uiResponsive(),
    testData: 'Mobile devices (iPhone, Android); Tablet sizes; Portrait/Landscape modes',
    expected: 'Layout adjusts properly; All elements visible; No overflow; Touch-friendly',
    brief: 'Verify UI is responsive and functional on mobile devices'
  },
  {
    type: 'UI_ACCESSIBILITY',
    name: 'UI - Accessibility & WCAG',
    testType: 'UI - Accessibility',
    preCondition: 'Accessibility checker available; Screen reader installed',
    steps: TEST_STEP_TEMPLATES.uiAccessibility(),
    testData: 'Screen reader; Keyboard navigation; Color contrast; ARIA labels; Focus indicators',
    expected: 'WCAG 2.1 AA compliant; Screen reader compatible; Keyboard accessible',
    brief: 'Ensure UI meets accessibility standards and works with assistive technologies'
  }
];

// ============================================================================
// TEST CASE BUILDER
// ============================================================================

class TestCaseBuilder {
  /**
   * Build test cases from JIRA ticket
   * @param {Object} ticket - JIRA ticket object
   * @returns {Object} - Test cases and metadata
   */
  static build(ticket) {
    const fields = ticket.fields || {};
    const ticketKey = ticket.key || 'UNKNOWN';
    const summary = fields.summary || 'No Summary';
    const description = TextExtractor.extractText(fields.description) || '';

    const complexity = ComplexityAnalyzer.calculate(ticket);
    const testCaseCount = ComplexityAnalyzer.determineTestCaseCount(complexity);

    const testCases = [];
    let tcCounter = 1;

    // Add core test cases
    CORE_TEST_CASES.forEach(test => {
      if (tcCounter <= testCaseCount) {
        testCases.push(this._createTestCase(ticketKey, summary, test, tcCounter++));
      }
    });

    // Add additional test cases
    ADDITIONAL_TEST_CASES.forEach(test => {
      if (tcCounter <= testCaseCount) {
        testCases.push(this._createTestCase(ticketKey, summary, test, tcCounter++));
      }
    });

    return { testCases, ticketKey, summary, complexity, testCaseCount };
  }

  static _createTestCase(ticketKey, summary, template, counter) {
    return {
      TC_ID: `${ticketKey}_TC_${String(counter).padStart(3, '0')}`,
      'Test Scenario': `[${template.type}] ${summary} - ${template.name}`,
      'Test Type': template.testType,
      'Pre-Condition': template.preCondition,
      'Test Steps': template.steps,
      'Test Data': template.testData,
      'Expected Result': template.expected,
      'Brief Description': template.brief,
      'Status': ''
    };
  }
}

// ============================================================================
// EXCEL FILE GENERATOR
// ============================================================================

class ExcelGenerator {
  /**
   * Create Excel file with test cases
   * @param {Array} testCases - Array of test case objects
   * @param {string} ticketKey - JIRA ticket key
   * @param {string} summary - Ticket summary
   * @param {string} outputDir - Output directory path
   * @returns {Promise<string>} - Path to created file
   */
  static async generate(testCases, ticketKey, summary, outputDir) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');

    this._addTitleRow(worksheet, ticketKey, summary);
    this._addHeaderRow(worksheet);
    this._addDataRows(worksheet, testCases);
    this._setColumnWidths(worksheet);

    const filepath = this._getSafeFilePath(ticketKey, summary, outputDir);
    await workbook.xlsx.writeFile(filepath);

    return filepath;
  }

  static _addTitleRow(worksheet, ticketKey, summary) {
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Test ID: ${ticketKey}   |   Test Name: ${summary}   |   Tested URL: Dev / DR Environment`;
    titleCell.font = { bold: true, size: 11 };
    titleCell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
    worksheet.getRow(1).height = EXCEL_CONFIG.titleRowHeight;
  }

  static _addHeaderRow(worksheet) {
    EXCEL_CONFIG.headers.forEach((header, index) => {
      const cell = worksheet.getCell(2, index + 1);
      cell.value = header;
      cell.fill = EXCEL_CONFIG.headerFill;
      cell.font = EXCEL_CONFIG.headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
      cell.border = EXCEL_CONFIG.border;
    });
    worksheet.getRow(2).height = EXCEL_CONFIG.headerRowHeight;
  }

  static _addDataRows(worksheet, testCases) {
    testCases.forEach((testCase, rowIndex) => {
      const rowNum = rowIndex + 3;
      EXCEL_CONFIG.headers.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNum, colIndex + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = EXCEL_CONFIG.border;
      });
      worksheet.getRow(rowNum).height = EXCEL_CONFIG.rowHeight;
    });
  }

  static _setColumnWidths(worksheet) {
    Object.keys(EXCEL_CONFIG.columnWidths).forEach(col => {
      worksheet.getColumn(col).width = EXCEL_CONFIG.columnWidths[col];
    });
  }

  static _getSafeFilePath(ticketKey, summary, outputDir) {
    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_${safeFileName}.xlsx`;
    return path.join(outputDir, filename);
  }
}

// ============================================================================
// MAIN GENERATOR CLASS
// ============================================================================

class JiraTestCaseGenerator {
  constructor(outputDir = path.join(__dirname, 'GA_testcases')) {
    this.outputDir = outputDir;
    this.jiraClient = new JiraClient();
    this._ensureOutputDir();
  }

  _ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate test cases for a ticket
   * @param {string} ticketKey - JIRA ticket key
   * @returns {Promise<Object>} - Generation result
   */
  async generate(ticketKey) {
    try {
      const ticket = await this.jiraClient.fetchTicket(ticketKey);
      const { testCases, summary, complexity, testCaseCount } = TestCaseBuilder.build(ticket);
      const filepath = await ExcelGenerator.generate(testCases, ticketKey, summary, this.outputDir);

      return {
        success: true,
        ticketKey,
        summary,
        complexity,
        testCaseCount,
        filepath,
        testCaseCount: testCases.length
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
    console.log('Usage: node jira_testcase_generator.js <TICKET_KEY_1> [TICKET_KEY_2] [...]');
    console.log('\nExamples:');
    console.log('  node jira_testcase_generator.js GAAM-618');
    console.log('  node jira_testcase_generator.js GAAM-618 GAAM-619 GAAM-620');
    process.exit(1);
  }

  const ticketKeys = args.map(key => key.toUpperCase());
  const generator = new JiraTestCaseGenerator();

  Logger.section(`Generating test cases for ${ticketKeys.length} ticket(s)`);

  const results = [];

  for (let i = 0; i < ticketKeys.length; i++) {
    const ticketKey = ticketKeys[i];
    Logger.info(`[${i + 1}/${ticketKeys.length}] Processing: ${ticketKey}`);

    const result = await generator.generate(ticketKey);
    results.push(result);

    if (result.success) {
      Logger.success(`${ticketKey} - Generated ${result.testCaseCount} test cases`);
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
      console.log(`   Complexity: ${result.complexity}/100`);
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

// Execute main function
main().catch(error => {
  Logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
