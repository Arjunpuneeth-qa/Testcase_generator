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
    
    for (let i = 3; i < rows.length; i++) {
      const row = rows[i];
      if (row && row[1]) {
        testCases.push({
          TC_ID: row[1],
          'Test Scenario': row[2],
          'Test Type': row[3]
        });
      }
    }
    
    console.log(`Total Test Cases: ${testCases.length}\n`);
    console.log('TEST CASE BREAKDOWN BY TYPE:\n');
    
    testCases.forEach((tc, idx) => {
      console.log(`${idx + 1}. ${tc.TC_ID}`);
      console.log(`   Scenario: ${tc['Test Scenario']}`);
      console.log(`   Type: ${tc['Test Type']}\n`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

readTestCases(process.argv[2]);
