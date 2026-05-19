@echo off
REM ============================================================================
REM TEST CASE GENERATOR - Reference Format
REM ============================================================================
REM Usage: testcase-reference GAAM-933
REM        testcase-reference GAAM-933 GAAM-524 GAAM-687
REM ============================================================================

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo ============================================================================
    echo ERROR: Missing JIRA Ticket ID
    echo ============================================================================
    echo.
    echo Usage: testcase-reference GAAM-933
    echo        testcase-reference GAAM-933 GAAM-524 GAAM-687
    echo.
    echo Features:
    echo   - EXACT same format as GAAM-524 reference file
    echo   - Same column headers (TC_ID, Test Type, Test Scenario, etc.)
    echo   - Same summary layout (TEST CASE SUMMARY at bottom)
    echo   - 83 comprehensive test cases (vs 57 in reference)
    echo   - Professional Excel formatting
    echo.
    exit /b 1
)

cd /d "%~dp0"

echo.
echo ============================================================================
echo TEST CASE GENERATOR - Reference Format
echo ============================================================================
echo Same format as GAAM-524 reference | 83 comprehensive test cases
echo.
echo Processing: %*
echo.

node jira_testcase_generator_reference_format.js %*

if %errorlevel% neq 0 (
    echo.
    echo ============================================================================
    echo ERROR: Test case generation failed
    echo ============================================================================
    exit /b 1
)

echo.
echo ============================================================================
echo SUCCESS: Test cases generated!
echo Output: GA_testcases\ folder
echo Format: IDENTICAL to GAAM-524 reference file
echo ============================================================================
echo.

endlocal
