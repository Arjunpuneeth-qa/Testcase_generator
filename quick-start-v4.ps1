# Quick Start Script for V4 - Intelligent Test Case Generator

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "V4 - Intelligent Test Case Generator - Quick Start" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "[ERROR] .env file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create a .env file with your JIRA credentials:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   JIRA_EMAIL=am.puneeth@bounteous.com" -ForegroundColor Gray
    Write-Host "   JIRA_API_TOKEN=your_api_token_here" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Get your API token from:" -ForegroundColor Yellow
    Write-Host "   https://id.atlassian.com/manage-profile/security/api-tokens" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] .env file found" -ForegroundColor Green
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[SUCCESS] Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Check if v4 file exists
if (-not (Test-Path "jira_testcase_generator_v4.js")) {
    Write-Host "[ERROR] V4 file not found: jira_testcase_generator_v4.js" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] V4 Generator found" -ForegroundColor Green
Write-Host ""

# Get ticket argument
if ($args.Count -eq 0) {
    Write-Host "Usage: .\quick-start-v4.ps1 TICKET_KEY [TICKET_KEY_2] [...]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "   .\quick-start-v4.ps1 GAAM-933" -ForegroundColor Gray
    Write-Host "   .\quick-start-v4.ps1 GAAM-933 GAAM-934 GAAM-935" -ForegroundColor Gray
    Write-Host ""
    $tickets = Read-Host "Enter ticket key(s) to generate (space-separated)"
    if ([string]::IsNullOrWhiteSpace($tickets)) {
        Write-Host "[ERROR] No ticket provided" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[INFO] Generating INTELLIGENT test cases for: $tickets" -ForegroundColor Yellow
    Write-Host ""
    node jira_testcase_generator_v4.js $tickets.Split()
} else {
    Write-Host "[INFO] Generating INTELLIGENT test cases for: $($args -join ' ')" -ForegroundColor Yellow
    Write-Host ""
    node jira_testcase_generator_v4.js $args
}

Write-Host ""
Write-Host "[INFO] Test cases have been generated in:" -ForegroundColor Green
Write-Host "   C:\Users\PuneethAM\GA_testcases\GA_testcases\" -ForegroundColor Gray
Write-Host ""
Write-Host "[INFO] V4 generates SMART test cases based on:" -ForegroundColor Cyan
Write-Host "   • Ticket description analysis" -ForegroundColor Gray
Write-Host "   • Acceptance criteria extraction" -ForegroundColor Gray
Write-Host "   • Feature-specific test detection" -ForegroundColor Gray
Write-Host "   • Detailed step-by-step instructions" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
