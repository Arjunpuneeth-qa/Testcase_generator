#!/usr/bin/env node

/**
 * JIRA Test Case Generator Agent
 * Generates test cases from JIRA tickets in Excel format
 * Format matches: DR_AEM_BE_AWS_API_TestCases.xlsx
 * Usage: node jira_testcase_generator.js TICKET_KEY
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Configuration
const CONFIG = {
  jiraUrl: 'https://bounteous.jira.com',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};

class JiraTestCaseGenerator {
  constructor(outputDir = path.join(__dirname, 'GA_testcases')) {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Fetch JIRA ticket via API
   */
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

  /**
   * Extract plain text from JIRA document format
   */
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

  /**
   * Parse test steps from description
   */
  parseSteps(description) {
    if (!description) return '1. Verify requirements\n2. Execute test scenario';

    const lines = description.split('\n');
    const steps = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && (trimmed[0].match(/\d/) || trimmed.startsWith('-') || trimmed.startsWith('*'));
    });

    if (steps.length > 0) {
      return steps.slice(0, 15).join('\n');
    }
    return '1. Follow ticket requirements\n2. Validate results';
  }

  /**
   * Calculate complexity score based on ticket analysis
   */
  calculateComplexity(ticket) {
    const fields = ticket.fields || {};
    const description = this.extractText(fields.description) || '';
    const summary = fields.summary || '';
    const ticketType = fields.issuetype?.name || 'Task';
    const priority = fields.priority?.name || 'Medium';

    let score = 0;

    // Base score by ticket type
    const typeScores = {
      'Epic': 35,
      'Story': 25,
      'Feature': 25,
      'Task': 15,
      'Bug': 10,
      'Sub-task': 8
    };
    score += typeScores[ticketType] || 15;

    // Add points for description length
    score += Math.min(Math.floor(description.length / 100), 10);

    // Add points for keywords indicating complexity
    const complexityKeywords = [
      'integration', 'api', 'database', 'performance', 'security', 'authentication',
      'authorization', 'encryption', 'concurrent', 'scalability', 'migration',
      'complex', 'refactor', 'optimization', 'third-party', 'external service',
      'workflow', 'pipeline', 'cross-system', 'multi-step', 'critical'
    ];
    const descLower = (description + summary).toLowerCase();
    complexityKeywords.forEach(keyword => {
      if (descLower.includes(keyword)) score += 3;
    });

    // Add points for priority
    const priorityScores = { 'Highest': 8, 'High': 6, 'Medium': 3, 'Low': 1 };
    score += priorityScores[priority] || 3;

    // Add points for components/modules (if applicable)
    if (fields.components && fields.components.length > 1) {
      score += fields.components.length * 2;
    }

    return Math.min(score, 100);
  }

  /**
   * Determine number of test cases based on complexity
   */
  determineTestCaseCount(complexity) {
    if (complexity >= 90) return 100;
    if (complexity >= 85) return 90;
    if (complexity >= 80) return 80;
    if (complexity >= 75) return 70;
    if (complexity >= 70) return 60;
    if (complexity >= 65) return 50;
    if (complexity >= 60) return 45;
    if (complexity >= 55) return 40;
    if (complexity >= 50) return 35;
    if (complexity >= 45) return 30;
    if (complexity >= 40) return 25;
    if (complexity >= 35) return 20;
    if (complexity >= 30) return 15;
    if (complexity >= 20) return 12;
    return 10;
  }

  /**
   * Parse JIRA ticket to comprehensive test cases
   */
  parseTicketToTestCases(ticket) {
    const fields = ticket.fields || {};
    const ticketKey = ticket.key || 'UNKNOWN';
    const summary = fields.summary || 'No Summary';
    const description = this.extractText(fields.description) || '';

    // Calculate complexity and determine test case count
    const complexity = this.calculateComplexity(ticket);
    const testCaseCount = this.determineTestCaseCount(complexity);

    const testCases = [];
    let tcCounter = 1;

    // Core test cases (always included)
    const coreTests = [
      {
        type: 'POSITIVE',
        name: 'Positive - Happy Path',
        testType: 'Functional - Positive',
        preCondition: 'Application is properly configured with valid setup; User has required permissions',
        steps: this.generatePositiveSteps(description),
        testData: 'Valid data as per specification; All required fields filled correctly',
        expected: 'Feature works as designed; All requirements met; No errors',
        brief: 'Test the feature with valid inputs following the happy path'
      },
      {
        type: 'NEGATIVE_INPUT',
        name: 'Negative - Invalid/Missing Input',
        testType: 'Functional - Negative',
        preCondition: 'Application is in ready state; Form or input fields are accessible',
        steps: this.generateNegativeSteps(description, 'invalid'),
        testData: 'Invalid inputs; Missing required fields; Wrong data format; Null/Empty values',
        expected: 'Appropriate error messages displayed; Input validation triggered; No data saved',
        brief: 'Verify feature rejects invalid inputs and shows appropriate error messages'
      },
      {
        type: 'EDGE_CASE',
        name: 'Edge Case - Boundary/Limit Conditions',
        testType: 'Functional - Edge Case',
        preCondition: 'Application loaded; Edge case conditions are applicable',
        steps: this.generateEdgeCaseSteps(description),
        testData: 'Boundary values; Maximum/Minimum limits; Special characters; SQL injection attempts',
        expected: 'System handles boundary conditions gracefully; No crashes; Data integrity maintained',
        brief: 'Test feature with edge cases like boundary values and special characters'
      },
      {
        type: 'SECURITY',
        name: 'Security - Unauthorized Access/Permissions',
        testType: 'Security - Negative',
        preCondition: 'User without required permissions is logged in; Feature is available',
        steps: this.generateSecuritySteps(description),
        testData: 'User with minimal/no permissions; Invalid credentials; Expired session',
        expected: 'Access denied; No unauthorized data exposed; Security policies enforced',
        brief: 'Verify unauthorized users cannot access restricted features'
      },
      {
        type: 'PERFORMANCE',
        name: 'Performance - Load & Concurrency',
        testType: 'Performance - Non-Functional',
        preCondition: 'System is under load; Multiple concurrent users/requests enabled',
        steps: this.generatePerformanceSteps(description),
        testData: 'Large dataset; Multiple simultaneous requests; Peak load conditions',
        expected: 'Response time acceptable; No timeout errors; System remains stable',
        brief: 'Test feature performance under load with multiple concurrent users'
      },
      {
        type: 'ERROR_HANDLING',
        name: 'Error Handling & Recovery',
        testType: 'Functional - Error Handling',
        preCondition: 'System is operational; Error scenarios can be simulated',
        steps: this.generateErrorRecoverySteps(description),
        testData: 'Database connection failure; Network timeout; Server errors (500, 503)',
        expected: 'Graceful error handling; User-friendly messages; Data consistency maintained',
        brief: 'Verify feature handles errors gracefully and recovers properly'
      }
    ];

    // Additional test cases (conditionally included)
    const additionalTests = [
      {
        type: 'DATA_INTEGRITY',
        name: 'Data Integrity - Consistency & Validation',
        testType: 'Functional - Data Integrity',
        preCondition: 'Database is accessible; Audit logging is enabled',
        steps: this.generateDataIntegritySteps(description),
        testData: 'Create, update, delete operations; Duplicate data; Large data objects',
        expected: 'Data integrity maintained; No data loss; Referential integrity preserved',
        brief: 'Verify data is saved correctly and consistently across all operations'
      },
      {
        type: 'COMPATIBILITY',
        name: 'Compatibility - Backward Compatibility',
        testType: 'Compatibility - Non-Functional',
        preCondition: 'Legacy data exists; Multiple versions are available',
        steps: this.generateBackwardCompatibilitySteps(description),
        testData: 'Data from previous versions; Old API formats; Legacy configuration files',
        expected: 'Works with legacy data; No migration errors; API backward compatible',
        brief: 'Ensure feature works with older versions and legacy data formats'
      },
      {
        type: 'UI_RESPONSIVE',
        name: 'UI - Responsive Design (Mobile)',
        testType: 'UI - Responsive Design',
        preCondition: 'Application loaded on mobile devices; Various screen sizes available',
        steps: this.generateUIResponsiveSteps(description),
        testData: 'Mobile devices (iPhone, Android); Tablet sizes; Portrait/Landscape modes',
        expected: 'Layout adjusts properly; All elements visible; No overflow; Touch-friendly',
        brief: 'Verify UI is responsive and functional on mobile devices'
      },
      {
        type: 'UI_COLORS',
        name: 'UI - Color & Typography',
        testType: 'UI - Visual Design',
        preCondition: 'Design specifications available; Browser dev tools accessible',
        steps: this.generateUIColorSteps(description),
        testData: 'Design color palette; Font specifications; Contrast ratios; Light/Dark modes',
        expected: 'Colors match design spec; Typography correct; Contrast WCAG compliant; Themes work',
        brief: 'Verify colors, fonts, and visual styling match design specifications'
      },
      {
        type: 'UI_LAYOUT',
        name: 'UI - Layout & Alignment',
        testType: 'UI - Layout',
        preCondition: 'Browser dev tools accessible; Design mockups available',
        steps: this.generateUILayoutSteps(description),
        testData: 'Desktop, tablet, mobile layouts; Different viewport sizes; Content variations',
        expected: 'Elements properly aligned; Spacing consistent; No overlapping; Responsive grid',
        brief: 'Verify all UI elements are correctly positioned and spaced'
      },
      {
        type: 'UI_INTERACTIONS',
        name: 'UI - Interactive Elements',
        testType: 'UI - Interactions',
        preCondition: 'All interactive elements are implemented; Browser console accessible',
        steps: this.generateUIInteractionSteps(description),
        testData: 'Button clicks; Form inputs; Hover states; Focus states; Animations',
        expected: 'Buttons clickable; Inputs functional; Hover effects visible; Animations smooth',
        brief: 'Verify all interactive UI elements respond correctly to user actions'
      },
      {
        type: 'UI_ACCESSIBILITY',
        name: 'UI - Accessibility & WCAG',
        testType: 'UI - Accessibility',
        preCondition: 'Accessibility checker available; Screen reader installed',
        steps: this.generateUIAccessibilitySteps(description),
        testData: 'Screen reader; Keyboard navigation; Color contrast; ARIA labels; Focus indicators',
        expected: 'WCAG 2.1 AA compliant; Screen reader compatible; Keyboard accessible',
        brief: 'Ensure UI meets accessibility standards and works with assistive technologies'
      },
      {
        type: 'INTEGRATION',
        name: 'Integration - System Integration',
        testType: 'Integration - Functional',
        preCondition: 'All dependent systems operational; API endpoints accessible',
        steps: this.generateIntegrationSteps(description),
        testData: 'Valid API requests; Third-party service responses; Integration payloads',
        expected: 'Integrations work seamlessly; Data flows correctly; Proper error handling',
        brief: 'Verify feature integrates correctly with external systems and APIs'
      },
      {
        type: 'INTEGRATION',
        name: 'Integration - System Integration',
        testType: 'Integration - Functional',
        preCondition: 'All dependent systems operational; API endpoints accessible',
        steps: this.generateIntegrationSteps(description),
        testData: 'Valid API requests; Third-party service responses; Integration payloads',
        expected: 'Integrations work seamlessly; Data flows correctly; Proper error handling'
      },
      {
        type: 'REGRESSION',
        name: 'Regression - Regression Testing',
        testType: 'Regression - Functional',
        preCondition: 'Previous test cases documented; Related features implemented',
        steps: this.generateRegressionSteps(description),
        testData: 'Test cases from previous releases; Cross-feature impact tests',
        expected: 'No regression in existing functionality; All previous functionality intact',
        brief: 'Verify no existing functionality was broken by new changes'
      },
      {
        type: 'STATE_MANAGEMENT',
        name: 'State Management - State Transitions',
        testType: 'Functional - State Management',
        preCondition: 'State management system operational; State transitions documented',
        steps: this.generateStateManagementSteps(description),
        testData: 'Valid/invalid state transitions; Concurrent modifications; State persistence',
        expected: 'Proper state transitions enforced; Invalid transitions rejected; Audit logs recorded',
        brief: 'Verify state transitions are handled correctly and consistently'
      },
      {
        type: 'VALIDATION',
        name: 'Validation - Input Validation Rules',
        testType: 'Functional - Validation',
        preCondition: 'Validation rules are defined; Input fields are accessible',
        steps: this.generateValidationSteps(description),
        testData: 'Valid inputs; Invalid patterns; Type mismatches; Format violations',
        expected: 'All validation rules enforced; Error messages clear; Data not saved on validation fail',
        brief: 'Verify all input validation rules are properly enforced'
      },
      {
        type: 'WORKFLOW',
        name: 'Workflow - Business Process Flow',
        testType: 'Functional - Workflow',
        preCondition: 'All workflow steps are accessible; Process is configured',
        steps: this.generateWorkflowSteps(description),
        testData: 'Complete workflow scenarios; Step-by-step progression; State transitions',
        expected: 'Workflow completes successfully; Steps execute in correct order; Data flows properly',
        brief: 'Test the complete workflow from start to finish'
      },
      {
        type: 'CACHING',
        name: 'Caching - Cache Invalidation',
        testType: 'Functional - Caching',
        preCondition: 'Cache mechanism enabled; Cache storage accessible',
        steps: this.generateCachingSteps(description),
        testData: 'Cached data; Cache updates; Cache invalidation scenarios',
        expected: 'Cache works correctly; Data refreshed appropriately; No stale data served',
        brief: 'Verify caching works correctly and data is refreshed when needed'
      },
      {
        type: 'LOCALIZATION',
        name: 'Localization - Multi-language Support',
        testType: 'Functional - Localization',
        preCondition: 'Multiple language packs available; Locale switching enabled',
        steps: this.generateLocalizationSteps(description),
        testData: 'Different languages; Various locales; Special characters; RTL languages',
        expected: 'All text properly translated; Formatting correct; RTL display proper',
        brief: 'Test feature with multiple languages and locale settings'
      },
      {
        type: 'API_VALIDATION',
        name: 'API Response - Response Validation',
        testType: 'Functional - API',
        preCondition: 'API endpoints accessible; API documentation available',
        steps: this.generateAPIValidationSteps(description),
        testData: 'Valid requests; Invalid payloads; Missing parameters; Wrong data types',
        expected: 'API returns correct status; Response format valid; Error codes proper',
        brief: 'Verify API responses are valid and correctly formatted'
      },
      {
        type: 'CONCURRENCY',
        name: 'Concurrency - Race Conditions',
        testType: 'Functional - Concurrency',
        preCondition: 'Concurrent access mechanism available; Locking mechanism in place',
        steps: this.generateConcurrencySteps(description),
        testData: 'Simultaneous operations; Race condition scenarios; Lock timeouts',
        expected: 'No race conditions; Locks prevent conflicts; Data consistency maintained',
        brief: 'Test for race conditions under concurrent access'
      },
      {
        type: 'CLEANUP',
        name: 'Cleanup - Resource Cleanup',
        testType: 'Functional - Cleanup',
        preCondition: 'Resource tracking enabled; Cleanup mechanisms available',
        steps: this.generateCleanupSteps(description),
        testData: 'Resource creation; Long-running operations; Incomplete operations',
        expected: 'Resources properly cleaned up; Memory leaks prevented; No orphaned processes',
        brief: 'Verify resources are properly cleaned up after operations'
      },
      {
        type: 'MONITORING',
        name: 'Monitoring - Monitoring & Logging',
        testType: 'Non-Functional - Monitoring',
        preCondition: 'Monitoring tools configured; Logging framework enabled',
        steps: this.generateMonitoringSteps(description),
        testData: 'Operations; Error scenarios; Performance metrics; User actions',
        expected: 'All events properly logged; Metrics captured; No sensitive data logged',
        brief: 'Verify all operations are properly logged and monitored'
      }
    ];

    // Add core tests first
    coreTests.forEach(test => {
      if (tcCounter <= testCaseCount) {
        testCases.push({
          TC_ID: `${ticketKey}_TC_${String(tcCounter++).padStart(3, '0')}`,
          'Test Scenario': `[${test.type}] ${summary} - ${test.name}`,
          'Test Type': test.testType,
          'Pre-Condition': test.preCondition,
          'Test Steps': test.steps,
          'Test Data': test.testData,
          'Expected Result': test.expected,
          'Brief Description': test.brief || 'Test case for ' + test.name,
          'Status': ''
        });
      }
    });

    // Add additional tests based on complexity
    additionalTests.forEach(test => {
      if (tcCounter <= testCaseCount) {
        testCases.push({
          TC_ID: `${ticketKey}_TC_${String(tcCounter++).padStart(3, '0')}`,
          'Test Scenario': `[${test.type}] ${summary} - ${test.name}`,
          'Test Type': test.testType,
          'Pre-Condition': test.preCondition,
          'Test Steps': test.steps,
          'Test Data': test.testData,
          'Expected Result': test.expected,
          'Brief Description': test.brief || 'Test case for ' + test.name,
          'Status': ''
        });
      }
    });

    return { testCases, ticketKey, summary, complexity, testCaseCount };
  }

  /**
   * Generate positive test steps
   */
  generatePositiveSteps(description) {
    if (!description) {
      return '1. Navigate to the feature\n2. Verify all elements load correctly\n3. Perform primary action with valid data\n4. Verify successful completion\n5. Confirm all expected results are achieved';
    }
    return `1. Open the application and navigate to the feature\n2. Verify UI elements are displayed correctly\n3. Enter valid data as per specification\n4. Execute the feature/action\n5. Verify successful completion with all requirements met\n6. Check for any warnings or errors`;
  }

  /**
   * Generate negative test steps
   */
  generateNegativeSteps(description, type) {
    return `1. Open the feature/form\n2. Try submitting with empty/missing required fields\n3. Enter invalid data (wrong format, wrong type)\n4. Attempt to proceed without completing mandatory fields\n5. Verify error messages are displayed\n6. Verify data is NOT saved\n7. Verify user is prevented from proceeding with invalid data`;
  }

  /**
   * Generate edge case test steps
   */
  generateEdgeCaseSteps(description) {
    return `1. Test with maximum allowed input length\n2. Test with minimum allowed input (0, empty, null)\n3. Test with special characters (@, #, $, %, &, <, >)\n4. Test with very large numbers or datasets\n5. Test with SQL injection payloads\n6. Test with whitespace-only input\n7. Verify system handles all edge cases without crashing`;
  }

  /**
   * Generate security test steps
   */
  generateSecuritySteps(description) {
    return `1. Attempt to access feature without authentication\n2. Attempt to access feature with expired session\n3. Attempt to bypass authorization checks\n4. Try to access with user having no permissions\n5. Attempt cross-origin requests (CORS)\n6. Try to manipulate URL parameters for unauthorized access\n7. Verify access is denied; Verify security logs are recorded`;
  }

  /**
   * Generate performance test steps
   */
  generatePerformanceSteps(description) {
    return `1. Load the feature with normal data volume\n2. Execute action with large dataset (1000+ records)\n3. Simulate 50+ concurrent users\n4. Monitor response times and resource usage\n5. Check for memory leaks during extended usage\n6. Verify UI remains responsive\n7. Confirm no data loss under load`;
  }

  /**
   * Generate error recovery test steps
   */
  generateErrorRecoverySteps(description) {
    return `1. Simulate database connection failure\n2. Simulate network timeout during operation\n3. Trigger server error (500, 503, 504)\n4. Interrupt operation mid-execution\n5. Verify graceful error message is shown\n6. Verify system state is consistent after error\n7. Verify automatic retry mechanism (if applicable)\n8. Check error logs are properly recorded`;
  }

  /**
   * Generate data integrity test steps
   */
  generateDataIntegritySteps(description) {
    return `1. Perform create operation and verify data persistence\n2. Perform update operation and verify changes are saved\n3. Perform delete operation and verify data is removed\n4. Test cascading updates/deletes\n5. Verify referential integrity constraints\n6. Test concurrent data modifications\n7. Verify audit logs record all changes\n8. Rollback transaction and verify data consistency`;
  }

  /**
   * Generate backward compatibility test steps
   */
  generateBackwardCompatibilitySteps(description) {
    return `1. Import/load data from previous version\n2. Test with legacy API formats\n3. Execute workflows using old configuration\n4. Process legacy data structures\n5. Verify no migration errors occur\n6. Test mixed old and new format data\n7. Verify API backward compatibility\n8. Check old client versions still work`;
  }

  /**
   * Generate UI/UX test steps
   */
  generateUIUXSteps(description) {
    return `1. Test on mobile devices (iOS, Android)\n2. Test on tablets (various sizes)\n3. Test on desktop (various resolutions)\n4. Test in multiple browsers (Chrome, Firefox, Safari, Edge)\n5. Test keyboard navigation (Tab, Enter, Escape keys)\n6. Test screen reader compatibility\n7. Verify responsive design works correctly\n8. Check color contrast and accessibility standards`;
  }

  /**
   * Generate integration test steps
   */
  generateIntegrationSteps(description) {
    return `1. Test API integration with real endpoints\n2. Test third-party service connectivity\n3. Verify data transformation between systems\n4. Test error handling when external service fails\n5. Test retry logic for failed integrations\n6. Verify proper logging of integration events\n7. Test timeout handling for slow services\n8. Verify security between integrated systems`;
  }

  /**
   * Generate regression test steps
   */
  generateRegressionSteps(description) {
    return `1. Execute all test cases from previous release\n2. Test related/dependent features\n3. Verify no existing functionality is broken\n4. Test cross-feature interactions\n5. Verify performance metrics not degraded\n6. Check that fixed bugs remain fixed\n7. Test feature combinations that previously failed\n8. Verify backward compatibility maintained`;
  }

  /**
   * Generate state management test steps
   */
  generateStateManagementSteps(description) {
    return `1. Verify valid state transitions are allowed\n2. Reject invalid state transitions with error\n3. Test state persistence across sessions\n4. Test concurrent state modifications\n5. Verify state rollback on error\n6. Test state data consistency\n7. Verify audit logs record state changes\n8. Test state cleanup and garbage collection`;
  }

  /**
   * Generate validation test steps
   */
  generateValidationSteps(description) {
    return `1. Test required field validation\n2. Test data type validation\n3. Test format validation (email, phone, date)\n4. Test range validation (min/max values)\n5. Test pattern validation (regex)\n6. Test cross-field validation\n7. Test custom validation rules\n8. Verify validation error messages are clear`;
  }

  /**
   * Generate workflow test steps
   */
  generateWorkflowSteps(description) {
    return `1. Execute complete workflow from start to end\n2. Verify correct step sequence\n3. Test conditional branching in workflow\n4. Test rollback within workflow\n5. Test workflow state persistence\n6. Test concurrent workflows\n7. Verify workflow notifications/callbacks\n8. Test workflow timeout handling`;
  }

  /**
   * Generate caching test steps
   */
  generateCachingSteps(description) {
    return `1. Verify data is cached on first request\n2. Verify cached data is returned on subsequent requests\n3. Test cache expiration\n4. Test cache invalidation on data update\n5. Test cache invalidation on delete\n6. Test cache size limits\n7. Test cache hit/miss rates\n8. Test cache consistency with source data`;
  }

  /**
   * Generate localization test steps
   */
  generateLocalizationSteps(description) {
    return `1. Switch to different language packs\n2. Verify all text is translated\n3. Test with RTL (Right-to-Left) languages\n4. Test with special characters (Chinese, Arabic, etc.)\n5. Verify date/time formats for locale\n6. Verify currency formatting\n7. Test text truncation in different languages\n8. Verify locale persistence`;
  }

  /**
   * Generate API validation test steps
   */
  generateAPIValidationSteps(description) {
    return `1. Validate API response structure\n2. Validate response data types\n3. Test with missing required parameters\n4. Test with invalid parameter values\n5. Validate HTTP status codes\n6. Test error response format\n7. Validate response headers\n8. Test API versioning compatibility`;
  }

  /**
   * Generate concurrency test steps
   */
  generateConcurrencySteps(description) {
    return `1. Simulate concurrent read operations\n2. Simulate concurrent write operations\n3. Test race condition scenarios\n4. Test deadlock prevention\n5. Test lock timeout handling\n6. Test optimistic concurrency control\n7. Verify data consistency under concurrent access\n8. Test transaction isolation levels`;
  }

  /**
   * Generate cleanup test steps
   */
  generateCleanupSteps(description) {
    return `1. Verify resources are created on operation start\n2. Verify resources are released on operation end\n3. Test cleanup on error/exception\n4. Test cleanup on timeout\n5. Test cleanup for interrupted operations\n6. Verify no memory leaks\n7. Verify no orphaned processes\n8. Verify cleanup logs are recorded`;
  }

  /**
   * Generate monitoring test steps
   */
  generateMonitoringSteps(description) {
    return `1. Verify all operations are logged\n2. Verify error conditions are logged\n3. Verify performance metrics are captured\n4. Verify log levels are appropriate\n5. Verify no sensitive data in logs\n6. Test log rotation and archival\n7. Verify monitoring alerts trigger correctly\n8. Verify log aggregation works`;
  }

  /**
   * Generate UI responsive design test steps
   */
  generateUIResponsiveSteps(description) {
    return `1. Test on iPhone 12/13/14 (375px width)\n2. Test on iPad (768px width)\n3. Test on Desktop (1920px width)\n4. Test landscape and portrait modes\n5. Verify layout doesn't break at any breakpoint\n6. Check text readability on all sizes\n7. Verify images scale properly\n8. Test touch interactions on mobile`;
  }

  /**
   * Generate UI color & typography test steps
   */
  generateUIColorSteps(description) {
    return `1. Verify primary color matches design spec\n2. Verify secondary color matches design spec\n3. Verify text color contrast ratio is >= 4.5:1\n4. Verify font family is correct (check with inspector)\n5. Verify font sizes match design spec\n6. Verify font weights (normal, bold, etc.) are correct\n7. Test light mode color scheme\n8. Test dark mode color scheme\n9. Verify error colors are distinct\n10. Verify warning/info colors are accessible`;
  }

  /**
   * Generate UI layout test steps
   */
  generateUILayoutSteps(description) {
    return `1. Verify elements are aligned to grid\n2. Check spacing between elements (padding/margin)\n3. Verify no horizontal overflow\n4. Verify elements don't overlap\n5. Check vertical alignment of text/icons\n6. Verify content area width is appropriate\n7. Test with different content lengths\n8. Verify element sizing is consistent`;
  }

  /**
   * Generate UI interaction test steps
   */
  generateUIInteractionSteps(description) {
    return `1. Test button hover states (color change)\n2. Test button active/pressed states\n3. Test button disabled states\n4. Test form input focus states (border color)\n5. Test form input error states (red border)\n6. Test dropdown open/close animation\n7. Test modal open/close animation\n8. Test menu expand/collapse transitions\n9. Verify cursor changes appropriately (pointer on buttons)\n10. Test keyboard interactions (Tab, Enter, Escape)`;
  }

  /**
   * Generate UI accessibility test steps
   */
  generateUIAccessibilitySteps(description) {
    return `1. Test with screen reader (NVDA/JAWS)\n2. Verify all buttons have text labels or ARIA labels\n3. Verify form inputs have associated labels\n4. Verify color is not the only indicator (also use text/icons)\n5. Test keyboard navigation (Tab order)\n6. Verify focus indicator is visible\n7. Check color contrast with contrast checker\n8. Test heading hierarchy (H1, H2, etc.)\n9. Verify images have alt text\n10. Test ARIA live regions for dynamic content`;
  }

  /**
   * Create Excel file in template format
   */
  async createExcelFile(testCases, ticketKey, summary) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');

    // Define header styling
    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF366092' }
    };

    const headerFont = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 12
    };

    const border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Row 1: Title row (merged cells)
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Test ID: ${ticketKey}   |   Test Name: ${summary}   |   Tested URL: Dev / DR Environment`;
    titleCell.font = { bold: true, size: 11 };
    titleCell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
    worksheet.getRow(1).height = 25;

    // Row 2: Column headers
    const headers = ['TC_ID', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Brief Description', 'Status'];
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(2, index + 1);
      cell.value = header;
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
      cell.border = border;
    });
    worksheet.getRow(2).height = 25;

    // Data rows
    testCases.forEach((testCase, rowIndex) => {
      const rowNum = rowIndex + 3;
      headers.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNum, colIndex + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = border;
      });
      worksheet.getRow(rowNum).height = 70;
    });

    // Set column widths
    const columnWidths = {
      'A': 15,  // TC_ID
      'B': 25,  // Test Scenario
      'C': 15,  // Test Type
      'D': 20,  // Pre-Condition
      'E': 25,  // Test Steps
      'F': 18,  // Test Data
      'G': 25,  // Expected Result
      'H': 20,  // Brief Description
      'I': 12   // Status
    };

    Object.keys(columnWidths).forEach(col => {
      worksheet.getColumn(col).width = columnWidths[col];
    });

    // Save file
    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_${safeFileName}.xlsx`;
    const filepath = path.join(this.outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  /**
   * Main generation method
   */
  async generate(ticketKey, verbose = false) {
    try {
      if (verbose) {
        console.log('\n' + '='.repeat(70));
        console.log('JIRA Test Case Generator');
        console.log('='.repeat(70));
      }

      if (verbose) console.log(`\nFetching ticket: ${ticketKey}...`);
      const ticket = await this.fetchTicket(ticketKey);
      if (verbose) console.log('✓ Ticket fetched successfully');

      const { testCases, ticketKey: responseKey, summary, complexity, testCaseCount } = this.parseTicketToTestCases(ticket);
      if (verbose) console.log(`✓ Test cases parsed: ${testCases.length} test case(s) created`);

      const filepath = await this.createExcelFile(testCases, responseKey, summary);
      if (verbose) console.log('✓ Excel file created');

      if (verbose) {
        console.log('\n' + '='.repeat(70));
        console.log('✓ Success! Test cases generated in Excel format.');
        console.log('\nDetails:');
        console.log(`  Ticket: ${responseKey}`);
        console.log(`  Title: ${summary}`);
        console.log(`  Complexity Score: ${complexity}`);
        console.log(`  Test Cases: ${testCases.length}`);
        console.log(`  Output: ${filepath}`);
        console.log('\nTest Case Summary:');
        testCases.forEach((tc, idx) => {
          console.log(`\n  [${idx + 1}] ${tc.TC_ID}`);
          console.log(`      Scenario: ${tc['Test Scenario']}`);
          console.log(`      Type: ${tc['Test Type']}`);
        });
        console.log('\n' + '='.repeat(70) + '\n');
      }

      return { filepath, complexity, testCaseCount };
    } catch (error) {
      throw error;
    }
  }
}

