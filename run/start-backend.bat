@echo off
title OneBankKheow Backend API
cd /d "%~dp0..\OneBankKheowStore-Back-End-main"

if not exist node_modules (
    echo [1/2] Installing backend dependencies (this only happens once)...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies. Check your internet connection and Node.js installation.
        pause
        exit /b 1
    )
)

echo [2/2] Starting Backend Server on http://localhost:3100 ...
echo Database configured in .env: itcs223_store
echo.
call npm start
if errorlevel 1 (
    echo Nodemon encountered an issue. Starting directly with node...
    node app.js
)
pause

