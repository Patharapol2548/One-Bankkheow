@echo off
title OneBankKheow - Docker Launcher
cd /d "%~dp0.."

echo ========================================================
echo   Starting OneBankKheow Store with Docker
echo   - MySQL Database (Port 3307, with auto-imported SQL)
echo   - Backend API (Port 3100)
echo   - Frontend Web (Port 5500)
echo ========================================================
echo.

docker-compose --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using docker-compose...
    docker-compose up --build -d
) else (
    echo Using docker compose...
    docker compose up --build -d
)

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo   [ERROR] Docker failed to start.
    echo   Common causes:
    echo   1. Docker Desktop is not running (check system tray).
    echo   2. Port 3307 or 3100 or 5500 is already in use.
    echo ========================================================
    pause
    exit /b %errorlevel%
)

echo.
echo Containers started successfully!
echo Frontend is ready at: http://localhost:5500/index.html
echo Backend is ready at:  http://localhost:3100
echo.
echo Opening browser...
start http://localhost:5500/index.html
pause

