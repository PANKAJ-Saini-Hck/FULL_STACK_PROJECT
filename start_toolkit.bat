@echo off
title CTF TOOLKIT LAUNCHER
color 0A
cls

echo.
echo  ============================================================
echo       CYBERPUNK CTF TOOLKIT  -  One-Click Launcher
echo  ============================================================
echo.

:: Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  [ERROR] Node.js not found! Install from https://nodejs.org
    pause
    exit /b 1
)

:: Check Python
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  [ERROR] Python not found! Install from https://python.org
    pause
    exit /b 1
)

echo  [OK] Node.js ............ FOUND
echo  [OK] Python ............. FOUND
echo.
echo  [*] Starting Backend on port 5000...
start "CTF-BACKEND  (DO NOT CLOSE)" cmd /k "color 0A && title CTF-BACKEND && cd /d "%~dp0backend" && node server.js"

timeout /t 3 /nobreak >nul

echo  [*] Starting Frontend on port 5173...
start "CTF-FRONTEND (DO NOT CLOSE)" cmd /k "color 0B && title CTF-FRONTEND && cd /d "%~dp0frontend" && npm run dev"

timeout /t 4 /nobreak >nul

echo.
echo  ============================================================
echo   SUCCESS! Both servers are running.
echo.
echo    Backend   --  http://localhost:5000
echo    Frontend  --  http://localhost:5173
echo  ============================================================
echo.
echo  [*] Opening browser...
start "" "http://localhost:5173"

echo  [*] Done! You can close this window.
echo      Keep the two BLACK/BLUE terminal windows OPEN.
echo.
pause
