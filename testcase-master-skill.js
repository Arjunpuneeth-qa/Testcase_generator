#!/usr/bin/env node

/**
 * /testcase MASTER SKILL
 * =====================
 * Usage: /testcase GAAM-933
 *        /testcase GAAM-933 GAAM-524 GAAM-687
 *
 * Runs: jira_testcase_generator_master.js
 * Features: All generators + Boundary testing + Summary
 */

const { spawn } = require('child_process');
const path = require('path');

function runMasterGenerator(ticketIds) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'jira_testcase_generator_master.js');

    console.log('\n' + '='.repeat(80));
    console.log('🧪 MASTER TEST CASE GENERATOR');
    console.log('Combined: V2 + V3 + V4 + Ultimate + Boundary Testing');
    console.log('='.repeat(80) + '\n');

    const process = spawn('node', [scriptPath, ...ticketIds], {
      cwd: __dirname,
      stdio: 'inherit',
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Test cases generated successfully!\n');
        resolve();
      } else {
        console.error(`\n❌ Error: Process exited with code ${code}\n`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    process.on('error', (err) => {
      console.error(`\n❌ Error: ${err.message}\n`);
      reject(err);
    });
  });
}

async function main() {
  const ticketIds = process.argv.slice(2);

  if (ticketIds.length === 0) {
    console.error('\n❌ Usage: /testcase GAAM-933');
    console.error('   Usage: /testcase GAAM-933 GAAM-524 GAAM-687\n');
    process.exit(1);
  }

  try {
    await runMasterGenerator(ticketIds);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

main();
