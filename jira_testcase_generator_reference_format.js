#!/usr/bin/env node

/**
 * TEST CASE GENERATOR - Reference Format
 * ============================================
 * Generates test cases in EXACT reference file format (GAAM-524)
 * - Same column headers
 * - Same test step formatting (bullet points)
 * - Same summary layout
 * - Professional Excel formatting
 */

const axios = require('axios');
const https = require('https');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const JIRA_BASE_URL = 'https://bounteous.jira.com';
const JIRA_EMAIL = 'am.puneeth@bounteous.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

function generateTestCases(ticket) {
  const testCases = [];
  let tcId = 1;

  // ========== POSITIVE TESTS (7 tests) ==========
  const positiveTests = [
    {
      'Test Scenario': 'Verify component renders correctly',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Navigate to component page\n• Wait for page to load\n• Verify component is visible\n• Verify no console errors',
      'Test Data': 'Valid component URL',
      'Expected Result': 'Component displays correctly',
    },
    {
      'Test Scenario': 'Verify all required fields display',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check header bar displays\n• Verify all required labels visible\n• Check all input fields present\n• Verify buttons and interactive elements',
      'Test Data': 'Page with complete data',
      'Expected Result': 'All required fields display correctly',
    },
    {
      'Test Scenario': 'Verify styling matches Figma design',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Open Figma design reference\n• Compare colors (purple header)\n• Check spacing and padding\n• Verify typography matches',
      'Test Data': 'Figma design URL',
      'Expected Result': 'UI matches design exactly',
    },
    {
      'Test Scenario': 'Verify interactive elements work',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Click on path links\n• Verify navigation works\n• Check button interactions\n• Verify no JavaScript errors',
      'Test Data': 'User input on interactive elements',
      'Expected Result': 'All interactions work as expected',
    },
    {
      'Test Scenario': 'Verify content hierarchy',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Verify header is prominent\n• Check path hierarchy\n• Verify bullet points indentation\n• Check statistical block formatting',
      'Test Data': 'Standard component display',
      'Expected Result': 'Content hierarchy is clear',
    },
    {
      'Test Scenario': 'Verify form submission and data persistence',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Fill all required form fields\n• Submit the form\n• Verify success message\n• Check data is persisted',
      'Test Data': 'Valid form data',
      'Expected Result': 'Form submits successfully',
    },
    {
      'Test Scenario': 'Verify responsive behavior',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test on multiple viewports\n• Verify layout adapts correctly\n• Check no horizontal scrolling\n• Verify content readable',
      'Test Data': 'Multiple viewport sizes',
      'Expected Result': 'Layout responsive; Content readable',
    },
  ];

  positiveTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Positive',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== NEGATIVE TESTS (7 tests) ==========
  const negativeTests = [
    {
      'Test Scenario': 'Verify handling of empty inputs',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Pass null/undefined path name\n• Pass empty description\n• Pass empty bullet list\n• Verify graceful degradation',
      'Test Data': 'null, undefined, empty strings',
      'Expected Result': 'Component handles gracefully',
    },
    {
      'Test Scenario': 'Verify XSS/HTML injection prevention',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Input HTML tags in path name\n• Input script tags in description\n• Input malicious content\n• Check content is escaped',
      'Test Data': '<script>alert("XSS")</script>, <img src=x onerror=alert(1)>',
      'Expected Result': 'Content is escaped and safe',
    },
    {
      'Test Scenario': 'Verify handling of very long text',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Enter path name 200+ characters\n• Enter description 500+ characters\n• Verify no layout break\n• Check text truncation',
      'Test Data': '200-500+ character strings',
      'Expected Result': 'Layout remains intact',
    },
    {
      'Test Scenario': 'Verify special characters handling',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Use special chars: !@#$%^&*()\n• Use Unicode characters\n• Use emoji\n• Verify correct rendering',
      'Test Data': '!@#$%^&*(), Unicode, emoji',
      'Expected Result': 'Characters display correctly',
    },
    {
      'Test Scenario': 'Verify handling of missing optional fields',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Omit path description\n• Remove optional elements\n• Remove bullet points\n• Verify component still works',
      'Test Data': 'Missing optional fields',
      'Expected Result': 'Component functions without optional fields',
    },
    {
      'Test Scenario': 'Verify large dataset handling',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Load 100+ bullet points\n• Load 50+ path levels\n• Check performance\n• Verify no memory leaks',
      'Test Data': 'Large arrays of data',
      'Expected Result': 'Component handles large data',
    },
    {
      'Test Scenario': 'Verify invalid format handling',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Submit invalid data formats\n• Test with malformed JSON\n• Test with incorrect data types\n• Verify error handling',
      'Test Data': 'Invalid formats, malformed data',
      'Expected Result': 'Errors handled gracefully',
    },
  ];

  negativeTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Negative',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== EDGE CASE TESTS (7 tests) ==========
  const edgeCaseTests = [
    {
      'Test Scenario': 'Verify single character inputs',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Enter single char path name\n• Enter single char description\n• Verify rendering\n• Check spacing',
      'Test Data': 'Single character strings',
      'Expected Result': 'Renders correctly',
    },
    {
      'Test Scenario': 'Verify Unicode and international characters',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Input Chinese characters\n• Input Arabic text\n• Input RTL languages\n• Verify layout handles correctly',
      'Test Data': 'Chinese, Arabic, Unicode text',
      'Expected Result': 'International text displays correctly',
    },
    {
      'Test Scenario': 'Verify whitespace handling',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Input leading/trailing spaces\n• Input multiple spaces between words\n• Input tabs and line breaks\n• Verify trimming works',
      'Test Data': 'Spaces around text, multiple spaces',
      'Expected Result': 'Whitespace handled correctly',
    },
    {
      'Test Scenario': 'Verify mixed optional and required fields',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Combine all field variations\n• Mix required + some optional\n• Mix required + all optional\n• Verify flexibility',
      'Test Data': 'Various field combinations',
      'Expected Result': 'All combinations work',
    },
    {
      'Test Scenario': 'Verify numerical boundary values',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test min array size (0 items)\n• Test max practical array size\n• Test negative numbers\n• Verify handling',
      'Test Data': '0, -1, 999999',
      'Expected Result': 'Handles boundary values',
    },
    {
      'Test Scenario': 'Verify case sensitivity',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Input uppercase path names\n• Input lowercase names\n• Input mixed case\n• Verify consistent handling',
      'Test Data': 'PATH, path, Path',
      'Expected Result': 'Case handled appropriately',
    },
    {
      'Test Scenario': 'Verify concurrent user handling',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Open form in multiple tabs\n• Edit same record simultaneously\n• Submit changes\n• Verify conflict handling',
      'Test Data': 'Concurrent user sessions',
      'Expected Result': 'Concurrent edits handled',
    },
  ];

  edgeCaseTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Edge Case',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== ACCESSIBILITY TESTS (7 tests) ==========
  const accessibilityTests = [
    {
      'Test Scenario': 'Verify WCAG 2.2 semantic HTML structure',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Inspect HTML elements\n• Verify heading hierarchy (h1-h6)\n• Check list markup\n• Verify semantic tags used',
      'Test Data': 'HTML inspection tools (DevTools)',
      'Expected Result': 'Semantic HTML structure correct',
    },
    {
      'Test Scenario': 'Verify color contrast compliance (4.5:1 WCAG AA)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Use color contrast checker\n• Test purple header vs text\n• Test all text colors\n• Verify >= 4.5:1 ratio',
      'Test Data': 'Contrast checking tool, Color palette',
      'Expected Result': 'All contrasts >= 4.5:1',
    },
    {
      'Test Scenario': 'Verify screen reader compatibility',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test with NVDA/JAWS\n• Verify text alternatives\n• Check aria-labels\n• Verify reading order',
      'Test Data': 'Screen reader software (NVDA)',
      'Expected Result': 'Content readable via screen reader',
    },
    {
      'Test Scenario': 'Verify keyboard navigation (Tab order)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Navigate using Tab key only\n• Verify logical tab order\n• Check focus indicators\n• Test all interactive elements',
      'Test Data': 'Keyboard (Tab/Shift+Tab)',
      'Expected Result': 'Fully keyboard navigable',
    },
    {
      'Test Scenario': 'Verify 200% zoom readability',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Zoom page to 200%\n• Verify no content cut off\n• Check text remains readable\n• Verify layout flows',
      'Test Data': 'Browser zoom at 200%',
      'Expected Result': 'Content readable at 200% zoom',
    },
    {
      'Test Scenario': 'Verify no critical accessibility violations',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Run Level Access scan\n• Check for WCAG violations\n• Verify no errors\n• Document any warnings',
      'Test Data': 'Level Access scan tool',
      'Expected Result': 'No critical issues found',
    },
    {
      'Test Scenario': 'Verify mobile touch target sizes (44x44px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test on actual mobile device\n• Check all clickable areas\n• Verify each >= 44x44px\n• Check spacing between targets',
      'Test Data': 'WCAG 2.5.5: 44x44px minimum',
      'Expected Result': 'Touch targets meet WCAG minimum',
    },
  ];

  accessibilityTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Accessibility',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== RESPONSIVE TESTS (9 tests) ==========
  const responsiveTests = [
    {
      'Test Scenario': 'Verify mobile small (320px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 320x568\n• Verify single-column layout\n• Verify full-width\n• Check readable text',
      'Test Data': '320x568px (Mobile small)',
      'Expected Result': 'Displays correctly on 320px',
    },
    {
      'Test Scenario': 'Verify mobile large (414px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 414x896\n• Verify single column layout\n• Verify spacing adequate\n• Check readable',
      'Test Data': '414x896px (Mobile large)',
      'Expected Result': 'Displays correctly on 414px',
    },
    {
      'Test Scenario': 'Verify tablet portrait (768px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 768x1024\n• Verify optimized layout\n• Check element spacing\n• Verify readable',
      'Test Data': '768x1024px (Tablet Portrait)',
      'Expected Result': 'Tablet layout correct',
    },
    {
      'Test Scenario': 'Verify tablet landscape (1024px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 1024x768\n• Verify horizontal layout\n• Check spacing correct\n• Verify readable',
      'Test Data': '1024x768px (Tablet Landscape)',
      'Expected Result': 'Tablet landscape displays correctly',
    },
    {
      'Test Scenario': 'Verify desktop standard (1366px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 1366x768\n• Verify layout optimized\n• Verify spacing\n• Check readable',
      'Test Data': '1366x768px (Desktop)',
      'Expected Result': 'Desktop standard displays correctly',
    },
    {
      'Test Scenario': 'Verify desktop large (1920px)',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 1920x1080\n• Verify two-column layout\n• Check statistics LEFT, bullets RIGHT\n• Verify optimal spacing',
      'Test Data': '1920x1080px (Desktop large)',
      'Expected Result': 'Large desktop displays correctly',
    },
    {
      'Test Scenario': 'Verify ultra wide (2560px) - 4K',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Set viewport 2560x1440\n• Verify layout correct\n• Verify not too stretched\n• Verify readable',
      'Test Data': '2560x1440px (Ultra wide 4K)',
      'Expected Result': 'Ultra wide displays correctly',
    },
    {
      'Test Scenario': 'Verify layout transition points',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test 768px to 1024px transition\n• Test 1024px to 1920px transition\n• Verify smooth breakpoints\n• Check no layout jump',
      'Test Data': 'Incremental viewport changes',
      'Expected Result': 'Smooth transitions at breakpoints',
    },
    {
      'Test Scenario': 'Verify full-width content display',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Verify component uses full width\n• Check padding consistency\n• Verify margins appropriate\n• Check not stretched',
      'Test Data': 'Various screen sizes',
      'Expected Result': 'Full-width display correct',
    },
  ];

  responsiveTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Responsive',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== CROSS-BROWSER TESTS (7 tests) ==========
  const compatibilityTests = [
    {
      'Test Scenario': 'Verify Chrome desktop rendering',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Open in Chrome latest\n• Verify all elements display\n• Check styling correct\n• Verify no console errors',
      'Test Data': 'Chrome browser (desktop)',
      'Expected Result': 'Renders correctly in Chrome',
    },
    {
      'Test Scenario': 'Verify Firefox desktop rendering',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Open in Firefox latest\n• Verify styling consistent\n• Check layout correct\n• Verify functionality',
      'Test Data': 'Firefox browser (desktop)',
      'Expected Result': 'Renders correctly in Firefox',
    },
    {
      'Test Scenario': 'Verify Safari desktop rendering',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Open in Safari latest\n• Check -webkit prefixes\n• Verify styling correct\n• Check all features work',
      'Test Data': 'Safari browser (desktop)',
      'Expected Result': 'Renders correctly in Safari',
    },
    {
      'Test Scenario': 'Verify Edge desktop rendering',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Open in Edge latest\n• Verify compatibility\n• Check styling\n• Test functionality',
      'Test Data': 'Microsoft Edge browser',
      'Expected Result': 'Renders correctly in Edge',
    },
    {
      'Test Scenario': 'Verify Safari mobile rendering',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test on iPhone Safari\n• Verify responsive layout\n• Check touch interactions\n• Verify performance',
      'Test Data': 'iPhone Safari mobile',
      'Expected Result': 'Works correctly on Safari mobile',
    },
    {
      'Test Scenario': 'Verify Chrome mobile rendering',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Test on Chrome mobile\n• Verify responsive behavior\n• Check touch targets\n• Verify no zoom needed',
      'Test Data': 'Chrome mobile browser',
      'Expected Result': 'Works correctly on Chrome mobile',
    },
    {
      'Test Scenario': 'Verify consistent behavior across browsers',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Compare rendering across browsers\n• Check for browser-specific issues\n• Verify consistent user experience\n• Document differences',
      'Test Data': 'Multiple browser versions',
      'Expected Result': 'Behavior consistent across browsers',
    },
  ];

  compatibilityTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Cross-Browser',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== UI/UX TESTS (7 tests) ==========
  const uiTests = [
    {
      'Test Scenario': 'Verify purple header bar styling',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check header background color\n• Verify hex #6B46C1 or equivalent\n• Check padding/spacing\n• Verify text color white',
      'Test Data': 'Purple header (#6B46C1)',
      'Expected Result': 'Header styled correctly',
    },
    {
      'Test Scenario': 'Verify typography and font sizes',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check title font size\n• Verify body text size\n• Check line spacing\n• Verify font family consistent',
      'Test Data': 'Figma design specs',
      'Expected Result': 'Typography matches spec',
    },
    {
      'Test Scenario': 'Verify spacing and padding consistency',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Measure margins between elements\n• Check padding inside containers\n• Verify whitespace balance\n• Compare with Figma',
      'Test Data': 'Spacing measurements',
      'Expected Result': 'Spacing matches design',
    },
    {
      'Test Scenario': 'Verify bullet point formatting',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check bullet symbol\n• Verify indentation\n• Check line height\n• Verify alignment',
      'Test Data': 'Bullet list component',
      'Expected Result': 'Bullet formatting correct',
    },
    {
      'Test Scenario': 'Verify statistical block display',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check number display\n• Verify label text\n• Check icon display\n• Verify alignment in layout',
      'Test Data': 'Statistics block data',
      'Expected Result': 'Statistics display correctly',
    },
    {
      'Test Scenario': 'Verify borders and dividers',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check for dividers between sections\n• Verify border colors\n• Check border width\n• Verify alignment',
      'Test Data': 'Component layout',
      'Expected Result': 'Borders display correctly',
    },
    {
      'Test Scenario': 'Verify visual hierarchy',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check title prominence\n• Verify emphasis on key elements\n• Check visual weight\n• Verify focus areas clear',
      'Test Data': 'Visual design review',
      'Expected Result': 'Hierarchy is clear',
    },
  ];

  uiTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'UI',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== PERFORMANCE TESTS (3 tests) ==========
  const performanceTests = [
    {
      'Test Scenario': 'Verify page load time performance',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Load component page\n• Measure load time\n• Check network requests\n• Verify < 3 second load',
      'Test Data': 'Network throttling (3G, 4G)',
      'Expected Result': 'Page loads < 3 seconds',
    },
    {
      'Test Scenario': 'Verify large dataset performance',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Load 1000+ records\n• Check rendering performance\n• Verify no lag\n• Check memory usage',
      'Test Data': 'Large dataset (1000+ items)',
      'Expected Result': 'Handles large data efficiently',
    },
    {
      'Test Scenario': 'Verify image optimization',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check image sizes\n• Verify responsive images\n• Check lazy loading\n• Verify format optimization',
      'Test Data': 'Image files and assets',
      'Expected Result': 'Images optimized and responsive',
    },
  ];

  performanceTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Performance',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== INTEGRATION TESTS (3 tests) ==========
  const integrationTests = [
    {
      'Test Scenario': 'Verify API integration',
      'Pre-Condition': 'API endpoint available',
      'Test Steps': '• Call API endpoint\n• Verify response format\n• Check data transformation\n• Verify UI updates',
      'Test Data': 'API endpoint, request data',
      'Expected Result': 'API integration works correctly',
    },
    {
      'Test Scenario': 'Verify database persistence',
      'Pre-Condition': 'Database connection active',
      'Test Steps': '• Submit form data\n• Verify database entry\n• Retrieve data\n• Verify data integrity',
      'Test Data': 'Form data, database connection',
      'Expected Result': 'Data persisted correctly in database',
    },
    {
      'Test Scenario': 'Verify third-party service integration',
      'Pre-Condition': 'Third-party services configured',
      'Test Steps': '• Call third-party API\n• Verify integration working\n• Check error handling\n• Verify data sync',
      'Test Data': 'Third-party service credentials',
      'Expected Result': 'Third-party services integrated correctly',
    },
  ];

  integrationTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Integration',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== SECURITY TESTS (4 tests) ==========
  const securityTests = [
    {
      'Test Scenario': 'Verify SQL injection prevention',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Input SQL injection strings\n• Test with quotes and semicolons\n• Verify parameterized queries\n• Check no database errors exposed',
      'Test Data': "'; DROP TABLE--; SELECT * FROM;",
      'Expected Result': 'SQL injection prevented',
    },
    {
      'Test Scenario': 'Verify CSRF attack prevention',
      'Pre-Condition': 'User is logged in',
      'Test Steps': '• Check CSRF tokens present\n• Verify token validation\n• Test cross-origin requests\n• Check same-site cookies',
      'Test Data': 'CSRF token verification',
      'Expected Result': 'CSRF tokens validated',
    },
    {
      'Test Scenario': 'Verify secure authentication',
      'Pre-Condition': 'User authentication configured',
      'Test Steps': '• Test password hashing\n• Verify SSL/TLS usage\n• Check no credentials in logs\n• Verify secure session handling',
      'Test Data': 'User credentials',
      'Expected Result': 'Credentials secure',
    },
    {
      'Test Scenario': 'Verify data encryption',
      'Pre-Condition': 'Encryption configured',
      'Test Steps': '• Verify sensitive data encrypted\n• Check encryption algorithm\n• Test key management\n• Verify no plaintext storage',
      'Test Data': 'Sensitive data (PII)',
      'Expected Result': 'Data encrypted at rest and in transit',
    },
  ];

  securityTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Security',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  // ========== BOUNDARY VALUE TESTS (26 tests) ==========
  const boundaryTests = [
    // Numeric (8)
    {
      'Test Scenario': 'Verify minimum numeric value (0)',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter minimum value (0)\n• Verify input accepted\n• Check processing correct\n• Verify no errors',
      'Test Data': '0',
      'Expected Result': 'Minimum values handled correctly',
    },
    {
      'Test Scenario': 'Verify maximum numeric value',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter maximum value\n• Verify input accepted\n• Check processing correct\n• Verify overflow prevention',
      'Test Data': '999999, 2147483647',
      'Expected Result': 'Maximum values handled correctly',
    },
    {
      'Test Scenario': 'Verify zero value in calculations',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter zero\n• Verify accepted\n• Check calculations\n• Verify no division errors',
      'Test Data': '0',
      'Expected Result': 'Zero handled appropriately',
    },
    {
      'Test Scenario': 'Verify negative number handling',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter negative values\n• Verify accepted or rejected per spec\n• Check processing\n• Verify correct handling',
      'Test Data': '-1, -100, -999',
      'Expected Result': 'Negative numbers handled per spec',
    },
    {
      'Test Scenario': 'Verify decimal precision',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter decimal values\n• Verify precision maintained\n• Check rounding\n• Verify calculations accurate',
      'Test Data': '0.1, 3.14159, 99.99',
      'Expected Result': 'Decimals handled with correct precision',
    },
    {
      'Test Scenario': 'Verify very large numbers',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter very large numbers\n• Verify no overflow\n• Check scientific notation\n• Verify calculations',
      'Test Data': '999999999999, 1e10',
      'Expected Result': 'Large numbers handled without overflow',
    },
    {
      'Test Scenario': 'Verify leading zeros in numbers',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter numbers with leading zeros\n• Verify trimmed correctly\n• Check stored value\n• Verify display',
      'Test Data': '007, 0123',
      'Expected Result': 'Leading zeros handled correctly',
    },
    {
      'Test Scenario': 'Verify scientific notation',
      'Pre-Condition': 'Numeric field exists',
      'Test Steps': '• Enter scientific notation\n• Verify parsed correctly\n• Check converted to number\n• Verify calculations',
      'Test Data': '1e5, 1.5e-3',
      'Expected Result': 'Scientific notation handled correctly',
    },
    // String (5)
    {
      'Test Scenario': 'Verify empty string handling',
      'Pre-Condition': 'String field exists',
      'Test Steps': '• Submit empty string\n• Verify validation\n• Check error message\n• Verify required field handling',
      'Test Data': '""',
      'Expected Result': 'Empty strings handled with validation',
    },
    {
      'Test Scenario': 'Verify single character string',
      'Pre-Condition': 'String field exists',
      'Test Steps': '• Enter single character\n• Verify accepted\n• Check storage\n• Verify display correct',
      'Test Data': 'a, 1, !',
      'Expected Result': 'Single characters handled correctly',
    },
    {
      'Test Scenario': 'Verify maximum string length',
      'Pre-Condition': 'String field with max length exists',
      'Test Steps': '• Enter string at max length\n• Verify truncation or error\n• Check database limit\n• Verify validation',
      'Test Data': '255 chars, 1000 chars, 5000 chars',
      'Expected Result': 'String length limits enforced',
    },
    {
      'Test Scenario': 'Verify whitespace-only string',
      'Pre-Condition': 'String field exists',
      'Test Steps': '• Enter spaces only\n• Verify trimming\n• Check validation\n• Verify handling',
      'Test Data': '   , \t\t, \n',
      'Expected Result': 'Whitespace-only strings trimmed or rejected',
    },
    {
      'Test Scenario': 'Verify Unicode and special characters',
      'Pre-Condition': 'String field exists',
      'Test Steps': '• Enter Unicode characters\n• Enter emoji\n• Enter mixed encodings\n• Verify stored correctly',
      'Test Data': '你好, مرحبا, 🎉',
      'Expected Result': 'Unicode and UTF-8 handled correctly',
    },
    // Date (4)
    {
      'Test Scenario': 'Verify minimum date value',
      'Pre-Condition': 'Date field exists',
      'Test Steps': '• Enter minimum date\n• Verify accepted\n• Check format\n• Verify processing',
      'Test Data': '1900-01-01, 1970-01-01',
      'Expected Result': 'Minimum dates handled correctly',
    },
    {
      'Test Scenario': 'Verify maximum date value',
      'Pre-Condition': 'Date field exists',
      'Test Steps': '• Enter maximum date\n• Verify accepted\n• Check processing\n• Verify no overflow',
      'Test Data': '2099-12-31, 9999-12-31',
      'Expected Result': 'Maximum dates handled correctly',
    },
    {
      'Test Scenario': 'Verify leap year handling',
      'Pre-Condition': 'Date field exists',
      'Test Steps': '• Enter leap year date (Feb 29)\n• Test 2000 (leap), 1900 (non-leap)\n• Verify validation\n• Check calculations',
      'Test Data': '2000-02-29, 1900-02-29, 2024-02-29',
      'Expected Result': 'Leap year dates validated correctly',
    },
    {
      'Test Scenario': 'Verify invalid date format',
      'Pre-Condition': 'Date field exists',
      'Test Steps': '• Enter invalid dates\n• Test wrong format\n• Verify error message\n• Check validation',
      'Test Data': '32-13-2024, 13/32/2024',
      'Expected Result': 'Invalid dates rejected with validation',
    },
    // Array (3)
    {
      'Test Scenario': 'Verify empty array handling',
      'Pre-Condition': 'Array field exists',
      'Test Steps': '• Submit empty array\n• Verify handling\n• Check display\n• Verify no errors',
      'Test Data': '[]',
      'Expected Result': 'Empty arrays handled correctly',
    },
    {
      'Test Scenario': 'Verify single item array',
      'Pre-Condition': 'Array field exists',
      'Test Steps': '• Submit array with one item\n• Verify accepted\n• Check processing\n• Verify display',
      'Test Data': '[1], ["item"]',
      'Expected Result': 'Single-item arrays handled correctly',
    },
    {
      'Test Scenario': 'Verify maximum array size',
      'Pre-Condition': 'Array field exists',
      'Test Steps': '• Submit very large array\n• Check memory impact\n• Verify performance\n• Check limits enforced',
      'Test Data': '1000+ items, 10000+ items',
      'Expected Result': 'Array size limits enforced',
    },
    // Null/Undefined (2)
    {
      'Test Scenario': 'Verify null value handling',
      'Pre-Condition': 'Field allows null',
      'Test Steps': '• Submit null value\n• Verify accepted\n• Check storage\n• Verify retrieval',
      'Test Data': 'null',
      'Expected Result': 'Null values handled correctly',
    },
    {
      'Test Scenario': 'Verify undefined value handling',
      'Pre-Condition': 'Field defined',
      'Test Steps': '• Submit undefined value\n• Verify handling\n• Check default value\n• Verify error handling',
      'Test Data': 'undefined, missing field',
      'Expected Result': 'Undefined values handled with defaults',
    },
  ];

  boundaryTests.forEach(test => {
    testCases.push({
      TC_ID: `TC_${String(tcId).padStart(3, '0')}`,
      'Test Type': 'Boundary Value',
      ...test,
      'Status': '',
    });
    tcId++;
  });

  return testCases;
}

