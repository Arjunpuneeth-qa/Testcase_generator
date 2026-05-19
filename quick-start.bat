@echo off
REM Quick Start Script for JIRA Test Case Generator

echo.
echo ======================================================================
echo JIRA Test Case Generator - Quick Start
echo ======================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo.
    echo Please create a .env file with your JIRA credentials:
    echo.
    echo   JIRA_EMAIL=am.puneeth@bounteous.com
    echo   JIRA_API_TOKEN=your_api_token_here
    echo.
    echo Get your API token from:
    echo   https://id.atlassian.com/manage-profile/security/api-tokens
    echo.
    pause
    exit /b 1
)

echo [INFO] .env file found
echo.

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed
    echo.
)

REM Check if ticket argument is provided
if "%1"=="" (
    echo Usage: quick-start.bat TICKET_KEY [TICKET_KEY_2] [...]
    echo.
    echo Examples:
    echo   quick-start.bat GAAM-618
    echo   quick-start.bat GAAM-618 GAAM-687 GAAM-625
    echo.
    set /p tickets="Enter ticket key(s) to generate (space-separated): "
    if "!tickets!"=="" (
        echo [ERROR] No ticket provided
        pause
        exit /b 1
    )
    setlocal enabledelayedexpansion
    call node jira_testcase_generator.js !tickets!
) else (
    echo [INFO] Generating test cases for: %*
    echo.
    call node jira_testcase_generator.js %*
)

echo.
echo [INFO] Test cases have been generated in:
echo   C:\Users\PuneethAM\GA_testcases\GA_testcases\
echo.
pause
