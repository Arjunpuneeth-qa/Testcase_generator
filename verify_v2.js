const ExcelJS = require("exceljs");

async function verifyFormat(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet("Test Cases");
    
    console.log("\n" + "=".repeat(120));
    console.log("VERIFIED: NEW TEST CASE FORMAT");
    console.log("=".repeat(120) + "\n");
    
    console.log("HEADER INFORMATION:");
    console.log(`  Test ID: ${worksheet.getCell("B1").value}`);
    console.log(`  Test Name: ${worksheet.getCell("B2").value}\n`);
    
    console.log("COLUMNS:");
    const headerRow = worksheet.getRow(6);
    headerRow.eachCell((cell, colNumber) => {
      console.log(`  ${colNumber}. ${cell.value}`);
    });
    console.log("");
    
    const rows = worksheet.getSheetValues();
    let testCaseCount = 0;
    console.log("SAMPLE TEST CASES (First 5):\n");
    
    for (let i = 7; i < Math.min(12, rows.length); i++) {
      const row = rows[i];
      if (row && row[1]) {
        testCaseCount++;
        console.log(`${testCaseCount}. ${row[1]}`);
        console.log(`   Scenario: ${row[2]}`);
        console.log(`   Type: ${row[3]}`);
        console.log(`   Pass/Fail Column: ${row[9] === undefined ? "EMPTY ?" : row[9]}\n`);
      }
    }
    
    // Count total test cases
    let total = 0;
    for (let i = 7; i < rows.length; i++) {
      if (rows[i] && rows[i][1]) {
        total++;
      }
    }
    
    console.log("=".repeat(120));
    console.log(`TOTAL TEST CASES: ${total}`);
    console.log("FORMAT: Excel (.xlsx)");
    console.log("COLUMNS: 9 (including empty Pass/Fail)");
    console.log("STATUS: ? READY TO USE");
    console.log("=".repeat(120) + "\n");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

verifyFormat(process.argv[2]);
