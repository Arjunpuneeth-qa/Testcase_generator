#!/usr/bin/env node

/**
 * UNIVERSAL Intelligent Test Case Generator
 * Dynamically analyzes ANY JIRA ticket and generates comprehensive test cases
 * Coverage: Positive, Negative, Edge Cases, Accessibility, Browser Compatibility, Responsive
 * Works for ANY ticket type - not hardcoded for specific features
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

class UniversalTestCaseGenerator {
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

  // Extract requirements/functionalities from ticket content
  extractRequirements(description, summary) {
    const requirements = [];

    // Look for various requirement patterns
    const lines = description.split('\n');
    let inSection = false;
    let currentSection = '';

    lines.forEach(line => {
      const trimmed = line.trim();

      // Detect section headers
      if (trimmed.match(/^[*h2h3]\s*/) || trimmed.match(/^(Functionality|Acceptance Criteria|Requirements|Features|Behavior|Components?)/i)) {
        inSection = true;
        currentSection = trimmed;
      }

      // Extract requirement lines
      if (trimmed.match(/^[\s*-•]/) && trimmed.length > 10) {
        const req = trimmed.replace(/^[\s*-•]+/, '').trim();
        if (req && !req.startsWith('h') && req.length > 15) {
          requirements.push({
            text: req,
            section: currentSection,
            type: this.categorizeRequirement(req)
          });
        }
      }
    });

    // If no structured requirements found, extract from summary
    if (requirements.length === 0 && summary) {
      requirements.push({
        text: summary,
        section: 'Main Feature',
        type: 'functionality'
      });
    }

    return requirements.slice(0, 10); // Limit to 10 main requirements
  }

  categorizeRequirement(text) {
    if (text.match(/layout|responsive|mobile|desktop|tablet|breakpoint/i)) return 'responsive';
    if (text.match(/color|style|font|appearance|visual|design|figma/i)) return 'ui';
    if (text.match(/header|footer|section|container|component|renders|displays/i)) return 'functional';
    if (text.match(/optional|empty|blank|placeholder/i)) return 'edge';
    if (text.match(/accessibility|wcag|aria|screen reader|contrast/i)) return 'accessibility';
    if (text.match(/semantic|html|structure/i)) return 'structure';
    return 'functional';
  }

  generateTestScenarios(requirements, summary) {
    const testCases = [];
    let tcId = 1;

    // ========================================================================
    // SECTION 1: POSITIVE TESTS - Based on extracted requirements
    // ========================================================================
    console.log('  Generating positive tests...');

    requirements.forEach((req, idx) => {
      // Test 1: Basic positive test for each requirement
      testCases.push({
        TC_ID: tcId++,
        'Category': `Positive - ${req.type.charAt(0).toUpperCase() + req.type.slice(1)}`,
        'Test Scenario': `Verify requirement: ${req.text.substring(0, 60)}`,
        'Test Type': 'Positive',
        'Pre-Condition': 'Feature/component is implemented and configured',
        'Test Steps': `• Log in to AEM Author\n• Navigate to component/feature\n• Configure with valid test data\n• Save and preview\n• Verify: ${req.text.substring(0, 50)}\n• Verify rendering is correct`,
        'Test Data': 'Valid configuration',
        'Expected Result': `${req.text.substring(0, 60)} displays correctly as expected`,
        'Status': '',
        'Browser': 'Chrome/Firefox/Safari/Edge'
      });

      // Test 2: Styling/UI verification if applicable
      if (req.type === 'ui' || req.type === 'functional') {
        testCases.push({
          TC_ID: tcId++,
          'Category': `Positive - UI/Styling`,
          'Test Scenario': `Verify styling for: ${req.text.substring(0, 50)}`,
          'Test Type': 'UI',
          'Pre-Condition': 'Feature rendered',
          'Test Steps': `• Preview component\n• Open DevTools\n• Compare with design specification\n• Verify colors, fonts, spacing\n• Check visual hierarchy`,
          'Test Data': 'Design specification',
          'Expected Result': 'Styling matches design specification exactly',
          'Status': '',
          'Browser': 'Chrome/Firefox/Safari/Edge'
        });
      }

      // Test 3: Responsive behavior if applicable
      if (req.type === 'responsive' || idx === 0) {
        testCases.push({
          TC_ID: tcId++,
          'Category': `Positive - Responsive`,
          'Test Scenario': `Verify responsive behavior for: ${req.text.substring(0, 40)}`,
          'Test Type': 'Responsive',
          'Pre-Condition': 'Feature configured',
          'Test Steps': `• Test on desktop (1920px)\n• Verify layout/display correct\n• Resize to tablet (768px)\n• Verify responsive behavior\n• Resize to mobile (375px)\n• Verify mobile display`,
          'Test Data': 'Multiple breakpoints',
          'Expected Result': 'Feature displays correctly at all breakpoints',
          'Status': '',
          'Browser': 'Chrome/Firefox/Safari/Edge'
        });
      }
    });

    // ========================================================================
    // SECTION 2: NEGATIVE/EDGE CASE TESTS
    // ========================================================================
    console.log('  Generating negative and edge case tests...');

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Negative - Input Validation',
      'Test Scenario': 'Verify component handles empty/null input gracefully',
      'Test Type': 'Negative',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Leave required fields empty\n• Save configuration\n• Preview\n• Verify graceful degradation\n• Verify no errors\n• Check layout stability',
      'Test Data': 'Empty fields',
      'Expected Result': 'Component handles empty input without errors or breaking layout',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Negative - Input Validation',
      'Test Scenario': 'Verify component handles very long text input',
      'Test Type': 'Negative',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Enter text > 200 characters\n• Save and preview\n• Verify text wraps correctly\n• Verify no overflow\n• Check layout on mobile\n• Verify readability',
      'Test Data': 'Long text (200+ chars)',
      'Expected Result': 'Long text handled gracefully with proper wrapping',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Negative - Security',
      'Test Scenario': 'Verify protection against XSS/HTML injection',
      'Test Type': 'Negative',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Enter HTML: "<script>alert()</script>"\n• Enter SVG injection attempt\n• Save and preview\n• Verify HTML escaped\n• Verify no script execution\n• Check source code',
      'Test Data': 'HTML/script injection attempts',
      'Expected Result': 'HTML properly escaped, no XSS vulnerabilities',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Edge Case - Optional Fields',
      'Test Scenario': 'Verify no empty placeholder when optional fields not set',
      'Test Type': 'Edge Case',
      'Pre-Condition': 'Component with optional fields',
      'Test Steps': '• Configure with only required fields\n• Leave optional fields empty\n• Save and preview\n• Verify no placeholder space\n• Verify clean layout\n• Verify alignment correct',
      'Test Data': 'Required fields only',
      'Expected Result': 'Optional fields not shown, no empty space',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Edge Case - Unicode',
      'Test Scenario': 'Verify support for international characters and Unicode',
      'Test Type': 'Edge Case',
      'Priority': 'P2',
      'Pre-Condition': 'Component configured',
      'Test Steps': '• Enter Chinese characters\n• Enter Arabic text\n• Enter emoji\n• Save and preview\n• Verify all display correctly\n• Check encoding issues',
      'Test Data': 'Unicode: Chinese, Arabic, emoji, diacritics',
      'Expected Result': 'Unicode and international characters display correctly',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Edge Case - Boundary',
      'Test Scenario': 'Verify minimum and maximum data values',
      'Test Type': 'Edge Case',
      'Priority': 'P2',
      'Pre-Condition': 'Component with numeric fields',
      'Test Steps': '• Test minimum value: 0, 1, or negative\n• Test maximum value: 999999\n• Test decimal precision\n• Verify formatting\n• Check display on all devices',
      'Test Data': 'Min/Max: 0, negative, 999999, decimals',
      'Expected Result': 'Boundary values handled correctly without errors',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    // ========================================================================
    // SECTION 3: ACCESSIBILITY TESTS
    // ========================================================================
    console.log('  Generating accessibility tests...');

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Accessibility - WCAG',
      'Test Scenario': 'Verify semantic HTML structure',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Component rendered',
      'Test Steps': '• Open DevTools\n• Inspect HTML structure\n• Verify semantic tags (h1, h2, p, ul, li)\n• Verify proper heading hierarchy\n• Verify no duplicate IDs\n• Verify lang attribute present',
      'Test Data': 'N/A',
      'Expected Result': 'Semantic HTML used correctly throughout component',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Accessibility - Color Contrast',
      'Test Scenario': 'Verify WCAG AA color contrast (4.5:1 minimum)',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Component rendered',
      'Test Steps': '• Open DevTools\n• Use color contrast checker\n• Test all text colors against backgrounds\n• Measure contrast ratios\n• Verify >= 4.5:1 for normal text\n• Verify >= 3:1 for large text',
      'Test Data': 'WCAG AA minimum: 4.5:1',
      'Expected Result': 'All text meets WCAG AA color contrast requirements',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Accessibility - Screen Reader',
      'Test Scenario': 'Verify screen reader announces content in logical order',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Screen reader enabled (NVDA/JAWS)',
      'Test Steps': '• Enable screen reader\n• Navigate with Tab key\n• Listen to announcements\n• Verify logical reading order\n• Verify all content announced\n• Verify no duplicate announcements',
      'Test Data': 'N/A',
      'Expected Result': 'Screen reader announces content in logical order',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Accessibility - Zoom',
      'Test Scenario': 'Verify component readable at 200% zoom',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Component rendered',
      'Test Steps': '• Set browser zoom to 200%\n• Verify all content visible\n• Verify no horizontal scroll required\n• Verify text readable\n• Verify layout maintained\n• Check button/link sizes',
      'Test Data': 'Zoom level: 200%',
      'Expected Result': 'Component remains readable and functional at 200% zoom',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Accessibility - Focus',
      'Test Scenario': 'Verify keyboard focus is visible and logical',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Component with interactive elements',
      'Test Steps': '• Navigate with Tab key\n• Verify focus visible on each element\n• Verify focus order logical\n• Verify no focus traps\n• Verify focus style clear and visible',
      'Test Data': 'N/A',
      'Expected Result': 'Keyboard focus is visible and follows logical order',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Accessibility - Level Access',
      'Test Scenario': 'Verify no critical/major issues in Level Access scan',
      'Test Type': 'Accessibility',
      'Pre-Condition': 'Level Access Extension installed',
      'Test Steps': '• Install Level Access Extension\n• Open component page\n• Run accessibility scan\n• Review full report\n• Verify no critical issues\n• Verify no major issues\n• Document any minor issues',
      'Test Data': 'N/A',
      'Expected Result': 'No critical or major accessibility issues flagged',
      'Status': '',
      'Browser': 'Chrome'
    });

    // ========================================================================
    // SECTION 4: RESPONSIVE DESIGN TESTS
    // ========================================================================
    console.log('  Generating responsive design tests...');

    const breakpoints = [
      { name: 'Mobile Small (iPhone SE)', width: 320, height: 568, type: 'Mobile' },
      { name: 'Mobile (iPhone 12/13)', width: 375, height: 667, type: 'Mobile' },
      { name: 'Mobile Large (iPhone 14 Plus)', width: 430, height: 932, type: 'Mobile' },
      { name: 'Tablet Portrait (iPad)', width: 768, height: 1024, type: 'Tablet' },
      { name: 'Tablet Landscape (iPad)', width: 1024, height: 768, type: 'Tablet' },
      { name: 'Desktop (Standard)', width: 1366, height: 768, type: 'Desktop' },
      { name: 'Desktop (Large)', width: 1920, height: 1080, type: 'Desktop' },
      { name: 'Ultra Wide (4K)', width: 2560, height: 1440, type: 'Desktop' }
    ];

    breakpoints.slice(0, 8).forEach(bp => {
      testCases.push({
        TC_ID: tcId++,
        'Category': `Responsive - ${bp.type}`,
        'Test Scenario': `Verify layout at ${bp.name} (${bp.width}x${bp.height}px)`,
        'Test Type': 'Responsive',
        'Pre-Condition': 'Component configured with full content',
        'Test Steps': `• Resize to ${bp.width}x${bp.height}px\n• Verify ALL content visible (no horizontal scroll)\n• Verify layout is correct for ${bp.type}\n• Check text readable (min 12px on mobile)\n• Verify images/icons scale properly\n• Check spacing and padding appropriate\n• Verify no overflow or truncation\n• Test on actual ${bp.type.toLowerCase()} device if available`,
        'Test Data': `Viewport: ${bp.width}x${bp.height}px`,
        'Expected Result': `Component displays perfectly with all content visible and readable at ${bp.name}`,
        'Status': '',
        'Browser': 'Chrome/Firefox/Safari/Edge'
      });
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Breakpoint Transition',
      'Test Scenario': 'Verify smooth transition from mobile to desktop layout',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on page',
      'Test Steps': '• Open in desktop view (1920px)\n• Slowly resize from 1920px down to 320px\n• Watch layout transform at each breakpoint\n• Verify smooth transitions (no jumping)\n• Verify content reflows correctly\n• Verify no horizontal scroll at any point\n• Verify all text remains readable throughout',
      'Test Data': 'Viewport change: 1920px → 320px continuous',
      'Expected Result': 'Layout transitions smoothly across all breakpoints without jumping or breaking',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Mobile Optimization',
      'Test Scenario': 'Verify component optimized for mobile devices',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on mobile view (< 480px)',
      'Test Steps': '• Set viewport to 375px width\n• Verify single-column layout (if applicable)\n• Verify touch-friendly spacing (min 44x44px buttons)\n• Check button/link sizes\n• Verify text is large enough (min 12px base, 14px readable)\n• Verify images scale down appropriately\n• Verify no pinch-to-zoom required for reading',
      'Test Data': 'Mobile breakpoint: 320-480px',
      'Expected Result': 'Mobile layout is optimized with proper spacing and readable text',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Tablet Optimization',
      'Test Scenario': 'Verify component optimized for tablet devices',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on tablet view (480-1024px)',
      'Test Steps': '• Set viewport to 768px width\n• Verify layout is optimized for tablet\n• Check spacing and padding increased\n• Verify content well-organized with good use of space\n• Check font sizes appropriate for tablet\n• Verify no excessive whitespace\n• Verify effective use of horizontal space',
      'Test Data': 'Tablet breakpoint: 480-1024px',
      'Expected Result': 'Tablet layout is well-optimized with good spacing and space usage',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Desktop Optimization',
      'Test Scenario': 'Verify component optimized for desktop devices',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on desktop view (> 1024px)',
      'Test Steps': '• Set viewport to 1920px width\n• Verify multi-column layout (if applicable)\n• Check spacing and alignment\n• Verify effective use of horizontal space\n• Check no excessive line lengths (max 80-120 chars)\n• Verify font sizes appropriate for desktop\n• Verify content not stretched too wide',
      'Test Data': 'Desktop breakpoint: > 1024px',
      'Expected Result': 'Desktop layout is well-optimized with good use of space',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Orientation',
      'Test Scenario': 'Verify component handles portrait and landscape orientations',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on mobile/tablet device',
      'Test Steps': '• Load component in portrait orientation\n• Verify layout and spacing correct\n• Rotate device to landscape\n• Verify layout adjusts properly\n• Check content still visible (no horizontal scroll)\n• Verify text readable in both orientations\n• Rotate back to portrait multiple times\n• Verify layout returns to original state',
      'Test Data': 'N/A',
      'Expected Result': 'Component displays correctly in both portrait and landscape orientations',
      'Status': '',
      'Browser': 'Mobile Browsers'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Touch Targets',
      'Test Scenario': 'Verify touch targets meet WCAG minimum size (44x44px)',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component with interactive elements on mobile',
      'Test Steps': '• Test on actual mobile device (not browser emulation)\n• Check all clickable/tappable areas\n• Verify each target is >= 44x44px (WCAG 2.5.5)\n• Verify spacing between targets (min 8px)\n• Verify no accidental double-taps\n• Verify no finger obscures important content\n• Verify icons are accessible to tap without zoom',
      'Test Data': 'Minimum touch target: 44x44px per WCAG 2.5.5',
      'Expected Result': 'All touch targets meet WCAG minimum and are properly spaced',
      'Status': '',
      'Browser': 'Mobile Browsers'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Fluid Layout',
      'Test Scenario': 'Verify smooth, fluid responsive behavior without jumping',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on page',
      'Test Steps': '• Open in fullscreen window\n• Slowly drag window edge to resize from 2560px to 320px\n• Observe layout changes continuously\n• Verify NO jumping or sudden layout shifts\n• Verify content reflows smoothly\n• Verify text wrapping is natural\n• Verify no layout breaking at any size\n• Check Cumulative Layout Shift (CLS) metric',
      'Test Data': 'Continuous resize: 2560px → 320px',
      'Expected Result': 'Layout responds fluidly with no jumping or sudden shifts',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Text Readability',
      'Test Scenario': 'Verify text remains readable at all breakpoints',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on multiple breakpoints',
      'Test Steps': '• Check font size on mobile (min 12px for body)\n• Check font size on tablet (proportional increase)\n• Check font size on desktop (optimal 16-18px)\n• Verify line height is adequate (min 1.5)\n• Verify line length not too long (max 70-80 chars)\n• Verify sufficient contrast on all breakpoints\n• Test reading distance on actual devices',
      'Test Data': 'Font sizes by breakpoint',
      'Expected Result': 'Text is readable and properly sized for all breakpoints',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Images & Icons',
      'Test Scenario': 'Verify images and icons scale appropriately across breakpoints',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component with images/icons',
      'Test Steps': '• Test on mobile (375px) - verify icons visible and proportionate\n• Test on tablet (768px) - verify scaling is smooth\n• Test on desktop (1920px) - verify not excessively large\n• Verify icons remain sharp (no pixelation)\n• Verify images load properly at all sizes\n• Check aspect ratios maintained\n• Verify alt text present for images',
      'Test Data': 'N/A',
      'Expected Result': 'Images and icons scale appropriately and remain sharp at all breakpoints',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Spacing & Padding',
      'Test Scenario': 'Verify spacing and padding adjust for each breakpoint',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component on multiple breakpoints',
      'Test Steps': '• Inspect spacing on mobile (320px) - compact but readable\n• Verify mobile padding is sufficient\n• Inspect spacing on tablet (768px) - increased appropriately\n• Inspect spacing on desktop (1920px) - generous but not excessive\n• Use DevTools to verify margin/padding values\n• Check vertical and horizontal spacing consistency',
      'Test Data': 'N/A',
      'Expected Result': 'Spacing and padding scale appropriately for each breakpoint',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Responsive - Column Layout',
      'Test Scenario': 'Verify column layout changes appropriately (1 col to 2/3 col)',
      'Test Type': 'Responsive',
      'Pre-Condition': 'Component with multi-column layout',
      'Test Steps': '• View on mobile (375px) - verify single column stacking\n• View on tablet (768px) - verify layout change/transition\n• View on desktop (1920px) - verify multi-column layout\n• Verify columns are balanced width\n• Verify gutter spacing between columns\n• Check alignment of elements across columns\n• Verify no content overflow in any column',
      'Test Data': 'N/A',
      'Expected Result': 'Column layout changes correctly at breakpoints with proper alignment',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    // ========================================================================
    // SECTION 5: BROWSER COMPATIBILITY TESTS
    // ========================================================================
    console.log('  Generating browser compatibility tests...');

    const browsers = [
      { name: 'Chrome', version: 'Latest', type: 'Desktop' },
      { name: 'Firefox', version: 'Latest', type: 'Desktop' },
      { name: 'Safari', version: 'Latest', type: 'Desktop' },
      { name: 'Edge', version: 'Latest', type: 'Desktop' },
      { name: 'Chrome Mobile', version: 'Latest', type: 'Mobile' },
      { name: 'Safari Mobile', version: 'Latest', type: 'Mobile' }
    ];

    browsers.forEach(browser => {
      testCases.push({
        TC_ID: tcId++,
        'Category': `Browser - ${browser.name}`,
        'Test Scenario': `Verify component renders in ${browser.name}`,
        'Test Type': 'Browser Compatibility',
          'Pre-Condition': `${browser.name} ${browser.version} available`,
        'Test Steps': `• Open page in ${browser.name} ${browser.version}\n• Verify component loads\n• Verify layout correct\n• Verify colors render properly\n• Check DevTools for errors\n• Verify no console errors`,
        'Test Data': `Browser: ${browser.name} ${browser.version}`,
        'Expected Result': `Component renders correctly in ${browser.name}`,
        'Status': '',
        'Browser': browser.name
      });
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Browser - CSS Support',
      'Test Scenario': 'Verify CSS Grid and Flexbox support across browsers',
      'Test Type': 'Browser Compatibility',
      'Pre-Condition': 'Component uses modern CSS',
      'Test Steps': '• Test in Chrome, Firefox, Safari, Edge\n• Verify layout renders correctly\n• Verify alignment works\n• Check for fallback rendering\n• Verify responsive behavior\n• No layout breaks in any browser',
      'Test Data': 'N/A',
      'Expected Result': 'CSS Grid/Flexbox works correctly in all browsers',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'Browser - Console',
      'Test Scenario': 'Verify no JavaScript errors in any browser',
      'Test Type': 'Browser Compatibility',
      'Pre-Condition': 'Component on page',
      'Test Steps': '• Open DevTools in each browser\n• Reload page\n• Check console for errors\n• Interact with component\n• Verify no errors in any browser\n• Document any warnings',
      'Test Data': 'N/A',
      'Expected Result': 'No JavaScript errors across all browsers',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    // ========================================================================
    // SECTION 6: QA & FINAL VERIFICATION
    // ========================================================================
    console.log('  Generating QA and final verification tests...');

    testCases.push({
      TC_ID: tcId++,
      'Category': 'QA - Styling',
      'Test Scenario': 'Verify all styles match design specification',
      'Test Type': 'UI',
      'Pre-Condition': 'Design specification available',
      'Test Steps': '• Compare colors against design\n• Compare typography (fonts, sizes, weights)\n• Compare spacing and layout\n• Compare component variations\n• Document any mismatches',
      'Test Data': 'Design specification/Figma',
      'Expected Result': 'All styles exactly match design specification',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'QA - Performance',
      'Test Scenario': 'Verify component load time and performance',
      'Test Type': 'Performance',
      'Pre-Condition': 'Component on page',
      'Test Steps': '• Open DevTools Performance tab\n• Run page load test\n• Check component render time\n• Verify no render-blocking resources\n• Check Lighthouse score',
      'Test Data': 'N/A',
      'Expected Result': 'Component loads quickly, no performance issues',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    testCases.push({
      TC_ID: tcId++,
      'Category': 'QA - Documentation',
      'Test Scenario': 'Verify documentation and authoring guide exist',
      'Test Type': 'Documentation',
      'Pre-Condition': 'Documentation created',
      'Test Steps': '• Review authoring guide\n• Verify all fields documented\n• Verify usage examples present\n• Verify screenshots included\n• Verify clear instructions\n• Verify updated recently',
      'Test Data': 'N/A',
      'Expected Result': 'Complete documentation with clear instructions',
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    });

    return testCases;
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
    worksheet.getCell('A5').value = 'Coverage';
    worksheet.getCell('B5').value = 'Positive, Negative, Edge Cases, Accessibility, Responsive, Browser Compatibility';

    // Column headers
    const headers = ['TC_ID', 'Category', 'Test Scenario', 'Test Type', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Status', 'Browser'];
    const headerRow = 7;
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
      const rowNum = rowIndex + 8;
      headers.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNum, colIndex + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = border;
      });
      worksheet.getRow(rowNum).height = 100;
    });

    // Column widths
    const columnWidths = {
      'A': 8, 'B': 26, 'C': 35, 'D': 18, 'E': 26, 'F': 42, 'G': 18, 'H': 35, 'I': 10, 'J': 20
    };

    Object.keys(columnWidths).forEach(col => {
      worksheet.getColumn(col).width = columnWidths[col];
    });

    const safeFileName = summary.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const filename = `${ticketKey}_UNIVERSAL_TESTCASES_${safeFileName}.xlsx`;
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
      console.log('\nAnalyzing ticket requirements...');

      // Extract requirements
      const requirements = this.extractRequirements(description, summary);
      console.log(`Found ${requirements.length} main requirements`);

      if (requirements.length > 0) {
        requirements.forEach((req, idx) => {
          console.log(`  ${idx + 1}. [${req.type}] ${req.text.substring(0, 65)}...`);
        });
      }

      console.log('\nGenerating comprehensive test scenarios...');
      // Generate test cases based on actual requirements
      const testCases = this.generateTestScenarios(requirements, summary);
      console.log(`✓ Generated ${testCases.length} comprehensive test cases`);

      // Create Excel file
      const filepath = await this.createExcelFile(testCases, ticketKey, summary);
      console.log(`✓ Excel file created: ${path.basename(filepath)}`);

      return { filepath, testCaseCount: testCases.length, requirements: requirements.length };
    } catch (error) {
      console.error(`✗ Error processing ${ticketKey}:`, error.message);
      throw error;
    }
  }
}

