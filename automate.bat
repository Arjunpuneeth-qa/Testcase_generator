@echo off
REM JIRA Test Case Generator - Automation Script
REM Usage: automate TICKET_1 [TICKET_2] [TICKET_3] ...

if "%1"=="" (
    echo Usage: automate ^<TICKET_KEY_1^> [TICKET_KEY_2] [TICKET_KEY_3] ...
    echo.
    echo Single ticket:
    echo   automate GAAM-618
    echo.
    echo Multiple tickets:
    echo   automate GAAM-618 GAAM-619 GAAM-620
    exit /b 1
)

node "%~dp0jira_testcase_generator_v2.js" %*
