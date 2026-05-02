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

  extractBulletPoints(text) {
    if (!text) return [];
    const points = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        points.push(line.trim().replace(/^[•-]\s*/, ''));
      }
    });
    return points.length > 0 ? points : [];
  }

  parseSections(text) {
    const sections = {
      functionality: [],
      responsive: [],
      accessibility: [],
      qa: [],
      additional: []
    };

    const funcMatch = text.match(/\*Functionality\*\s*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z]|$)/);
    if (funcMatch) sections.functionality = this.extractBulletPoints(funcMatch[1]);

    const respMatch = text.match(/\*Responsive Behavior\*\s*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z]|$)/);
    if (respMatch) sections.responsive = this.extractBulletPoints(respMatch[1]);

    const a11yMatch = text.match(/\*Accessibility\*\s*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z]|$)/);
    if (a11yMatch) sections.accessibility = this.extractBulletPoints(a11yMatch[1]);

    const qaMatch = text.match(/\*QA Checklist\*\s*([\s\S]*?)(?=\*[A-Z]|\n\n[A-Z]|$)/);
    if (qaMatch) sections.qa = this.extractBulletPoints(qaMatch[1]);

    return sections;
  }

  createTest(id, category, testType, scenario, steps, testData, expected) {
    return {
      TC_ID: `TC_${String(id).padStart(3, '0')}`,
      Category: category,
      'Test Type': testType,
      'Test Scenario': scenario,
      'Pre-Condition': 'User is logged in',
      'Test Steps': steps,
      'Test Data': testData,
      'Expected Result': expected,
      'Status': ''
    };
  }

  generateComprehensiveTestCases(sections) {
    const testCases = [];
    let tcId = 1;

    // POSITIVE TEST CASES (5)
    testCases.push(this.createTest(tcId++, 'Positive', 'Positive',
      'Verify component renders correctly',
      '• Navigate to component page\n• Wait for page to load\n• Verify component is visible\n• Verify no console errors',
      'Valid component URL',
      'Component displays correctly'));

    testCases.push(this.createTest(tcId++, 'Positive', 'Positive',
      'Verify all required fields display',
      '• Check purple header bar\n• Verify path name visible\n• Verify description displays\n• Verify all elements aligned',
      'Page with complete data',
      'All fields display correctly'));

    testCases.push(this.createTest(tcId++, 'Positive', 'Positive',
      'Verify styling matches Figma design',
      '• Open Figma design reference\n• Compare colors (purple header)\n• Check spacing and padding\n• Verify typography matches',
      'Figma design URL',
      'UI matches design exactly'));

    testCases.push(this.createTest(tcId++, 'Positive', 'Positive',
      'Verify interactive elements work',
      '• Click on path links\n• Verify navigation works\n• Check button interactions\n• Verify no JavaScript errors',
      'User input on interactive elements',
      'All interactions work as expected'));

    testCases.push(this.createTest(tcId++, 'Positive', 'Positive',
      'Verify content hierarchy',
      '• Verify header is prominent\n• Check path hierarchy\n• Verify bullet points indentation\n• Check statistical block formatting',
      'Standard component display',
      'Content hierarchy is clear'));

    // NEGATIVE TEST CASES (6)
    testCases.push(this.createTest(tcId++, 'Negative', 'Negative',
      'Verify handling of empty inputs',
      '• Pass null/undefined path name\n• Pass empty description\n• Pass empty bullet list\n• Verify graceful degradation',
      'null, undefined, empty strings',
      'Component handles gracefully'));

    testCases.push(this.createTest(tcId++, 'Negative', 'Negative',
      'Verify XSS/HTML injection prevention',
      '• Input HTML tags in path name\n• Input script tags in description\n• Input malicious content\n• Check content is escaped',
      '<script>alert("XSS")</script>, <img src=x onerror=alert(1)>',
      'Content is escaped and safe'));

    testCases.push(this.createTest(tcId++, 'Negative', 'Negative',
      'Verify handling of very long text',
      '• Enter path name 200+ characters\n• Enter description 500+ characters\n• Verify no layout break\n• Check text truncation',
      '200-500+ character strings',
      'Layout remains intact'));

    testCases.push(this.createTest(tcId++, 'Negative', 'Negative',
      'Verify special characters handling',
      '• Use special chars: !@#$%^&*()\n• Use Unicode characters\n• Use emoji\n• Verify correct rendering',
      '!@#$%^&*(), Unicode, emoji',
      'Characters display correctly'));

    testCases.push(this.createTest(tcId++, 'Negative', 'Negative',
      'Verify handling of missing optional fields',
      '• Omit path description\n• Remove optional elements\n• Remove bullet points\n• Verify component still works',
      'Missing optional fields',
      'Component functions without optional fields'));

    testCases.push(this.createTest(tcId++, 'Negative', 'Negative',
      'Verify large dataset handling',
      '• Load 100+ bullet points\n• Load 50+ path levels\n• Check performance\n• Verify no memory leaks',
      'Large arrays of data',
      'Component handles large data'));

    // EDGE CASES (6)
    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify single character inputs',
      '• Enter single char path name\n• Enter single char description\n• Verify rendering\n• Check spacing',
      'Single character strings',
      'Renders correctly'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify Unicode and international characters',
      '• Input Chinese characters\n• Input Arabic text\n• Input RTL languages\n• Verify layout handles correctly',
      'Chinese: 测试, Arabic: اختبار',
      'International text displays correctly'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify whitespace handling',
      '• Input leading/trailing spaces\n• Input multiple spaces between words\n• Input tabs and line breaks\n• Verify trimming works',
      '  spaces  around   text  ',
      'Whitespace handled correctly'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify mixed optional and required fields',
      '• Combine all field variations\n• Mix required + some optional\n• Mix required + all optional\n• Verify flexibility',
      'Various field combinations',
      'All combinations work'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify numerical boundary values',
      '• Test min array size (0 items)\n• Test max practical array size\n• Test negative numbers\n• Verify handling',
      '0, -1, 999999',
      'Handles boundary values'));

    testCases.push(this.createTest(tcId++, 'Edge Case', 'Edge Case',
      'Verify case sensitivity',
      '• Input uppercase path names\n• Input lowercase names\n• Input mixed case\n• Verify consistent handling',
      'PATH, path, Path',
      'Case handled appropriately'));

    // ACCESSIBILITY (6)
    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify WCAG 2.2 semantic HTML structure',
      '• Inspect HTML elements\n• Verify heading hierarchy (h1-h6)\n• Check proper list markup\n• Verify semantic tags used',
      'HTML inspection tools (DevTools)',
      'Semantic HTML structure correct'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify color contrast compliance (4.5:1 WCAG AA)',
      '• Use color contrast checker\n• Test purple header vs text\n• Test all text colors\n• Verify >= 4.5:1 ratio',
      'Contrast checking tool, Color palette',
      'All contrasts >= 4.5:1'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify screen reader compatibility',
      '• Test with NVDA/JAWS\n• Verify text alternatives\n• Check aria-labels\n• Verify reading order',
      'Screen reader software (NVDA)',
      'Content readable via screen reader'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify keyboard navigation (Tab order)',
      '• Navigate using Tab key only\n• Verify logical tab order\n• Check focus indicators\n• Test all interactive elements',
      'Keyboard (Tab/Shift+Tab)',
      'Fully keyboard navigable'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify 200% zoom readability',
      '• Zoom page to 200%\n• Verify no content cut off\n• Check text remains readable\n• Verify layout flows',
      'Browser zoom at 200%',
      'Content readable at 200% zoom'));

    testCases.push(this.createTest(tcId++, 'Accessibility', 'Accessibility',
      'Verify no critical accessibility violations',
      '• Run Level Access scan\n• Check for WCAG violations\n• Verify no errors\n• Document any warnings',
      'Level Access scan tool',
      'No critical issues found'));

    // COMPATIBILITY (4)
    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify CSS Grid/Flexbox support',
      '• Check CSS Grid properties\n• Verify Flexbox implementation\n• Test responsive layout\n• Check fallbacks',
      'Modern browser with DevTools',
      'CSS displays correctly'));

    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify no JavaScript errors',
      '• Open browser console\n• Check for errors/warnings\n• Verify no uncaught exceptions\n• Check network errors',
      'Browser DevTools console',
      'Console clean, no errors'));

    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify API response handling',
      '• Test with valid API response\n• Test null response\n• Test malformed data\n• Verify error handling',
      'API endpoints and responses',
      'Responses handled correctly'));

    testCases.push(this.createTest(tcId++, 'Compatibility', 'Compatibility',
      'Verify component with different data formats',
      '• Test JSON data\n• Test XML parsing\n• Test CSV import\n• Verify parsing works',
      'Various data format files',
      'All formats parse correctly'));

    // RESPONSIVE DESIGN (7)
    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify mobile layout (375px)',
      '• Set viewport 375x667\n• Verify single-column layout\n• Check statistics ABOVE bullets\n• Verify full-width\n• Check readable text',
      '375x667px (Mobile)',
      'Mobile layout correct'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify tablet layout (768px)',
      '• Set viewport 768x1024\n• Verify optimized layout\n• Check element spacing\n• Verify readable\n• Check touch targets',
      '768x1024px (Tablet Portrait)',
      'Tablet layout correct'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify desktop layout (1920px)',
      '• Set viewport 1920x1080\n• Verify two-column layout\n• Check statistics LEFT, bullets RIGHT\n• Verify optimal spacing',
      '1920x1080px (Desktop)',
      'Desktop layout correct'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify layout transition points',
      '• Test 768px to 1024px transition\n• Test 1024px to 1920px transition\n• Verify smooth breakpoints\n• Check no layout jump',
      'Incremental viewport changes',
      'Smooth transitions at breakpoints'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify full-width content display',
      '• Verify component uses full width\n• Check padding consistency\n• Verify margins appropriate\n• Check not stretched',
      'Various screen sizes',
      'Full-width display correct'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify landscape/portrait orientation',
      '• Rotate device to landscape\n• Rotate to portrait\n• Verify layout adjusts\n• Check content readable',
      'Device orientation changes',
      'Orientation changes handled'));

    testCases.push(this.createTest(tcId++, 'Responsive', 'Responsive',
      'Verify fluid image/media scaling',
      '• Load images in component\n• Verify responsive sizing\n• Check aspect ratio maintained\n• Verify no distortion',
      'Images/media elements',
      'Media scales responsively'));

    // UI TEST CASES (7)
    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify purple header bar styling',
      '• Check header background color\n• Verify hex #6B46C1 or equivalent\n• Check padding/spacing\n• Verify text color white',
      'Purple header (#6B46C1)',
      'Header styled correctly'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify typography and font sizes',
      '• Check title font size\n• Verify body text size\n• Check line spacing\n• Verify font family consistent',
      'Figma design specs',
      'Typography matches spec'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify spacing and padding consistency',
      '• Measure margins between elements\n• Check padding inside containers\n• Verify whitespace balance\n• Compare with Figma',
      'Spacing measurements',
      'Spacing matches design'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify bullet point formatting',
      '• Check bullet symbol (•)\n• Verify indentation\n• Check line height\n• Verify alignment',
      'Bullet list component',
      'Bullet formatting correct'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify statistical block display',
      '• Check number display\n• Verify label text\n• Check icon display\n• Verify alignment in layout',
      'Statistics block data',
      'Statistics display correctly'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify borders and dividers',
      '• Check for dividers between sections\n• Verify border colors\n• Check border width\n• Verify alignment',
      'Component layout',
      'Borders display correctly'));

    testCases.push(this.createTest(tcId++, 'UI', 'UI',
      'Verify visual hierarchy',
      '• Check title prominence\n• Verify emphasis on key elements\n• Check visual weight\n• Verify focus areas clear',
      'Visual design review',
      'Hierarchy is clear'));

    // CROSS-BROWSER TESTING (7)
    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Chrome desktop rendering',
      '• Open in Chrome latest\n• Verify all elements display\n• Check styling correct\n• Verify no console errors',
      'Chrome browser (desktop)',
      'Renders correctly in Chrome'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Firefox desktop rendering',
      '• Open in Firefox latest\n• Verify styling consistent\n• Check layout correct\n• Verify functionality',
      'Firefox browser (desktop)',
      'Renders correctly in Firefox'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Safari desktop rendering',
      '• Open in Safari latest\n• Check -webkit prefixes\n• Verify styling correct\n• Check all features work',
      'Safari browser (desktop)',
      'Renders correctly in Safari'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Edge desktop rendering',
      '• Open in Edge latest\n• Verify compatibility\n• Check styling\n• Test functionality',
      'Microsoft Edge browser',
      'Renders correctly in Edge'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Safari mobile rendering',
      '• Test on iPhone Safari\n• Verify responsive layout\n• Check touch interactions\n• Verify performance',
      'iPhone Safari mobile',
      'Works correctly on Safari mobile'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify Chrome mobile rendering',
      '• Test on Chrome mobile\n• Verify responsive behavior\n• Check touch targets\n• Verify no zoom needed',
      'Chrome mobile browser',
      'Works correctly on Chrome mobile'));

    testCases.push(this.createTest(tcId++, 'Cross-Browser', 'Cross-Browser',
      'Verify consistent behavior across browsers',
      '• Compare rendering across browsers\n• Check for browser-specific issues\n• Verify consistent user experience\n• Document differences',
      'Multiple browser versions',
      'Behavior consistent across browsers'));

    // MOBILE/TABLET/DESKTOP (9)
    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify mobile small (320px)',
      '• Set viewport to 320x568\n• Verify single column\n• Verify readable text\n• Check no horizontal scroll',
      '320x568px (Mobile small)',
      'Displays correctly on 320px'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify mobile large (414px)',
      '• Set viewport to 414x896\n• Verify single column layout\n• Verify spacing adequate\n• Check readable',
      '414x896px (Mobile large)',
      'Displays correctly on 414px'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify tablet portrait (768px)',
      '• Set viewport to 768x1024\n• Verify optimized layout\n• Check element spacing\n• Verify touch friendly',
      '768x1024px (Tablet portrait)',
      'Tablet portrait displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify tablet landscape (1024px)',
      '• Set viewport to 1024x768\n• Verify horizontal layout\n• Check spacing correct\n• Verify readable',
      '1024x768px (Tablet landscape)',
      'Tablet landscape displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify desktop standard (1366px)',
      '• Set viewport to 1366x768\n• Verify layout optimized\n• Verify spacing\n• Check readable',
      '1366x768px (Desktop)',
      'Desktop standard displays correctly'));

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify desktop large (1920px)',
      '• Set viewport to 1920x1080\n• Verify two-column layout\n• Verify optimal spacing\n• Verify not stretched',
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

    testCases.push(this.createTest(tcId++, 'Mobile/Tablet/Desktop', 'Mobile/Tablet/Desktop',
      'Verify performance on all device sizes',
      '• Load time on mobile\n• Load time on tablet\n• Load time on desktop\n• Verify < 3 second load time',
      'Network throttling (3G, 4G)',
      'Performance acceptable on all sizes'));

    return testCases;
  }

  async createExcelFile(testCases, ticketKey, summary) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    const summaryFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    const summaryFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    const border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    const headers = ['TC_ID', 'Test Type', 'Test Scenario', 'Pre-Condition', 'Test Steps', 'Test Data', 'Expected Result', 'Status'];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.value = header;
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
      cell.border = border;
    });
    worksheet.getRow(1).height = 25;

    testCases.forEach((testCase, rowIndex) => {
      const rowNum = rowIndex + 2;
      headers.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNum, colIndex + 1);
        cell.value = testCase[header] || '';
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        cell.border = border;
      });
      worksheet.getRow(rowNum).height = 120;
    });

    const summaryStartRow = testCases.length + 4;
    const titleCell = worksheet.getCell(summaryStartRow, 1);
    titleCell.value = 'TEST CASE SUMMARY';
    titleCell.fill = summaryFill;
    titleCell.font = summaryFont;
    worksheet.mergeCells(`A${summaryStartRow}:H${summaryStartRow}`);
    worksheet.getRow(summaryStartRow).height = 20;

    const categoryCounts = {};
    testCases.forEach(tc => {
      const type = tc['Test Type'];
      categoryCounts[type] = (categoryCounts[type] || 0) + 1;
    });

    const summaryRows = [
      { label: 'Total Test Cases', value: testCases.length },
      { label: 'Positive Test Cases', value: categoryCounts['Positive'] || 0 },
      { label: 'Negative Test Cases', value: categoryCounts['Negative'] || 0 },
      { label: 'Edge Case Test Cases', value: categoryCounts['Edge Case'] || 0 },
      { label: 'Accessibility Test Cases', value: categoryCounts['Accessibility'] || 0 },
      { label: 'Compatibility Test Cases', value: categoryCounts['Compatibility'] || 0 },
      { label: 'Responsive Test Cases', value: categoryCounts['Responsive'] || 0 },
      { label: 'UI Test Cases', value: categoryCounts['UI'] || 0 },
      { label: 'Cross-Browser Test Cases', value: categoryCounts['Cross-Browser'] || 0 },
      { label: 'Mobile/Tablet/Desktop Test Cases', value: categoryCounts['Mobile/Tablet/Desktop'] || 0 }
    ];

    summaryRows.forEach((item, idx) => {
      const row = summaryStartRow + 2 + idx;
      const labelCell = worksheet.getCell(row, 1);
      const valueCell = worksheet.getCell(row, 2);
      labelCell.value = item.label;
      valueCell.value = item.value;
      labelCell.alignment = { horizontal: 'left', vertical: 'center' };
      valueCell.alignment = { horizontal: 'center', vertical: 'center' };
      labelCell.border = border;
      valueCell.border = border;
      if (item.label === 'Total Test Cases') {
        labelCell.font = { bold: true };
        valueCell.font = { bold: true };
      }
    });

    const columnWidths = { 'A': 8, 'B': 18, 'C': 32, 'D': 28, 'E': 44, 'F': 16, 'G': 36, 'H': 10 };
    Object.keys(columnWidths).forEach(col => { worksheet.getColumn(col).width = columnWidths[col]; });

    const safeSummary = summary.replace(/[<>:"|?*\\/]/g, '-').replace(/\s+/g, ' ').replace(/\s-\s/g, ' - ').trim();
    const filename = `${ticketKey}_${safeSummary}.xlsx`;
    const filepath = path.join(this.outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  async generate(ticketKey) {
    try {
      const ticket = await this.fetchTicket(ticketKey);
      const fields = ticket.fields || {};
      const summary = fields.summary || 'No Summary';
      const description = this.extractText(fields.description) || '';

      const sections = this.parseSections(description);
      const testCases = this.generateComprehensiveTestCases(sections);

      const filepath = await this.createExcelFile(testCases, ticketKey, summary);

      return { filepath, testCaseCount: testCases.length };
    } catch (error) {
      console.error(`✗ Error: ${error.message}`);
      throw error;
    }
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node comprehensive_intelligent_generator.js <TICKET_KEY>');
  console.log('Example: node comprehensive_intelligent_generator.js GAAM-744');
  process.exit(1);
}

const ticketKey = args[0].toUpperCase();
const generator = new ComprehensiveIntelligentGenerator();

(async () => {
  try {
    const result = await generator.generate(ticketKey);
    console.log(`✓ ${result.filepath}`);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
})();