// Main entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node universal_testcase_generator.js <TICKET_KEY> [TICKET_KEY_2] ...');
  console.log('Example: node universal_testcase_generator.js GAAM-744');
  console.log('Multiple: node universal_testcase_generator.js GAAM-744 GAAM-618 GAAM-687');
  process.exit(1);
}

const ticketKeys = args.map(key => key.toUpperCase());
const generator = new UniversalTestCaseGenerator();

console.log(`\n${'='.repeat(90)}`);
console.log(`UNIVERSAL Test Case Generator - Dynamic Analysis and Generation`);
console.log(`Processing ${ticketKeys.length} ticket(s)`);
console.log(`Coverage: Positive | Negative | Edge Cases | Accessibility | Responsive | Browser Compatibility`);
console.log(`${'='.repeat(90)}`);

(async () => {
  const results = [];

  for (let i = 0; i < ticketKeys.length; i++) {
    const ticketKey = ticketKeys[i];
    try {
      console.log(`\n[${i + 1}/${ticketKeys.length}] ${ticketKey}`);
      const result = await generator.generate(ticketKey);
      results.push({ ticketKey, status: '✓', ...result });
    } catch (error) {
      results.push({ ticketKey, status: '✗', error: error.message });
    }
  }

  console.log(`\n${'='.repeat(90)}`);
  console.log('GENERATION SUMMARY');
  console.log(`${'='.repeat(90)}`);
  results.forEach(r => {
    if (r.status === '✓') {
      console.log(`${r.status} ${r.ticketKey}: ${r.testCaseCount} tests (${r.requirements} requirements analyzed)`);
    } else {
      console.log(`${r.status} ${r.ticketKey}: ${r.error}`);
    }
  });
  console.log(`${'='.repeat(90)}\n`);
})();
