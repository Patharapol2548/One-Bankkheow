@echo off
setlocal enabledelayedexpansion
title OneBankKheow Store - Quick Launcher
cd /d "%~dp0.."
color 0B

echo =======================================================================
echo           ONEBANKKHEOW STORE - AUTOMATIC SYSTEM LAUNCHER
echo =======================================================================
echo.
echo   [1/3] Checking Docker status...

:: Check if Docker CLI is installed
where docker >nul 2>&1
if %errorlevel% neq 0 (
    goto :docker_missing
)

:: Check if Docker daemon is running
docker info >nul 2>&1
if %errorlevel% == 0 (
    echo   [OK] Docker engine is running.
    goto :start_containers
)

:: Docker is installed but daemon is not responding. Check for Docker Desktop.
echo   [!] Docker is installed but the background engine is not ready yet.
set "DOCKER_EXE="
if exist "%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe" (
    set "DOCKER_EXE=%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe"
) else if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    set "DOCKER_EXE=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
) else if exist "%ProgramFiles(x86)%\Docker\Docker\Docker Desktop.exe" (
    set "DOCKER_EXE=%ProgramFiles(x86)%\Docker\Docker\Docker Desktop.exe"
)

if defined DOCKER_EXE (
    echo   [*] Launching Docker Desktop from:
    echo       "%DOCKER_EXE%"
    start "" "%DOCKER_EXE%"
    echo   [*] Waiting for Docker engine to become ready (this may take 20-40s)...
    
    set /a attempts=0
    :wait_loop
    ping -n 3 127.0.0.1 >nul
    docker info >nul 2>&1
    if %errorlevel% == 0 (
        echo.
        echo   [OK] Docker engine is now ready!
        goto :start_containers
    )
    set /a attempts+=1
    <nul set /p =.
    if !attempts! geq 30 goto :docker_wait_failed
    goto :wait_loop
) else (
    goto :docker_daemon_offline
)

:start_containers
echo.
echo   [2/3] Building and starting containers (MySQL, Backend, Frontend)...
echo         Please wait a moment...
echo.

docker compose up --build -d >nul 2>&1
if %errorlevel% neq 0 (
    docker-compose up --build -d
)

if %errorlevel% neq 0 (
    echo.
    echo   [ERROR] Failed to start Docker containers.
    echo   Check if ports 5500, 3100, or 3307 are already in use by another app.
    pause
    exit /b 1
)

echo   [3/3] Containers started! Initializing database and services...
ping -n 5 127.0.0.1 >nul

echo   [OK] Opening OneBankKheow Store in your browser...
start http://localhost:5500/index.html

echo.
echo =======================================================================
echo                  ONEBANKKHEOW STORE IS RUNNING!
echo =======================================================================
echo.
echo   [Web Links]
echo   - Customer Store:   http://localhost:5500/index.html
echo   - Admin Dashboard:  http://localhost:5500/admin-login.html
echo   - Backend API:      http://localhost:3100
echo.
echo   [Demo Accounts for HR / Evaluators]
echo   - Customer Login:
echo       Email:    somchai@email.com
echo       Password: pwd001
echo   - Admin Login:
echo       Username: admin01
echo       Password: admin123
echo.
echo   [To Stop the Application]
echo   - Double-click "STOP.bat" in the "run" folder.
echo.
echo =======================================================================
echo Press any key to close this launcher window (the app keeps running).
pause >nul
exit /b 0

:docker_wait_failed
echo.
echo.
echo =======================================================================
echo   [NOTICE] Docker Desktop was started, but the engine is taking longer
echo   than expected to boot up.
echo   Please check your Windows system tray (bottom-right taskbar) to ensure
echo   Docker Desktop finishes starting, then double-click START.bat again.
echo =======================================================================
echo.
pause
exit /b 1

:docker_daemon_offline
echo.
echo =======================================================================
echo   [ERROR] Docker Desktop is installed but not currently running.
echo   Please open Docker Desktop from your Start Menu, wait for it to
echo   show "Engine running", and run START.bat again.
echo =======================================================================
echo.
goto :ask_local_run

:docker_missing
echo.
echo =======================================================================
echo   [NOTICE] Docker is not installed on this system.
echo.
echo   Option A (Recommended): Install Docker Desktop
echo     https://www.docker.com/products/docker-desktop/
echo.
echo   Option B: Run locally using Node.js ^& MySQL
echo =======================================================================
echo.
:ask_local_run
set /p RUN_LOCAL="Would you like to try launching with local Node.js instead? (y/n): "
if /i "%RUN_LOCAL%"=="y" (
    echo.
    echo Starting local Backend in a separate window...
    start "OneBankKheow Backend" cmd /c "%~dp0start-backend.bat"
    echo Starting local Frontend in a separate window...
    start "OneBankKheow Frontend" cmd /c "%~dp0start-frontend.bat"
    exit /b 0
)

pause
exit /b 1

