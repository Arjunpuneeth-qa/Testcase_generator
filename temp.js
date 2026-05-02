#!/usr/bin/env node

/**
 * COMPREHENSIVE Intelligent Test Case Generator
 * Covers ALL 9 Test Case Categories:
 * 1. Positive Test Cases
 * 2. Negative Test Cases
 * 3. Edge Cases
 * 4. Accessibility Test Cases
 * 5. Compatibility Test Cases
 * 6. Responsive Test Cases (Mobile/Tablet/Desktop)
 * 7. UI Test Cases
 * 8. Cross-Browser Testing
 * 9. Mobile/Tablet/Desktop Test Cases
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

class ComprehensiveIntelligentGenerator {
  constructor(outputDir = path.join(__dirname, 'GA_testcases')) {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    this.checklist = {
      positive: 0,
      negative: 0,
      edge: 0,
      accessibility: 0,
      compatibility: 0,
      responsive: 0,
      ui: 0,
      crossBrowser: 0,
      mobileTabletDesktop: 0
    };
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

  parseSections(text) {
    const sections = {
      functionality: [],
      responsive: [],
      accessibility: [],
      qa: [],
      additional: []
    };

    const funcMatch = text.match(/\*Functionality\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (funcMatch) sections.functionality = this.extractBulletPoints(funcMatch[1]);

    const respMatch = text.match(/\*Responsive Behavior\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (respMatch) sections.responsive = this.extractBulletPoints(respMatch[1]);

    const accMatch = text.match(/\*Accessibility[\s\S]*?\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (accMatch) sections.accessibility = this.extractBulletPoints(accMatch[1]);

    const qaMatch = text.match(/QA Checklist[\s\S]*?\n+([\s\S]*?)(?=\n\n|$)/);
    if (qaMatch) sections.qa = this.extractBulletPoints(qaMatch[1]);

    const addMatch = text.match(/\*Additional Requirements\*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z])/);
    if (addMatch) sections.additional = this.extractBulletPoints(addMatch[1]);

    return sections;
  }

  extractBulletPoints(text) {
    const points = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*\*\s+(.+)$/);
      if (match) {
        const cleaned = match[1].trim();
        if (cleaned && cleaned.length > 5) {
          points.push(cleaned);
        }
      }
    });
    return points.filter(p => p.length > 0);
  }

  createTest(id, category, type, scenario, steps, data, expected) {
    this.checklist[this.getCategoryKey(type)]++;
    return {
      TC_ID: id,
      'Category': category,
      'Test Type': type,
      'Test Scenario': scenario,
      'Pre-Condition': 'Component configured',
      'Test Steps': steps,
      'Test Data': data,
      'Expected Result': expected,
      'Status': '',
      'Browser': 'Chrome/Firefox/Safari/Edge'
    };
  }

  getCategoryKey(type) {
    const map = {
      'Positive': 'positive',
      'Negative': 'negative',
      'Edge Case': 'edge',
      'Accessibility': 'accessibility',
      'Compatibility': 'compatibility',
      'Responsive': 'responsive',
      'UI': 'ui',
      'Cross-Browser': 'crossBrowser',
      'Mobile/Tablet/Desktop': 'mobileTabletDesktop'
    };
    return map[type] || 'positive';
  }

  generateComprehensiveTestCases(sections) {
    const testCases = [];
    let tcId = 1;

    // ========== 1. POSITIVE TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'Functionality', 'Positive',
      'Verify purple header bar renders with path name',
      '• Log in to AEM Author\n• Configure component with path name\n• Save and preview\n• Verify purple header displays\n• Verify path name is visible',
      'Path name: "Growth Path"',
      'Purple header bar displays with path name'));

    testCases.push(this.createTest(tcId++, 'Layout', 'Positive',
      'Verify two-column layout on desktop',
      '• Configure component with statistic and bullets\n• View on desktop (1920px)\n• Verify statistic block on left\n• Verify bullet list on right\n• Verify side-by-side layout',
      'Desktop viewport',
      'Two-column layout renders correctly'));

    testCases.push(this.createTest(tcId++, 'Statistic', 'Positive',
      'Verify statistic block renders with all elements',
      '• Configure statistic with number, unit, headline, description\n• Save and preview\n• Verify large display number\n• Verify unit/symbol\n• Verify bold headline\n• Verify description',
      'Number: "85%", Headline: "Return Rate"',
      'Statistic block displays all elements correctly'));

    testCases.push(this.createTest(tcId++, 'Bullets', 'Positive',
      'Verify bullet list renders with checkmarks and dividers',
      '• Add 3+ bullet items\n• Save and preview\n• Verify checkmark icons on each item\n• Verify divider lines between items\n• Verify proper alignment',
      'Items: "Low fees", "Tax efficiency", "Professional management"',
      'Bullet list displays correctly with checkmarks and dividers'));

    testCases.push(this.createTest(tcId++, 'Fields', 'Positive',
      'Verify optional fields display when authored',
      '• Configure all fields (required and optional)\n• Save and preview\n• Verify all content displays\n• Verify proper spacing\n• Verify alignment',
      'All fields populated',
      'All fields display correctly when authored'));

    // ========== 2. NEGATIVE TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'Input Validation', 'Negative',
      'Verify component handles empty path name',
      '• Leave path name empty\n• Save component\n• Preview page\n• Verify no undefined/error display\n• Verify header renders',
      'Empty path name',
      'Component handles empty input gracefully'));

    testCases.push(this.createTest(tcId++, 'Input Validation', 'Negative',
      'Verify XSS protection - HTML injection attempt',
      '• Enter path name: "<script>alert()</script>"\n• Enter bullet: "<img onerror=alert()>"\n• Save and preview\n• Verify no script execution\n• Inspect source code',
      'HTML/script injection attempts',
      'HTML properly escaped, no XSS vulnerability'));

    testCases.push(this.createTest(tcId++, 'Input Validation', 'Negative',
      'Verify very long text handling',
      '• Enter path name with 200+ characters\n• Save and preview\n• Verify text wraps properly\n• Verify no overflow\n• Check layout stability',
      'Path name: "Long text..."',
      'Long text wraps/truncates gracefully'));

    testCases.push(this.createTest(tcId++, 'Input Validation', 'Negative',
      'Verify empty statistic number handling',
      '• Leave number field empty\n• Enter headline\n• Save and preview\n• Verify no undefined display\n• Verify statistic block renders',
      'Empty statistic number',
      'Component handles missing number gracefully'));

    testCases.push(this.createTest(tcId++, 'Input Validation', 'Negative',
      'Verify empty bullet list handling',
      '• Leave bullet list empty\n• Save and preview\n• Verify no empty list renders\n• Verify no placeholder space\n• Verify clean layout',
      'No bullet items',
      'Empty bullet list does not render'));

    testCases.push(this.createTest(tcId++, 'Input Validation', 'Negative',
      'Verify special characters handling',
      '• Enter special chars: "<>&\'"\n• Enter: "!@#$%^&*()"\n• Save and preview\n• Verify proper escaping\n• Verify display correctness',
      'Special characters: < > & " \'',
      'Special characters properly escaped and displayed'));

    // ========== 3. EDGE CASES ==========
    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify optional fields render only when authored',
      '• Configure with required fields only\n• Leave optional fields empty\n• Save and preview\n• Verify no empty placeholders\n• Verify clean layout',
      'Required fields only',
      'No empty space for unopened optional fields'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify single bullet item without orphaned divider',
      '• Add only one bullet item\n• Save and preview\n• Verify renders correctly\n• Verify no divider below item',
      'Single item: "Benefit"',
      'Single bullet renders without extra divider'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify zero and negative numbers',
      '• Enter number: "0"\n• Save and preview\n• Enter number: "-5"\n• Verify display correct\n• Verify formatting',
      'Numbers: "0", "-5"',
      'Zero and negative numbers display correctly'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify very large numbers',
      '• Enter number: "999,999,999"\n• Save and preview\n• Verify displays without overflow\n• Verify readable formatting',
      'Large number: "999,999,999"',
      'Large numbers display properly'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify Unicode and international characters',
      '• Enter Chinese: "增长路径"\n• Enter Arabic text\n• Enter emoji\n• Save and preview\n• Verify all display correctly',
      'Unicode: Chinese, Arabic, emoji',
      'International characters display correctly'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify many bullet items (15+)',
      '• Add 15 bullet items\n• Save and preview\n• Verify all render\n• Verify dividers present\n• Check performance',
      '15 bullet items',
      'Component handles many items without issues'));

    // ========== 4. ACCESSIBILITY TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify semantic HTML structure',
      '• Open DevTools\n• Inspect HTML structure\n• Verify semantic tags (h1, h2, p, ul, li)\n• Verify proper heading hierarchy\n• Check no div-only structure',
      'N/A',
      'Semantic HTML used correctly'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify color contrast (WCAG AA 4.5:1)',
      '• Use color contrast checker\n• Check path name on purple header\n• Check all text elements\n• Verify >= 4.5:1 ratio\n• Check purple header contrast',
      'WCAG AA: 4.5:1 minimum',
      'All text meets WCAG AA contrast requirements'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify screen reader compatibility',
      '• Enable screen reader (NVDA/JAWS)\n• Navigate with Tab key\n• Listen to announcements\n• Verify logical order\n• Verify all content announced',
      'N/A',
      'Screen reader announces content in logical order'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify checkmark icons marked as decorative',
      '• Enable screen reader\n• Navigate to bullet list\n• Verify checkmarks NOT announced\n• Inspect HTML for aria-hidden\n• Verify only text announced',
      'N/A',
      'Decorative icons not announced by screen reader'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify proper list element structure',
      '• Inspect bullet list HTML\n• Verify <ul> wrapper\n• Verify <li> for each item\n• Verify proper nesting\n• Check accessibility score',
      'N/A',
      'Proper semantic <ul>/<li> structure used'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify Level Access Extension - no critical issues',
      '• Install Level Access Extension\n• Run scan on component\n• Review accessibility report\n• Verify no critical issues\n• Verify no major issues',
      'N/A',
      'No critical or major accessibility issues'));

    // ========== 5. COMPATIBILITY TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify CSS Grid/Flexbox support',
      '• Test in all browsers\n• Verify layout renders correctly\n• Check two-column layout\n• Verify alignment works\n• Check responsive behavior',
      'N/A',
      'CSS Grid/Flexbox works in all browsers'));

    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify CSS custom properties (variables)',
      '• Check if CSS variables used\n• Test in all browsers\n• Verify colors load\n• Verify spacing calculated\n• Check DevTools values',
      'N/A',
      'CSS variables work correctly'));

    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify vendor prefixes work correctly',
      '• Inspect CSS for prefixes\n• Test -webkit-, -moz-, -ms-\n• Test in all browsers\n• Verify layout consistency\n• Check unprefixed versions',
      'N/A',
      'Vendor prefixes applied correctly'));

    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify no console JavaScript errors',
      '• Open DevTools Console\n• Reload page\n• Interact with component\n• Scroll and resize\n• Check all browsers for errors',
      'N/A',
      'No JavaScript errors in any browser'));

    // ========== 6. RESPONSIVE TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify desktop layout (1920px) - two columns',
      '• Set viewport to 1920px\n• Verify two-column layout\n• Verify statistic on LEFT\n• Verify bullets on RIGHT\n• Verify spacing',
      '1920px width',
      'Desktop layout shows two columns correctly'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify mobile layout (375px) - single column stacked',
      '• Set viewport to 375px\n• Verify single-column layout\n• Verify statistic ABOVE bullets\n• Verify stacked layout\n• Verify full width',
      '375px width',
      'Mobile layout shows single-column stacked correctly'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify tablet layout (768px) - optimized',
      '• Set viewport to 768px\n• Verify layout optimized for tablet\n• Check spacing\n• Verify good space usage\n• Check font sizes',
      '768px width',
      'Tablet layout is optimized'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify layout transition desktop to mobile',
      '• Resize from 1920px to 375px slowly\n• Watch layout change\n• Verify smooth transition\n• Verify no jumping\n• Verify layout correct at transition',
      'Continuous resize 1920px → 375px',
      'Layout transitions smoothly without jumping'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify full width at all breakpoints',
      '• Test at 320px, 768px, 1366px, 1920px\n• Verify header 100% width\n• Verify card body 100% width\n• Verify no left/right margins\n• Inspect width property',
      'All breakpoints',
      'Header and card body are full width at all breakpoints'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify orientation changes (portrait/landscape)',
      '• Test on mobile in portrait\n• Rotate to landscape\n• Verify layout adjusts\n• Verify content visible\n• Verify readable in both',
      'N/A',
      'Component displays correctly in both orientations'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify no overflow at any breakpoint',
      '• Test at all breakpoints\n• Check for horizontal scroll\n• Verify all content visible\n• Verify no text cutoff\n• Verify images scale',
      'All breakpoints: 320px-2560px',
      'No overflow or cutoff at any breakpoint'));

    // ========== 7. UI TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify purple header color matches Figma',
      '• Use color picker on header\n• Get RGB/hex value\n• Compare with Figma\n• Verify exact match\n• Check consistency',
      'Figma color specification',
      'Header color exactly matches Figma'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify typography matches Figma',
      '• Check font family\n• Check font size\n• Check font weight\n• Check line height\n• Compare with Figma spec',
      'Figma typography spec',
      'All typography matches Figma'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify spacing and padding matches Figma',
      '• Inspect padding values\n• Inspect margin values\n• Measure gaps between elements\n• Compare with Figma\n• Verify visual consistency',
      'Figma spacing specification',
      'All spacing matches Figma spec'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify column widths are balanced',
      '• Measure statistic block width\n• Measure bullet list width\n• Calculate percentage\n• Verify reasonable distribution\n• Check alignment',
      'N/A',
      'Desktop columns are properly balanced'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify checkmark icon styling',
      '• Inspect icon color\n• Check icon size\n• Verify alignment\n• Compare with Figma\n• Check consistency across items',
      'Figma icon specification',
      'Checkmark icons styled correctly'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify divider line styling',
      '• Check divider color\n• Check divider thickness\n• Check divider length\n• Verify extends full width\n• Compare with Figma',
      'Figma divider specification',
      'Divider lines styled correctly'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify visual hierarchy (font sizes)',
      '• Check path name size (largest)\n• Check headline size (medium)\n• Check description size (smallest)\n• Verify clear hierarchy\n• Check consistency',
      'N/A',
      'Clear visual hierarchy with font sizes'));

    // ========== 8. CROSS-BROWSER TESTING ==========
    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Chrome rendering',
      '• Open page in Chrome (latest)\n• Verify layout correct\n• Verify colors render\n• Check fonts\n• Verify no errors',
      'Chrome latest version',
      'Component renders correctly in Chrome'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Firefox rendering',
      '• Open page in Firefox (latest)\n• Verify layout correct\n• Verify colors render\n• Check fonts\n• Verify no errors',
      'Firefox latest version',
      'Component renders correctly in Firefox'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Safari rendering',
      '• Open page in Safari (latest)\n• Verify layout correct\n• Verify colors render\n• Check fonts\n• Verify no errors',
      'Safari latest version',
      'Component renders correctly in Safari'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Edge rendering',
      '• Open page in Edge (latest)\n• Verify layout correct\n• Verify colors render\n• Check fonts\n• Verify no errors',
      'Edge latest version',
      'Component renders correctly in Edge'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify mobile Safari (iOS)',
      '• Open in Safari on iPhone/iPad\n• Verify layout correct\n• Verify touch works\n• Check rendering\n• Verify no errors',
      'Mobile Safari on iOS',
      'Component works in Mobile Safari'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Chrome Mobile (Android)',
      '• Open in Chrome on Android\n• Verify layout correct\n• Verify touch works\n• Check rendering\n• Verify no errors',
      'Chrome Mobile on Android',
      'Component works in Chrome Mobile'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify consistent rendering across all browsers',
      '• Open in Chrome, Firefox, Safari, Edge\n• Compare visual rendering\n• Check colors match\n• Check spacing matches\n• Document differences',
      'All browsers',
      'Rendering consistent across all browsers'));

    // ========== 9. MOBILE/TABLET/DESKTOP TEST CASES ==========
    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify mobile small (320px) - iPhone SE',
      '• Set viewport to 320x568\n• Verify all content visible\n• Verify single-column\n• Verify text readable\n• Verify no horizontal scroll',
      '320x568px (iPhone SE)',
      'Mobile small displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify mobile (375px) - iPhone 12/13',
      '• Set viewport to 375x667\n• Verify all content visible\n• Verify single-column stacked\n• Verify touch-friendly\n• Verify readable',
      '375x667px (iPhone 12/13)',
      'Mobile displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify mobile large (430px) - iPhone 14 Plus',
      '• Set viewport to 430x932\n• Verify content visible\n• Verify layout optimized\n• Verify readable\n• Verify proper spacing',
      '430x932px (iPhone 14 Plus)',
      'Mobile large displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify tablet portrait (768px) - iPad',
      '• Set viewport to 768x1024\n• Verify layout optimized for tablet\n• Verify good space usage\n• Verify readable\n• Verify proper alignment',
      '768x1024px (iPad portrait)',
      'Tablet portrait displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify tablet landscape (1024px) - iPad',
      '• Set viewport to 1024x768\n• Verify layout optimized\n• Verify uses available space\n• Verify readable\n• Verify proper alignment',
      '1024x768px (iPad landscape)',
      'Tablet landscape displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify desktop (1366px) - Standard',
      '• Set viewport to 1366x768\n• Verify two-column layout\n• Verify statistic left, bullets right\n• Verify spacing\n• Verify readable',
      '1366x768px (Desktop standard)',
      'Desktop standard displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify large desktop (1920px)',
      '• Set viewport to 1920x1080\n• Verify two-column layout\n• Verify optimal spacing\n• Verify not stretched\n• Verify readable',
      '1920x1080px (Desktop large)',
      'Large desktop displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify ultra wide (2560px) - 4K',
      '• Set viewport to 2560x1440\n• Verify layout correct\n• Verify not too stretched\n• Verify readable\n• Verify spacing adequate',
      '2560x1440px (Ultra wide 4K)',
      'Ultra wide displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify touch target sizes on mobile (44x44px)',
      '• Test on actual mobile device\n• Check all clickable areas\n• Verify each >= 44x44px\n• Verify spacing between targets\n• Verify no accidental taps',
      'WCAG 2.5.5: 44x44px minimum',
      'Touch targets meet WCAG minimum'));

    return testCases;
  }

