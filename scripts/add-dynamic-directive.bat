@echo off
echo Running script to add dynamic directives to API routes...
powershell -ExecutionPolicy Bypass -File "%~dp0add-dynamic-directive.ps1"
echo.
echo Script completed. Press any key to exit.
pause > nul 