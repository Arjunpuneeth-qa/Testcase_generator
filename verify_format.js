const ExcelJS = require("exceljs");

async function readTestCases(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet("Test Cases");
    
    console.log("\n" + "=".repeat(120));
    console.log("UPDATED TEST CASE FORMAT - WITH BRIEF DESCRIPTIONS");
    console.log("=".repeat(120) + "\n");
    
    const rows = worksheet.getSheetValues();
    const testCases = [];
    
    for (let i = 3; i < rows.length; i++) {
      const row = rows[i];
      if (row && row[1]) {
        testCases.push({
          TC_ID: row[1],
          "Test Scenario": row[2],
          "Test Type": row[3],
          "Brief": row[8]
        });
      }
    }
    
    console.log(`Total Test Cases: ${testCases.length}\n`);
    
    testCases.slice(0, 10).forEach((tc, idx) => {
      console.log(`${idx + 1}. ${tc.TC_ID}`);
      console.log(`   Scenario: ${tc["Test Scenario"]}`);
      console.log(`   Type: ${tc["Test Type"]}`);
      console.log(`   Brief: ${tc["Brief"]}\n`);
    });
    
    console.log("... and " + (testCases.length - 10) + " more test cases\n");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readTestCases(process.argv[2]);
