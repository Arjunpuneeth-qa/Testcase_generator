const ExcelJS = require('exceljs');
const path = require('path');

async function readTestCases(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Test Cases');
    
    console.log('\n' + '='.repeat(100));
    console.log('TEST CASE COVERAGE ANALYSIS');
    console.log('='.repeat(100) + '\n');
    
    const rows = worksheet.getSheetValues();
    const testCases = [];
    
    // Skip header rows (rows 1-2)
    for (let i = 3; i < rows.length; i++) {
      const row = rows[i];
      if (row && row[1]) { // If TC_ID exists
        testCases.push({
          TC_ID: row[1],
          'Test Scenario': row[2],
          'Test Type': row[3],
          'Pre-Condition': row[4],
          'Test Steps': row[5],
          'Test Data': row[6],
          'Expected Result': row[7],
          'Status': row[8]
        });
      }
    }
    
    console.log(`Total Test Cases: ${testCases.length}\n`);
    
    // Categorize by test type
    const categories = {};
    testCases.forEach(tc => {
      const testType = tc['Test Scenario'].split(']')[0].replace('[', '').trim();
      if (!categories[testType]) {
        categories[testType] = [];
      }
      categories[testType].push(tc);
    });
    
    // Display categorized results
    Object.keys(categories).sort().forEach(category => {
      console.log(`\n📋 ${category} (${categories[category].length} cases)`);
      console.log('-'.repeat(95));
      categories[category].forEach(tc => {
        console.log(`  ✓ ${tc.TC_ID}: ${tc['Test Scenario']}`);
        console.log(`    Type: ${tc['Test Type']}`);
        console.log(`    Data: ${tc['Test Data'].substring(0, 80)}...`);
      });
    });
    
    // Coverage summary
    console.log('\n\n' + '='.repeat(100));
    console.log('COVERAGE SUMMARY');
    console.log('='.repeat(100));
    
    const hasPositive = Object.keys(categories).some(c => c.includes('POSITIVE'));
    const hasNegative = Object.keys(categories).some(c => c.includes('NEGATIVE'));
    const hasEdgeCase = Object.keys(categories).some(c => c.includes('EDGE'));
    const hasSecurity = Object.keys(categories).some(c => c.includes('SECURITY'));
    const hasPerformance = Object.keys(categories).some(c => c.includes('PERFORMANCE'));
    const hasErrorHandling = Object.keys(categories).some(c => c.includes('ERROR'));
    const hasDataIntegrity = Object.keys(categories).some(c => c.includes('DATA'));
    const hasValidation = Object.keys(categories).some(c => c.includes('VALIDATION'));
    const hasUI = Object.keys(categories).some(c => c.includes('UI'));
    const hasIntegration = Object.keys(categories).some(c => c.includes('INTEGRATION'));
    const hasRegression = Object.keys(categories).some(c => c.includes('REGRESSION'));
    const hasState = Object.keys(categories).some(c => c.includes('STATE'));
    const hasCompatibility = Object.keys(categories).some(c => c.includes('COMPATIBILITY'));
    const hasWorkflow = Object.keys(categories).some(c => c.includes('WORKFLOW'));
    const hasMonitoring = Object.keys(categories).some(c => c.includes('MONITORING'));
    
    console.log(`\n✅ BASIC SCENARIOS:`);
    console.log(`  ${hasPositive ? '✓' : '✗'} Positive/Happy Path Tests`);
    console.log(`  ${hasNegative ? '✓' : '✗'} Negative/Invalid Input Tests`);
    console.log(`  ${hasEdgeCase ? '✓' : '✗'} Edge Case/Boundary Tests`);
    
    console.log(`\n🔒 SECURITY & PERMISSIONS:`);
    console.log(`  ${hasSecurity ? '✓' : '✗'} Security/Authorization Tests`);
    
    console.log(`\n⚡ PERFORMANCE & LOAD:`);
    console.log(`  ${hasPerformance ? '✓' : '✗'} Performance/Concurrency Tests`);
    
    console.log(`\n❌ ERROR HANDLING:`);
    console.log(`  ${hasErrorHandling ? '✓' : '✗'} Error Handling & Recovery Tests`);
    
    console.log(`\n📊 DATA & VALIDATION:`);
    console.log(`  ${hasDataIntegrity ? '✓' : '✗'} Data Integrity Tests`);
    console.log(`  ${hasValidation ? '✓' : '✗'} Input Validation Tests`);
    
    console.log(`\n🎨 UI & EXPERIENCE:`);
    console.log(`  ${hasUI ? '✓' : '✗'} UI/UX Tests`);
    
    console.log(`\n🔗 INTEGRATION & COMPATIBILITY:`);
    console.log(`  ${hasIntegration ? '✓' : '✗'} Integration Tests`);
    console.log(`  ${hasCompatibility ? '✓' : '✗'} Backward Compatibility Tests`);
    
    console.log(`\n🔄 WORKFLOW & STATE:`);
    console.log(`  ${hasWorkflow ? '✓' : '✗'} Workflow Tests`);
    console.log(`  ${hasState ? '✓' : '✗'} State Management Tests`);
    
    console.log(`\n📈 MONITORING:`);
    console.log(`  ${hasMonitoring ? '✓' : '✗'} Monitoring & Logging Tests`);
    console.log(`  ${hasRegression ? '✓' : '✗'} Regression Tests`);
    
    console.log('\n' + '='.repeat(100) + '\n');
    
  } catch (error) {
    console.error('Error reading Excel file:', error.message);
  }
}

const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: node read_testcases.js <excel_file_path>');
  process.exit(1);
}

readTestCases(filePath);
