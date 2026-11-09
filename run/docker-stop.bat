@echo off
title OneBankKheow - Docker Stop
cd /d "%~dp0.."

echo Stopping containers...
docker compose down
if errorlevel 1 (
    docker-compose down
)
echo Done.
pause

