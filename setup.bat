@echo off
REM Yupana - CuentasClaras Installation Script for Windows

echo ======================================
echo   Yupana - CuentasClaras Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Check if Expo CLI is installed
where expo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📥 Installing Expo CLI globally...
    call npm install -g expo-cli
)

echo.
echo ======================================
echo   ✅ Setup Complete!
echo ======================================
echo.
echo To start the app, run:
echo   npm start
echo.
echo To run on specific platform:
echo   npm run ios     (iOS)
echo   npm run android (Android)
echo   npm run web     (Web)
echo.
echo Enjoy using Yupana! 🎉
echo.
pause
