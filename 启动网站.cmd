@echo off
cd /d "%~dp0"

if not exist "runtime\node.exe" (
  echo Local runtime is missing.
  pause
  exit /b 1
)

if not exist "dist\index.html" (
  echo The website build is missing.
  pause
  exit /b 1
)

start "Lithos Local Server" /min "%~dp0runtime\node.exe" "%~dp0local-server.mjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
