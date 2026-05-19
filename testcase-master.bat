@echo off
REM ============================================================================
REM MASTER TEST CASE GENERATOR - Batch Wrapper
REM ============================================================================
REM Usage: testcase-master GAAM-933
REM        testcase-master GAAM-933 GAAM-524 GAAM-687
REM ============================================================================

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo ============================================================================
    echo ERROR: Missing JIRA Ticket ID
    echo ============================================================================
    echo.
    echo Usage: testcase-master GAAM-933
    echo        testcase-master GAAM-933 GAAM-524 GAAM-687
    echo.
    echo Features:
    echo   - Combines all 4 generators (V2, V3, V4, Ultimate)
    echo   - Includes 26 boundary value tests
    echo   - Generates test case summary sheet
    echo   - Creates professional Excel files
    echo.
    exit /b 1
)

cd /d "%~dp0"

echo.
echo ============================================================================
echo MASTER TEST CASE GENERATOR
echo ============================================================================
echo Combining: V2 + V3 + V4 + Ultimate + Boundary Testing
echo.
echo Processing: %*
echo.

node jira_testcase_generator_master_enhanced.js %*

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
echo ============================================================================
echo.

endlocal
