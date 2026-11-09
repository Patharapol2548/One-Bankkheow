@echo off
title OneBankKheow Store - Shutdown
cd /d "%~dp0.."
color 0C

echo =======================================================================
echo           ONEBANKKHEOW STORE - STOPPING SERVICES
echo =======================================================================
echo.
echo Stopping and removing Docker containers (MySQL, Backend, Frontend)...

docker compose down >nul 2>&1
if %errorlevel% neq 0 (
    docker-compose down
)

echo.
echo =======================================================================
echo   [OK] All OneBankKheow services have been stopped successfully!
echo   Your database data is safely preserved inside the Docker volume.
echo =======================================================================
echo.
pause

