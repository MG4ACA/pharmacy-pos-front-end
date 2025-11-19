# Pharmacy POS - Windows Build Script (PowerShell)
# Run this script to build the Windows standalone application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pharmacy POS - Windows Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 1: Install Dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Build Vue Application
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Building Vue Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build Vue application" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Vue application built successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Build Windows Application
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Building Windows Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose build type:" -ForegroundColor Yellow
Write-Host "1. Installer only (NSIS)"
Write-Host "2. Portable only"
Write-Host "3. Both (Installer + Portable)"
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Building Windows Installer..." -ForegroundColor Yellow
        npx electron-builder --win nsis --x64
    }
    "2" {
        Write-Host "Building Portable Version..." -ForegroundColor Yellow
        npx electron-builder --win portable --x64
    }
    "3" {
        Write-Host "Building Both Versions..." -ForegroundColor Yellow
        npx electron-builder --win --x64
    }
    default {
        Write-Host "Invalid choice! Building both versions..." -ForegroundColor Yellow
        npx electron-builder --win --x64
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build Windows application" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Built files location: dist-electron\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installer: Pharmacy POS System-1.0.0-x64.exe" -ForegroundColor Yellow
Write-Host "Portable:  Pharmacy POS System-1.0.0-Portable.exe" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Find the built files in the 'dist-electron' folder"
Write-Host "2. Test the application before distribution"
Write-Host "3. Share with end users"
Write-Host ""
Write-Host "For detailed instructions, see BUILD_INSTRUCTIONS.md"
Write-Host "For user guide, see USER_GUIDE.md"
Write-Host ""
Read-Host "Press Enter to exit"
