#!/usr/bin/env node

/**
 * Testcase Skill Wrapper - V4 Generator Handler
 * Runs V4 intelligent test case generator from /testcase skill
 * Usage: node testcase.js GAAM-933 [GAAM-934] [...]
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ============================================================================
// LOGGER
// ============================================================================

class Logger {
  static info(msg) {
    console.log(`[INFO] ${msg}`);
  }

  static success(msg) {
    console.log(`✓ ${msg}`);
  }

  static error(msg) {
    console.error(`✗ ${msg}`);
  }

  static section(title) {
    console.log(`\n${'='.repeat(70)}\n${title}\n${'='.repeat(70)}\n`);
  }
}

// ============================================================================
// TESTCASE SKILL HANDLER
// ============================================================================

class TestcaseSkillHandler {
  constructor() {
    this.projectDir = __dirname;
    this.outputDir = path.join(this.projectDir, 'GA_testcases');
    this.v4Script = path.join(this.projectDir, 'jira_testcase_generator_v4.js');
  }

  /**
   * Validate environment and dependencies
   */
  validateEnvironment() {
    const errors = [];

    // Check .env file
    const envFile = path.join(this.projectDir, '.env');
    if (!fs.existsSync(envFile)) {
      errors.push('.env file not found');
    }

    // Check V4 script
    if (!fs.existsSync(this.v4Script)) {
      errors.push('V4 generator script not found: jira_testcase_generator_v4.js');
    }

    // Check node_modules
    const modulesDir = path.join(this.projectDir, 'node_modules');
    if (!fs.existsSync(modulesDir)) {
      errors.push('Dependencies not installed (run: npm install)');
    }

    if (errors.length > 0) {
      Logger.error('Environment validation failed:');
      errors.forEach(e => Logger.error(`  - ${e}`));
      return false;
    }

    return true;
  }

  /**
   * Ensure output directory exists
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      Logger.success(`Created output directory: ${this.outputDir}`);
    }
  }

  /**
   * Run V4 generator with provided tickets
   */
  async runV4(ticketKeys) {
    return new Promise((resolve, reject) => {
      Logger.info(`Running V4 generator for ${ticketKeys.length} ticket(s)...`);

      const v4Process = spawn('node', [this.v4Script, ...ticketKeys], {
        cwd: this.projectDir,
        stdio: 'inherit',
        shell: true
      });

      v4Process.on('close', (code) => {
        if (code === 0) {
          Logger.success('V4 generator completed successfully');
          resolve(true);
        } else {
          Logger.error(`V4 generator exited with code ${code}`);
          reject(new Error(`V4 generator failed with exit code ${code}`));
        }
      });

      v4Process.on('error', (err) => {
        Logger.error(`Failed to run V4 generator: ${err.message}`);
        reject(err);
      });
    });
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(ticketKeys) {
    const files = [];

    try {
      const filesInDir = fs.readdirSync(this.outputDir);

      ticketKeys.forEach(ticketKey => {
        const ticketFiles = filesInDir.filter(f => f.startsWith(ticketKey));
        ticketFiles.forEach(file => {
          files.push({
            ticket: ticketKey,
            filename: file,
            path: path.join(this.outputDir, file),
            url: `file://${path.join(this.outputDir, file).replace(/\\/g, '/')}`
          });
        });
      });
    } catch (error) {
      Logger.error(`Failed to list generated files: ${error.message}`);
    }

    return files;
  }

  /**
   * Main handler
   */
  async handle(ticketKeys) {
    Logger.section('TESTCASE SKILL - V4 INTELLIGENT GENERATOR');

    // Validate environment
    if (!this.validateEnvironment()) {
      process.exit(1);
    }

    // Ensure output directory
    this.ensureOutputDir();

    // Run V4
    try {
      await this.runV4(ticketKeys);

      // Get generated files
      const generatedFiles = this.getGeneratedFiles(ticketKeys);

      Logger.section('TESTCASE GENERATION COMPLETE');

      if (generatedFiles.length > 0) {
        console.log('Generated Files:');
        generatedFiles.forEach((file, idx) => {
          console.log(`  ${idx + 1}. ${file.ticket}`);
          console.log(`     File: ${file.filename}`);
          console.log(`     Path: ${file.path}`);
        });
        console.log('');
      }

      console.log(`Output Location: ${this.outputDir}`);
      console.log('');
      process.exit(0);
    } catch (error) {
      Logger.error(`Skill execution failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: /testcase TICKET_KEY [TICKET_KEY_2] [...]');
    console.log('\nExamples:');
    console.log('  /testcase GAAM-933');
    console.log('  /testcase GAAM-933 GAAM-934 GAAM-935');
    console.log('\nOr direct command:');
    console.log('  node testcase.js GAAM-933');
    process.exit(1);
  }

  const ticketKeys = args.map(key => key.toUpperCase());
  const handler = new TestcaseSkillHandler();

  await handler.handle(ticketKeys);
}

// Run main
main().catch(error => {
  Logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
