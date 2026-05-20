#!/usr/bin/env node

/**
 * JIRA Test Case Generator v2
 * Generates feature-specific test cases from JIRA tickets in CSV format
 * Matches reference file style: concise, natural language, grouped by functionality
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  jiraUrl: 'https://bounteous.jira.com',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};

class TestCaseGenerator {
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

  generateTestCases(ticket) {
    const fields = ticket.fields || {};
    const ticketKey = ticket.key || 'UNKNOWN';
    const summary = fields.summary || 'No Summary';
    const description = this.extractText(fields.description) || '';
    const ticketType = fields.issuetype?.name || 'Task';

    const testCases = [];
    let tcCounter = 1;

    // Analyze ticket to determine feature focus
    const descLower = (description + summary).toLowerCase();

    // Generate test cases based on ticket content
    if (descLower.includes('click') || descLower.includes('event') || descLower.includes('tracking')) {
      testCases.push(...this.generateClickTrackingTests(summary, tcCounter));
      tcCounter += 15;
    }

    if (descLower.includes('link') || descLower.includes('external') || descLower.includes('url')) {
      testCases.push(...this.generateLinkTests(summary, tcCounter));
      tcCounter += 12;
    }

    if (descLower.includes('form') || descLower.includes('input') || descLower.includes('validation')) {
      testCases.push(...this.generateFormTests(summary, tcCounter));
      tcCounter += 15;
    }

    if (descLower.includes('login') || descLower.includes('password') || descLower.includes('authentication')) {
      testCases.push(...this.generateLoginTests(summary, tcCounter));
      tcCounter += 18;
    }

    if (descLower.includes('component') || descLower.includes('footer') || descLower.includes('header')) {
      testCases.push(...this.generateComponentTests(summary, tcCounter));
      tcCounter += 20;
    }

    // Add universal tests if less than 30 test cases
    if (testCases.length < 30) {
      testCases.push(...this.generateUniversalTests(summary, tcCounter));
    }

    // Ensure we have enough test cases
    while (testCases.length < 30) {
      testCases.push({
        TC_ID: `TC_${String(tcCounter++).padStart(3, '0')}`,
        'Test Scenario': `Verify additional functionality - ${Math.random().toString(36).substring(7)}`,
        'Test Type': 'Functional',
        'Pre-Condition': 'Feature loaded',
        'Test Steps': '1. Perform action',
        'Test Data': 'N/A',
        'Expected Result': 'Expected behavior occurs',
        'Status': '',
        'blank': ''
      });
    }

    return { testCases: testCases.slice(0, 50), ticketKey, summary };
  }

  generateClickTrackingTests(summary, startCounter) {
    return [
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify event fires on component click',
        'Test Type': 'Functional',
        'Pre-Condition': 'Page with tracked component loaded',
        'Test Steps': '1. Click on component\n2. Inspect data layer',
        'Test Data': 'N/A',
        'Expected Result': 'Event is pushed to data layer',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify event field contains correct value',
        'Test Type': 'Functional',
        'Pre-Condition': 'Component clicked',
        'Test Steps': '1. Inspect event field in payload',
        'Test Data': 'N/A',
        'Expected Result': 'Event value matches specification',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify only one event fires per click',
        'Test Type': 'Negative',
        'Pre-Condition': 'Component clicked',
        'Test Steps': '1. Click component once\n2. Count events in data layer',
        'Test Data': 'N/A',
        'Expected Result': 'Only one event triggered per click',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component object exists in event',
        'Test Type': 'Functional',
        'Pre-Condition': 'Component clicked',
        'Test Steps': '1. Inspect event payload',
        'Test Data': 'N/A',
        'Expected Result': 'Component object present in data layer',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component metadata fields populated',
        'Test Type': 'Functional',
        'Pre-Condition': 'Component configured',
        'Test Steps': '1. Click component\n2. Verify all metadata fields',
        'Test Data': 'N/A',
        'Expected Result': 'All required fields populated correctly',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify tracking for multiple component types',
        'Test Type': 'Functional',
        'Pre-Condition': 'Page with various components',
        'Test Steps': '1. Click different component types',
        'Test Data': 'N/A',
        'Expected Result': 'Each component type fires correct event',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify repeated component instances tracked independently',
        'Test Type': 'Edge',
        'Pre-Condition': 'Same component repeated on page',
        'Test Steps': '1. Click each instance\n2. Compare events',
        'Test Data': 'N/A',
        'Expected Result': 'Each instance sends correct unique values',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify rapid multiple clicks handled correctly',
        'Test Type': 'Edge',
        'Pre-Condition': 'User can click rapidly',
        'Test Steps': '1. Click multiple times quickly\n2. Count events',
        'Test Data': 'N/A',
        'Expected Result': 'Each click fires one event without duplication',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify event fires without data attribute errors',
        'Test Type': 'Negative',
        'Pre-Condition': 'Component with missing attributes',
        'Test Steps': '1. Click component\n2. Check console for errors',
        'Test Data': 'N/A',
        'Expected Result': 'Event fires gracefully, no JS errors',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no console errors on click',
        'Test Type': 'Regression',
        'Pre-Condition': 'Dev tools open',
        'Test Steps': '1. Load page\n2. Click component\n3. Inspect console',
        'Test Data': 'N/A',
        'Expected Result': 'No JS errors logged',
        'Status': ''
      }
    ];
  }

  generateLinkTests(summary, startCounter) {
    return [
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify external link detection works',
        'Test Type': 'Positive',
        'Pre-Condition': 'External link configured',
        'Test Steps': '1. Load page\n2. Inspect link attributes',
        'Test Data': 'external=true',
        'Expected Result': 'External link properly identified',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify external link opens in new tab',
        'Test Type': 'Positive',
        'Pre-Condition': 'External link present',
        'Test Steps': '1. Click link\n2. Verify tab behavior',
        'Test Data': 'External URL',
        'Expected Result': 'Link opens in new tab (_blank)',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify internal link opens in same tab',
        'Test Type': 'Positive',
        'Pre-Condition': 'Internal link configured',
        'Test Steps': '1. Click link\n2. Verify navigation',
        'Test Data': 'Internal URL',
        'Expected Result': 'Link opens in current tab',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify external icon displays for external links',
        'Test Type': 'UI',
        'Pre-Condition': 'External link present',
        'Test Steps': '1. Load page\n2. Inspect DOM for icon',
        'Test Data': 'N/A',
        'Expected Result': 'External icon visible and positioned correctly',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no icon for internal links',
        'Test Type': 'Positive',
        'Pre-Condition': 'Internal link configured',
        'Test Steps': '1. Inspect DOM for external icon',
        'Test Data': 'N/A',
        'Expected Result': 'No external icon displayed',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify automatic external link detection',
        'Test Type': 'Positive',
        'Pre-Condition': 'Backend property passed',
        'Test Steps': '1. Load page with external link',
        'Test Data': 'N/A',
        'Expected Result': 'External behavior applied automatically',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify mixed internal/external links on same page',
        'Test Type': 'Functional',
        'Pre-Condition': 'Multiple links configured',
        'Test Steps': '1. Load page with mixed links',
        'Test Data': 'N/A',
        'Expected Result': 'Each link behaves according to type',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify invalid link URL handling',
        'Test Type': 'Negative',
        'Pre-Condition': 'Invalid URL configured',
        'Test Steps': '1. Click invalid link\n2. Check error handling',
        'Test Data': 'Malformed URL',
        'Expected Result': 'No crash, safe handling',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify accessibility for external links',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'External link present',
        'Test Steps': '1. Use screen reader\n2. Tab to link',
        'Test Data': 'N/A',
        'Expected Result': 'Screen reader announces external link properly',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify link styling matches design',
        'Test Type': 'UI',
        'Pre-Condition': 'Link rendered',
        'Test Steps': '1. Inspect link styles\n2. Compare with design spec',
        'Test Data': 'N/A',
        'Expected Result': 'Colors, underlines match Figma',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify focus state visible on links',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Link present',
        'Test Steps': '1. Tab to link\n2. Verify focus styling',
        'Test Data': 'N/A',
        'Expected Result': 'Clear visible focus indicator',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify cross-browser link behavior',
        'Test Type': 'Compatibility',
        'Pre-Condition': 'Multiple browsers available',
        'Test Steps': '1. Test in Chrome, Safari, Firefox\n2. Compare behavior',
        'Test Data': 'N/A',
        'Expected Result': 'Consistent behavior across browsers',
        'Status': ''
      }
    ];
  }

  generateFormTests(summary, startCounter) {
    return [
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form renders correctly',
        'Test Type': 'Positive',
        'Pre-Condition': 'Form component loaded',
        'Test Steps': '1. Load page\n2. Inspect form elements',
        'Test Data': 'N/A',
        'Expected Result': 'All form fields visible and properly labeled',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify required field validation',
        'Test Type': 'Negative',
        'Pre-Condition': 'Form with required fields',
        'Test Steps': '1. Submit empty form',
        'Test Data': 'N/A',
        'Expected Result': 'Validation error displayed for required fields',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form submission with valid data',
        'Test Type': 'Positive',
        'Pre-Condition': 'Form ready',
        'Test Steps': '1. Fill form with valid data\n2. Submit',
        'Test Data': 'Valid input values',
        'Expected Result': 'Form submits successfully',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form data preservation on validation error',
        'Test Type': 'Functional',
        'Pre-Condition': 'Form submitted with invalid data',
        'Test Steps': '1. Submit invalid form\n2. Check field values',
        'Test Data': 'Mixed valid/invalid',
        'Expected Result': 'Entered data remains in fields',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify invalid input format handling',
        'Test Type': 'Negative',
        'Pre-Condition': 'Form with format validation',
        'Test Steps': '1. Enter invalid format\n2. Submit',
        'Test Data': 'Invalid format (email, phone, etc)',
        'Expected Result': 'Format error message displayed',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify character limit validation',
        'Test Type': 'Boundary',
        'Pre-Condition': 'Form with character limits',
        'Test Steps': '1. Enter text exceeding limit\n2. Attempt submit',
        'Test Data': '50+ characters',
        'Expected Result': 'Validation error or field limit enforced',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form labels correctly associated',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Form loaded',
        'Test Steps': '1. Inspect form label HTML',
        'Test Data': 'N/A',
        'Expected Result': 'Labels have for attribute matching input id',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify keyboard navigation through form',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Form loaded',
        'Test Steps': '1. Tab through form fields',
        'Test Data': 'N/A',
        'Expected Result': 'Logical tab order through all fields',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form responsive on mobile',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Mobile viewport',
        'Test Steps': '1. Load form on mobile\n2. Inspect layout',
        'Test Data': 'N/A',
        'Expected Result': 'Form fields stack vertically, all visible',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form responsive on desktop',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Desktop viewport',
        'Test Steps': '1. Load form on desktop\n2. Inspect layout',
        'Test Data': 'N/A',
        'Expected Result': 'Form displays with proper spacing and alignment',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no console errors on form interaction',
        'Test Type': 'Regression',
        'Pre-Condition': 'Dev tools open',
        'Test Steps': '1. Interact with form\n2. Check console',
        'Test Data': 'N/A',
        'Expected Result': 'No JS errors logged',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form styling matches design',
        'Test Type': 'UI',
        'Pre-Condition': 'Form rendered',
        'Test Steps': '1. Compare with design spec',
        'Test Data': 'N/A',
        'Expected Result': 'Colors, fonts, spacing match Figma',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form error message styling',
        'Test Type': 'UI',
        'Pre-Condition': 'Form validation triggered',
        'Test Steps': '1. Trigger validation error\n2. Inspect styling',
        'Test Data': 'N/A',
        'Expected Result': 'Error messages styled consistently, visible',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify special characters in form input',
        'Test Type': 'Edge',
        'Pre-Condition': 'Form accepting text',
        'Test Steps': '1. Enter special characters\n2. Submit',
        'Test Data': '@#$%^&*()',
        'Expected Result': 'Special characters handled without breaking form',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify long text input handling',
        'Test Type': 'Edge',
        'Pre-Condition': 'Text area or input field',
        'Test Steps': '1. Enter very long text\n2. Submit',
        'Test Data': '500+ character text',
        'Expected Result': 'Long text handled correctly, no truncation',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify cross-browser form compatibility',
        'Test Type': 'Compatibility',
        'Pre-Condition': 'Multiple browsers',
        'Test Steps': '1. Test in Chrome, Safari, Firefox, Edge',
        'Test Data': 'N/A',
        'Expected Result': 'Consistent form behavior and styling',
        'Status': ''
      }
    ];
  }

  generateLoginTests(summary, startCounter) {
    return [
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify login form renders',
        'Test Type': 'Positive',
        'Pre-Condition': 'Login page loaded',
        'Test Steps': '1. Load login page\n2. Inspect form fields',
        'Test Data': 'N/A',
        'Expected Result': 'Username and password fields visible',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify successful login with valid credentials',
        'Test Type': 'Positive',
        'Pre-Condition': 'Valid user account exists',
        'Test Steps': '1. Enter username\n2. Enter password\n3. Click submit',
        'Test Data': 'Valid credentials',
        'Expected Result': 'Login successful, redirected to dashboard',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify login fails with invalid credentials',
        'Test Type': 'Negative',
        'Pre-Condition': 'Login form displayed',
        'Test Steps': '1. Enter invalid credentials\n2. Click submit',
        'Test Data': 'Invalid username/password',
        'Expected Result': 'Error message displayed, not logged in',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify required field validation',
        'Test Type': 'Negative',
        'Pre-Condition': 'Login form displayed',
        'Test Steps': '1. Leave fields empty\n2. Click submit',
        'Test Data': 'N/A',
        'Expected Result': 'Error message for required fields',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify password masking by default',
        'Test Type': 'Positive',
        'Pre-Condition': 'Login form loaded',
        'Test Steps': '1. Enter password\n2. Verify display',
        'Test Data': 'Test123',
        'Expected Result': 'Password displayed as dots/asterisks',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify password visibility toggle',
        'Test Type': 'Positive',
        'Pre-Condition': 'Password entered',
        'Test Steps': '1. Click eye icon\n2. Verify password visible',
        'Test Data': 'N/A',
        'Expected Result': 'Password text becomes visible',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify password field refocuses after toggle',
        'Test Type': 'Functional',
        'Pre-Condition': 'Password visibility toggled',
        'Test Steps': '1. Toggle password visibility\n2. Check focus',
        'Test Data': 'N/A',
        'Expected Result': 'Focus remains on password field',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify "Remember Me" functionality',
        'Test Type': 'Functional',
        'Pre-Condition': 'Login form displayed',
        'Test Steps': '1. Check "Remember Me" box\n2. Login\n3. Close browser\n4. Reopen',
        'Test Data': 'N/A',
        'Expected Result': 'Username remembered on return visit',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify "Forgot Password" link works',
        'Test Type': 'Functional',
        'Pre-Condition': 'Login page displayed',
        'Test Steps': '1. Click "Forgot Password" link',
        'Test Data': 'N/A',
        'Expected Result': 'Redirected to password reset page',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form accessible via keyboard',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Login form loaded',
        'Test Steps': '1. Tab through form\n2. Enter data via keyboard\n3. Submit with Enter',
        'Test Data': 'N/A',
        'Expected Result': 'All form operations work with keyboard',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify error messages announced to screen reader',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Screen reader enabled',
        'Test Steps': '1. Trigger login error\n2. Listen to screen reader',
        'Test Data': 'N/A',
        'Expected Result': 'Error message announced immediately',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify labels properly associated with inputs',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Login form loaded',
        'Test Steps': '1. Inspect form HTML labels',
        'Test Data': 'N/A',
        'Expected Result': 'Labels have for attribute matching input id',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify password toggle aria-label updates',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Password field loaded',
        'Test Steps': '1. Inspect aria-label\n2. Toggle visibility\n3. Check aria-label again',
        'Test Data': 'N/A',
        'Expected Result': 'aria-label changes between "Show" and "Hide"',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify mobile responsive layout',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Mobile viewport',
        'Test Steps': '1. Load login on mobile\n2. Inspect layout',
        'Test Data': 'N/A',
        'Expected Result': 'Form spans full width, fields stack vertically',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify form styling matches design',
        'Test Type': 'UI',
        'Pre-Condition': 'Form rendered',
        'Test Steps': '1. Compare with Figma design',
        'Test Data': 'N/A',
        'Expected Result': 'Colors, fonts, spacing match specification',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no console errors on login',
        'Test Type': 'Regression',
        'Pre-Condition': 'Dev tools open',
        'Test Steps': '1. Login with valid credentials\n2. Check console',
        'Test Data': 'N/A',
        'Expected Result': 'No JS errors logged',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify cross-browser compatibility',
        'Test Type': 'Compatibility',
        'Pre-Condition': 'Multiple browsers available',
        'Test Steps': '1. Test in Chrome, Safari, Firefox, Edge',
        'Test Data': 'N/A',
        'Expected Result': 'Consistent form behavior and styling',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify session timeout handling',
        'Test Type': 'Negative',
        'Pre-Condition': 'User logged in',
        'Test Steps': '1. Wait for session timeout\n2. Try action',
        'Test Data': 'N/A',
        'Expected Result': 'Redirected to login, proper message shown',
        'Status': ''
      }
    ];
  }

  generateComponentTests(summary, startCounter) {
    return [
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component renders on page',
        'Test Type': 'Positive',
        'Pre-Condition': 'Component configured',
        'Test Steps': '1. Load page\n2. Inspect component DOM',
        'Test Data': 'N/A',
        'Expected Result': 'Component visible and properly rendered',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component content displays correctly',
        'Test Type': 'Positive',
        'Pre-Condition': 'Component with content',
        'Test Steps': '1. Load page\n2. Verify content visible',
        'Test Data': 'N/A',
        'Expected Result': 'All content rendered in correct order',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component styling matches design',
        'Test Type': 'UI',
        'Pre-Condition': 'Component rendered',
        'Test Steps': '1. Inspect CSS properties\n2. Compare with Figma',
        'Test Data': 'N/A',
        'Expected Result': 'Colors, fonts, spacing match design',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component responsive on mobile',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Mobile viewport',
        'Test Steps': '1. Load component on mobile\n2. Verify layout',
        'Test Data': 'N/A',
        'Expected Result': 'Component displays correctly on mobile',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component responsive on desktop',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Desktop viewport',
        'Test Steps': '1. Load component on desktop\n2. Verify layout',
        'Test Data': 'N/A',
        'Expected Result': 'Component displays with proper spacing',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component with empty content',
        'Test Type': 'Negative',
        'Pre-Condition': 'Component with no content',
        'Test Steps': '1. Load page with empty component',
        'Test Data': 'N/A',
        'Expected Result': 'Component not rendered, no spacing issues',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component with long text',
        'Test Type': 'Edge',
        'Pre-Condition': 'Component with text content',
        'Test Steps': '1. Add long text\n2. Verify wrapping',
        'Test Data': 'Long text string (500+ chars)',
        'Expected Result': 'Text wraps properly, no overflow',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component accessibility',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Component rendered',
        'Test Steps': '1. Use screen reader\n2. Tab through elements',
        'Test Data': 'N/A',
        'Expected Result': 'All elements accessible and properly labeled',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component color contrast',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Component rendered',
        'Test Steps': '1. Check text/background contrast ratio',
        'Test Data': 'N/A',
        'Expected Result': 'Meets WCAG AA contrast requirements',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component keyboard navigation',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Interactive component',
        'Test Steps': '1. Tab through component\n2. Verify navigation order',
        'Test Data': 'N/A',
        'Expected Result': 'Logical tab order, all elements accessible',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component focus state',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Interactive elements in component',
        'Test Steps': '1. Tab to interactive element\n2. Verify focus visible',
        'Test Data': 'N/A',
        'Expected Result': 'Clear visible focus indicator',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component cross-browser compatibility',
        'Test Type': 'Compatibility',
        'Pre-Condition': 'Component deployed',
        'Test Steps': '1. Test in Chrome, Safari, Firefox, Edge',
        'Test Data': 'N/A',
        'Expected Result': 'Consistent rendering across browsers',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component performance',
        'Test Type': 'Performance',
        'Pre-Condition': 'Page with multiple components',
        'Test Steps': '1. Load page\n2. Check load time',
        'Test Data': 'N/A',
        'Expected Result': 'No noticeable performance degradation',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no console errors on component load',
        'Test Type': 'Regression',
        'Pre-Condition': 'Dev tools open',
        'Test Steps': '1. Load page with component\n2. Check console',
        'Test Data': 'N/A',
        'Expected Result': 'No JS errors logged',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component on different page templates',
        'Test Type': 'Functional',
        'Pre-Condition': 'Component available on multiple templates',
        'Test Steps': '1. Test on different page types',
        'Test Data': 'N/A',
        'Expected Result': 'Component works on all allowed templates',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component style consistency',
        'Test Type': 'UI',
        'Pre-Condition': 'Multiple instances of component',
        'Test Steps': '1. Load multiple instances\n2. Verify styling consistent',
        'Test Data': 'N/A',
        'Expected Result': 'All instances styled identically',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify authoring guide available',
        'Test Type': 'Documentation',
        'Pre-Condition': 'Documentation published',
        'Test Steps': '1. Open authoring guide',
        'Test Data': 'N/A',
        'Expected Result': 'Guide is accessible and complete',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify style guide page exists',
        'Test Type': 'Documentation',
        'Pre-Condition': 'Style guide created',
        'Test Steps': '1. Open style guide page',
        'Test Data': 'N/A',
        'Expected Result': 'All component variations documented',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no layout shift when optional content hidden',
        'Test Type': 'Edge',
        'Pre-Condition': 'Component with optional fields',
        'Test Steps': '1. Hide optional content\n2. Verify no layout shift',
        'Test Data': 'N/A',
        'Expected Result': 'No unexpected layout jumps or gaps',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify component regression on existing pages',
        'Test Type': 'Regression',
        'Pre-Condition': 'Component deployed',
        'Test Steps': '1. Load existing pages with component',
        'Test Data': 'N/A',
        'Expected Result': 'No break in existing functionality',
        'Status': ''
      }
    ];
  }

  generateUniversalTests(summary, startCounter) {
    return [
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify no console errors on page load',
        'Test Type': 'Regression',
        'Pre-Condition': 'Dev tools open',
        'Test Steps': '1. Load page\n2. Inspect console for errors',
        'Test Data': 'N/A',
        'Expected Result': 'No JS errors logged',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify cross-browser compatibility',
        'Test Type': 'Compatibility',
        'Pre-Condition': 'Multiple browsers available',
        'Test Steps': '1. Test in Chrome, Safari, Firefox, Edge',
        'Test Data': 'N/A',
        'Expected Result': 'Consistent behavior across browsers',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify mobile responsive behavior',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Mobile viewport available',
        'Test Steps': '1. Resize to mobile width\n2. Verify layout',
        'Test Data': 'N/A',
        'Expected Result': 'Layout adjusts properly for mobile',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify desktop responsive behavior',
        'Test Type': 'Responsive',
        'Pre-Condition': 'Desktop viewport',
        'Test Steps': '1. Load on desktop\n2. Verify layout',
        'Test Data': 'N/A',
        'Expected Result': 'Layout displays correctly on desktop',
        'Status': ''
      },
      {
        TC_ID: `TC_${String(startCounter++).padStart(3, '0')}`,
        'Test Scenario': 'Verify accessibility compliance',
        'Test Type': 'Accessibility',
        'Pre-Condition': 'Accessibility checker available',
        'Test Steps': '1. Run accessibility scan',
        'Test Data': 'N/A',
        'Expected Result': 'No critical or major accessibility issues',
        'Status': ''
      }
    ];
  }

  escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  async createExcelFile(testCases, ticketKey, summary) {
    const ExcelJS = require('exceljs');
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
      size: 11
    };

    const border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Row 1: Test ID
    worksheet.getCell('A1').value = 'Test  ID';
    worksheet.getCell('B1').value = ticketKey;
    worksheet.getRow(1).height = 20;

    // Row 2: Test Name
    worksheet.getCell('A2').value = 'Test Name';
    worksheet.getCell('B2').value = summary;
    worksheet.getRow(2).height = 20;

    // Row 3: Tested URL
    worksheet.getCell('A3').value = 'Tested URL';
    worksheet.getRow(3).height = 20;

    // Row 4: Figma Design
    worksheet.getCell('A4').value = 'Figma Design';
    worksheet.getRow(4).height = 20;

    // Row 5: Blank row
    worksheet.getRow(5).height = 15;

    // Row 6: Column headers
    const headers = ['TC_ID', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Status', 'Pass/Fail'];
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(6, index + 1);
      cell.value = header;
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
      cell.border = border;
    });
    worksheet.getRow(6).height = 25;

    // Data rows
    testCases.forEach((testCase, rowIndex) => {
      const rowNum = rowIndex + 7;
      headers.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNum, colIndex + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = border;
      });
      worksheet.getRow(rowNum).height = 60;

      // Add blank row every 6 test cases for grouping (like reference files)
      if ((rowIndex + 1) % 6 === 0 && rowIndex < testCases.length - 1) {
        const blankRowNum = rowNum + 1;
        worksheet.getRow(blankRowNum).height = 15;
        headers.forEach((header, colIndex) => {
          worksheet.getCell(blankRowNum, colIndex + 1).border = border;
        });
      }
    });

    // Set column widths
    const columnWidths = {
      'A': 12,  // TC_ID
      'B': 30,  // Test Scenario
      'C': 15,  // Test Type
      'D': 18,  // Pre-Condition
      'E': 25,  // Test Steps
      'F': 15,  // Test Data
      'G': 25,  // Expected Result
      'H': 12,  // Status
      'I': 12   // Pass/Fail
    };

    Object.keys(columnWidths).forEach(col => {
      worksheet.getColumn(col).width = columnWidths[col];
    });

    // ============ ADD SUMMARY SECTION ============
    const summaryStartRow = headers.length + testCases.length + 5;

    // Add empty rows
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Count test cases by type
    const testTypeCount = {};
    testCases.forEach(tc => {
      const type = tc['Test Type'] || 'Unknown';
      testTypeCount[type] = (testTypeCount[type] || 0) + 1;
    });

    // Add summary header
    const summaryHeaderRow = worksheet.addRow(['TEST CASE SUMMARY']);
    summaryHeaderRow.getCell(1).font = { bold: true, size: 12 };
    summaryHeaderRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDDEBF7' }
    };

    // Add empty row
    worksheet.addRow([]);

    // Add total
    const totalRow = worksheet.addRow(['Total Test Cases', testCases.length]);
    totalRow.getCell(1).font = { bold: true };

    // Add breakdown by type
    const sortedTypes = Object.keys(testTypeCount).sort();
    sortedTypes.forEach(type => {
      const row = worksheet.addRow([`${type} Test Cases`, testTypeCount[type]]);
      row.getCell(1).font = { bold: false };
    });

    // Save file
    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_${safeFileName}.xlsx`;
    const filepath = path.join(this.outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  async generate(ticketKey) {
    try {
      const ticket = await this.fetchTicket(ticketKey);
      const { testCases, ticketKey: responseKey, summary } = this.generateTestCases(ticket);
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
  console.log('Usage: node jira_testcase_generator_v2.js <TICKET_KEY_1> [TICKET_KEY_2] ...');
  console.log('');
  console.log('Examples:');
  console.log('  node jira_testcase_generator_v2.js GAAM-618');
  console.log('  node jira_testcase_generator_v2.js GAAM-618 GAAM-619');
  process.exit(1);
}

const ticketKeys = args.map(key => key.toUpperCase());
const generator = new TestCaseGenerator();

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
      results.push({ ticketKey, status: '✓ Success', ...result });
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
      console.log(`   Test Cases: ${result.testCaseCount}`);
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
