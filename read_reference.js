const ExcelJS = require("exceljs");

async function readExcel(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    console.log("\n" + "=".repeat(150));
    console.log("REFERENCE FILE FORMAT ANALYSIS");
    console.log("=".repeat(150) + "\n");
    
    // Get first worksheet
    const worksheet = workbook.worksheets[0];
    console.log(`Worksheet Name: ${worksheet.name}\n`);
    
    const rows = worksheet.getSheetValues();
    
    console.log("FIRST 20 ROWS:\n");
    rows.slice(0, 20).forEach((row, idx) => {
      if (row) {
        const cols = row.slice(0, 8).map(cell => cell ? `"${String(cell).substring(0, 40)}"` : "");
        console.log(`${idx + 1}: ${cols.join(" | ")}`);
      }
    });
    
    console.log("\n" + "=".repeat(150));
    console.log("DETAILED TEST CASE STRUCTURE:\n");
    
    let tcCount = 0;
    for (let i = 0; i < rows.length && tcCount < 3; i++) {
      const row = rows[i];
      if (row && row[1] && String(row[1]).includes("TC_")) {
        tcCount++;
        console.log(`\nTEST CASE ${tcCount}:`);
        for (let j = 1; j <= 8; j++) {
          console.log(`  Col ${j}: ${row[j] ? String(row[j]).substring(0, 100) : "EMPTY"}`);
        }
      }
    }
    
    console.log("\n" + "=".repeat(150) + "\n");
    
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
  }
}

readExcel(process.argv[2]);