// Main entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node jira_testcase_generator.js <TICKET_KEY_1> [TICKET_KEY_2] [TICKET_KEY_3] ...');
  console.log('');
  console.log('Single ticket:');
  console.log('  node jira_testcase_generator.js GAAM-618');
  console.log('');
  console.log('Multiple tickets:');
  console.log('  node jira_testcase_generator.js GAAM-618 GAAM-619 GAAM-620');
  process.exit(1);
}

// Process multiple tickets
const ticketKeys = args.map(key => key.toUpperCase());
const generator = new JiraTestCaseGenerator();

console.log(`\n${'='.repeat(70)}`);
console.log(`Generating test cases for ${ticketKeys.length} ticket(s)`);
console.log(`${'='.repeat(70)}\n`);

(async () => {
  const results = [];

  for (let i = 0; i < ticketKeys.length; i++) {
    const ticketKey = ticketKeys[i];
    try {
      console.log(`[${i + 1}/${ticketKeys.length}] Processing: ${ticketKey}`);
      const result = await generator.generate(ticketKey);
      results.push({ ticketKey, status: '✓ Success', filepath: result.filepath, complexity: result.complexity, testCaseCount: result.testCaseCount });
    } catch (error) {
      results.push({ ticketKey, status: '✗ Failed', error: error.message });
    }
  }

  // Summary
  console.log(`\n${'='.repeat(70)}`);
  console.log('GENERATION SUMMARY');
  console.log(`${'='.repeat(70)}\n`);

  results.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.ticketKey}: ${result.status}`);
    if (result.filepath) {
      console.log(`   File: ${result.filepath.split('\\').pop()}`);
      if (result.testCaseCount) {
        console.log(`   Test Cases: ${result.testCaseCount} (Complexity: ${result.complexity})`);
      }
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.status.includes('Success')).length;
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Total: ${successCount}/${ticketKeys.length} test case(s) generated successfully`);
  console.log(`Location: C:\\Users\\PuneethAM\\GA_testcases\\GA_testcases\\`);
  console.log(`${'='.repeat(70)}\n`);

  process.exit(successCount === ticketKeys.length ? 0 : 1);
})();
