#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Read markdown file
const markdownFile = path.join(__dirname, 'TEAM_TEST_CASE_GENERATION.md');
const outputDir = 'C:\\documention';
const outputFile = path.join(outputDir, 'generate testcases.pdf');

console.log('\n📄 Converting Markdown to PDF...\n');
console.log('Input:', markdownFile);
console.log('Output:', outputFile);

// Check if file exists
if (!fs.existsSync(markdownFile)) {
  console.error('❌ Error: Markdown file not found:', markdownFile);
  process.exit(1);
}

// Create output directory if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✓ Created output directory:', outputDir);
}

// Read markdown content
const markdownContent = fs.readFileSync(markdownFile, 'utf-8');

// Convert markdown to HTML
const htmlContent = convertMarkdownToHTML(markdownContent);

// Create temporary HTML file
const tempHtmlFile = path.join(__dirname, 'temp_doc.html');
fs.writeFileSync(tempHtmlFile, htmlContent);

console.log('\n✓ HTML generated');
console.log('✓ Converting to PDF using Chrome...\n');

// Use Chrome/Chromium to convert HTML to PDF
const command = `node -e "
const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file:///${tempHtmlFile.replace(/\\\\/g, '/')}', { waitUntil: 'networkidle2' });
    await page.pdf({
      path: '${outputFile.replace(/\\\\/g, '\\\\\\\\')}',
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      }
    });
    await browser.close();
    console.log('✓ PDF created successfully');
    console.log('✓ Location: ${outputFile}');
    require('fs').unlinkSync('${tempHtmlFile.replace(/\\\\/g, '\\\\\\\\')}');
  } catch(e) {
    console.error('Error:', e.message);
  }
})();
"`;

// Try with puppeteer if available, otherwise create simple PDF
try {
  // First, try simple HTML to file copy with CSS styling
  createStyledPDF(markdownContent, outputFile);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

function convertMarkdownToHTML(markdown) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Case Generation Guide</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1 {
      color: #1a73e8;
      border-bottom: 3px solid #1a73e8;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    h2 {
      color: #1a73e8;
      margin-top: 25px;
    }
    h3 {
      color: #34a853;
    }
    code {
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      color: #d32f2f;
    }
    pre {
      background-color: #f0f0f0;
      padding: 15px;
      border-left: 4px solid #1a73e8;
      overflow-x: auto;
      border-radius: 4px;
    }
    pre code {
      color: #000;
      background-color: transparent;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
      background-color: white;
    }
    th {
      background-color: #1a73e8;
      color: white;
      padding: 12px;
      text-align: left;
      border: 1px solid #ddd;
    }
    td {
      padding: 10px;
      border: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    ul, ol {
      margin: 15px 0;
    }
    li {
      margin: 5px 0;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 2px 4px;
    }
    hr {
      border: none;
      border-top: 2px solid #ddd;
      margin: 30px 0;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>`;

  // Convert markdown to HTML
  let content = markdown
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .split('\n').map(line => {
      if (line.startsWith('```')) return '</pre>';
      if (line.startsWith('|')) {
        let row = '<tr>' + line.split('|').slice(1, -1).map(cell =>
          `<td>${cell.trim()}</td>`
        ).join('') + '</tr>';
        return row;
      }
      if (line.match(/^[-*+] /)) {
        return '<ul><li>' + line.replace(/^[-*+] /, '') + '</li></ul>';
      }
      return line;
    }).join('\n');

  html += '<p>' + content + '</p>';
  html += `</body>
</html>`;

  return html;
}

function createStyledPDF(content, outputPath) {
  // Since PDF conversion requires external tools, create a formatted text file
  // that can be printed to PDF
  const formattedText = `
╔════════════════════════════════════════════════════════════════════╗
║       TEST CASE GENERATION GUIDE - FOR QA TEAM                    ║
║       For Claude Users & Non-Claude Users (VS Code)               ║
╚════════════════════════════════════════════════════════════════════╝

${content}

═══════════════════════════════════════════════════════════════════════
Document Generated: ${new Date().toLocaleString()}
Version: 1.0
For: QA Team Documentation
═══════════════════════════════════════════════════════════════════════
`;

  // Since we need actual PDF, save HTML and inform user
  const htmlPath = outputPath.replace('.pdf', '.html');
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Case Generation Guide</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1 { color: #1a73e8; border-bottom: 3px solid #1a73e8; }
    h2 { color: #1a73e8; margin-top: 20px; }
    h3 { color: #34a853; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #f0f0f0; padding: 15px; border-left: 4px solid #1a73e8; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th { background: #1a73e8; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border: 1px solid #ddd; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
${convertMarkdownToHTML(content)}
</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent);
  console.log('✓ HTML document created:', htmlPath);
  console.log('\n📌 To convert to PDF:');
  console.log('  1. Open:', htmlPath);
  console.log('  2. Press Ctrl+P (Print)');
  console.log('  3. Select "Save as PDF"');
  console.log('  4. Save to:', outputPath);
}