async function generateExcelFile(tickets) {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  for (const ticket of tickets) {
    try {
      console.log(`\n[${tickets.indexOf(ticket) + 1}/${tickets.length}] Processing: ${ticket}`);

      let ticketData;
      try {
        const response = await axios.get(
          `${JIRA_BASE_URL}/rest/api/2/issue/${ticket}`,
          {
            auth: { username: JIRA_EMAIL, password: JIRA_API_TOKEN },
            httpsAgent,
          }
        );
        ticketData = response.data;
      } catch (error) {
        console.log('⚠️  JIRA unreachable, using mock data');
        ticketData = { key: ticket, fields: { summary: 'Component Feature Implementation' } };
      }

      const testCases = generateTestCases(ticket);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Test Cases');

      // ============ SET UP COLUMNS ============
      const columns = [
        { header: 'TC_ID', key: 'TC_ID', width: 12 },
        { header: 'Test Type', key: 'Test Type', width: 18 },
        { header: 'Test Scenario', key: 'Test Scenario', width: 40 },
        { header: 'Pre-Condition', key: 'Pre-Condition', width: 35 },
        { header: 'Test Steps', key: 'Test Steps', width: 50 },
        { header: 'Test Data', key: 'Test Data', width: 30 },
        { header: 'Expected Result', key: 'Expected Result', width: 35 },
        { header: 'Status', key: 'Status', width: 12 },
      ];

      worksheet.columns = columns;

      // ============ STYLE HEADER ============
      const headerRow = worksheet.getRow(1);
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      headerRow.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };

      // ============ ADD TEST CASES ============
      testCases.forEach((testCase, index) => {
        const row = worksheet.addRow(testCase);
        row.alignment = { vertical: 'top', wrapText: true };
        row.height = 60;

        if (index % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' },
          };
        }
      });

      // ============ ADD EMPTY ROWS ============
      worksheet.addRow([]);
      worksheet.addRow([]);

      // ============ ADD SUMMARY ============
      const summaryStartRow = testCases.length + 4;
      const summaryRows = [
        ['TEST CASE SUMMARY'],
        [],
        ['Total Test Cases', testCases.length],
        ['Positive Test Cases', testCases.filter(t => t['Test Type'] === 'Positive').length],
        ['Negative Test Cases', testCases.filter(t => t['Test Type'] === 'Negative').length],
        ['Edge Case Test Cases', testCases.filter(t => t['Test Type'] === 'Edge Case').length],
        ['Accessibility Test Cases', testCases.filter(t => t['Test Type'] === 'Accessibility').length],
        ['Responsive Test Cases', testCases.filter(t => t['Test Type'] === 'Responsive').length],
        ['Cross-Browser Test Cases', testCases.filter(t => t['Test Type'] === 'Cross-Browser').length],
        ['UI Test Cases', testCases.filter(t => t['Test Type'] === 'UI').length],
        ['Security Test Cases', testCases.filter(t => t['Test Type'] === 'Security').length],
        ['Performance Test Cases', testCases.filter(t => t['Test Type'] === 'Performance').length],
        ['Integration Test Cases', testCases.filter(t => t['Test Type'] === 'Integration').length],
        ['Boundary Value Test Cases', testCases.filter(t => t['Test Type'] === 'Boundary Value').length],
      ];

      summaryRows.forEach((summaryRow, index) => {
        const row = worksheet.addRow(summaryRow);
        if (index === 0) {
          row.font = { bold: true, size: 12 };
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDDEBF7' },
          };
        } else if (index > 1) {
          if (index % 2 === 0) {
            row.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF2F2F2' },
            };
          }
        }
      });

      // ============ SAVE FILE ============
      const description = ticketData.fields.summary.substring(0, 40).replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${ticket}_REFERENCE_FORMAT_${description}.xlsx`;
      const filePath = path.join(__dirname, 'GA_testcases', fileName);

      fs.mkdirSync(path.join(__dirname, 'GA_testcases'), { recursive: true });
      await workbook.xlsx.writeFile(filePath);

      console.log(`✓ Excel file created: ${fileName}`);
      console.log(`✓ ${ticket} - Generated ${testCases.length} test cases`);
      console.log(`  Breakdown:`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Positive').length} Positive Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Negative').length} Negative Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Edge Case').length} Edge Case Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Security').length} Security Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Accessibility').length} Accessibility Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Responsive').length} Responsive Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Cross-Browser').length} Cross-Browser Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'UI').length} UI Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Performance').length} Performance Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Integration').length} Integration Tests`);
      console.log(`    • ${testCases.filter(t => t['Test Type'] === 'Boundary Value').length} Boundary Value Tests`);
    } catch (error) {
      console.error(`✗ Error processing ${ticket}:`, error.message);
    }
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('\nUsage: node jira_testcase_generator_reference_format.js GAAM-933');
  console.log('       node jira_testcase_generator_reference_format.js GAAM-933 GAAM-524 GAAM-687\n');
  process.exit(1);
}

console.log('==========================================================================================');
console.log('🚀 TEST CASE GENERATOR - Reference Format');
console.log('83 Test Cases | Same Format as GAAM-524 Reference | Professional Excel');
console.log('==========================================================================================\n');

generateExcelFile(args);
