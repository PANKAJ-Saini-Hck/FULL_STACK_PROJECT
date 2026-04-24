# CTF Toolkit - PowerShell One-Click Launcher
# Run with: Right-click → "Run with PowerShell"

$Host.UI.RawUI.WindowTitle = "CTF TOOLKIT LAUNCHER"

Write-Host ""
Write-Host "  ============================================================" -ForegroundColor Cyan
Write-Host "       CYBERPUNK CTF TOOLKIT  -  One-Click Launcher" -ForegroundColor Green
Write-Host "  ============================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  [ERROR] Node.js not found! Install from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "  [ERROR] Python not found! Install from https://python.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "  [OK] Node.js ............ FOUND" -ForegroundColor Green
Write-Host "  [OK] Python ............. FOUND" -ForegroundColor Green
Write-Host ""

# Start Backend in new window
Write-Host "  [*] Starting Backend on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$Host.UI.RawUI.WindowTitle = 'CTF-BACKEND (DO NOT CLOSE)';
    `$Host.UI.RawUI.BackgroundColor = 'Black';
    `$Host.UI.RawUI.ForegroundColor = 'Green';
    Clear-Host;
    Write-Host '[CTF BACKEND] Starting...' -ForegroundColor Green;
    Set-Location '$projectRoot\backend';
    node server.js
"

Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "  [*] Starting Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$Host.UI.RawUI.WindowTitle = 'CTF-FRONTEND (DO NOT CLOSE)';
    `$Host.UI.RawUI.BackgroundColor = 'DarkBlue';
    `$Host.UI.RawUI.ForegroundColor = 'Cyan';
    Clear-Host;
    Write-Host '[CTF FRONTEND] Starting Vite...' -ForegroundColor Cyan;
    Set-Location '$projectRoot\frontend';
    npm run dev
"

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "  ============================================================" -ForegroundColor Cyan
Write-Host "   SUCCESS! Both servers are running." -ForegroundColor Green
Write-Host ""
Write-Host "    Backend   -->  http://localhost:5000" -ForegroundColor White
Write-Host "    Frontend  -->  http://localhost:5173" -ForegroundColor White
Write-Host "  ============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [*] Opening browser..." -ForegroundColor Yellow

# Open browser
Start-Process "http://localhost:5173"

Write-Host "  [*] Done! You can close this window." -ForegroundColor Green
Write-Host "      Keep the GREEN and BLUE terminal windows OPEN." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to close this launcher"
