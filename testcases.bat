@echo off
REM JIRA Universal Test Case Generator - Automation Script
REM Generates comprehensive test cases for ANY JIRA ticket
REM Coverage: Positive, Negative, Edge Cases, Accessibility, Responsive, Browser Compatibility
REM Usage: testcases TICKET_1 [TICKET_2] [TICKET_3] ...

if "%1"=="" (
    echo.
    echo JIRA Universal Test Case Generator
    echo ====================================
    echo.
    echo Usage: testcases ^<TICKET_KEY_1^> [TICKET_KEY_2] [TICKET_KEY_3] ...
    echo.
    echo Single ticket:
    echo   testcases GAAM-744
    echo.
    echo Multiple tickets:
    echo   testcases GAAM-744 GAAM-618 GAAM-612
    echo.
    echo Test coverage:
    echo   - Positive functional tests
    echo   - Negative and edge case tests
    echo   - Accessibility tests (WCAG 2.2 AA)
    echo   - Responsive design (mobile, tablet, desktop)
    echo   - Browser compatibility (Chrome, Firefox, Safari, Edge)
    echo   - QA and final verification
    echo.
    exit /b 1
)

node "%~dp0comprehensive_intelligent_generator.js" %*
