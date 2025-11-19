@echo off
echo ========================================
echo   Pharmacy POS - Windows Build Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK
echo.

echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo npm: OK
echo.

echo ========================================
echo   Step 1: Installing Dependencies
echo ========================================
echo This may take a few minutes...
echo.
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo ========================================
echo   Step 2: Building Vue Application
echo ========================================
echo.
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build Vue application
    pause
    exit /b 1
)
echo Vue application built successfully!
echo.

echo ========================================
echo   Step 3: Building Windows Application
echo ========================================
echo.
echo Choose build type:
echo 1. Installer only (NSIS)
echo 2. Portable only
echo 3. Both (Installer + Portable)
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo Building Windows Installer...
    call electron-builder --win nsis --x64
) else if "%choice%"=="2" (
    echo Building Portable Version...
    call electron-builder --win portable --x64
) else if "%choice%"=="3" (
    echo Building Both Versions...
    call electron-builder --win --x64
) else (
    echo Invalid choice! Building both versions...
    call electron-builder --win --x64
)

if errorlevel 1 (
    echo ERROR: Failed to build Windows application
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Built files location: dist-electron\
echo.
echo Installer: Pharmacy POS System-1.0.0-x64.exe
echo Portable:  Pharmacy POS System-1.0.0-Portable.exe
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo 1. Find the built files in the 'dist-electron' folder
echo 2. Test the application before distribution
echo 3. Share with end users
echo.
echo For detailed instructions, see BUILD_INSTRUCTIONS.md
echo For user guide, see USER_GUIDE.md
echo.
pause
