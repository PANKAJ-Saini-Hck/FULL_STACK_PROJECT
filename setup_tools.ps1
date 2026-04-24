# This script installs the necessary CTF tools using Chocolatey.
# Run this script in an Administrative PowerShell terminal.

Write-Host "--- CTF Toolkit Setup Wizard ---" -ForegroundColor Cyan

# Check for Chocolatey
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Chocolatey is not installed. Installing it now..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

$tools = @(
    "exiftool",
    "ffmpeg",
    "hashcat",
    "johntheripper",
    "gobuster",
    "steghide",
    "python",
    "ruby",
    "golang",
    "binwalk"
)

foreach ($tool in $tools) {
    Write-Host "[*] Checking/Installing $tool..." -ForegroundColor Cyan
    choco install $tool -y
}

# Python specific tools
Write-Host "[*] Installing Python dependencies (binwalk, stegcracker)..." -ForegroundColor Cyan
pip install binwalk stegcracker hash-identifier

# Ruby specific tools (for zsteg)
Write-Host "[*] Installing Ruby gems (zsteg)..." -ForegroundColor Cyan
gem install zsteg

Write-Host "`n[SUCCESS] Setup complete! Please restart your terminal/IDE for PATH changes to take effect." -ForegroundColor Green
