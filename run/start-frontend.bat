@echo off
title OneBankKheow Front-End
cd /d "%~dp0..\OneBankKheowStore-Front-End-main\html"

echo Starting frontend static server on http://localhost:5500 ...
echo Opening your browser to http://localhost:5500/index.html ...
start http://localhost:5500/index.html

call npx --yes serve . -l 5500
if errorlevel 1 (
    echo.
    echo Trying alternative server (Python or http-server)...
    call npx --yes http-server -p 5500
)
pause

