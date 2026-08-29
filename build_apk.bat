@echo off
title CognitiveDoc.AI - Standalone Android APK Builder
color 0a
echo ============================================================
echo   CognitiveDoc.AI - Generating Standalone Android APK (.apk)
echo ============================================================
echo.
cd /d "%~dp0mobile"

echo 1. Checking dependencies...
if not exist "node_modules" (
    echo Installing mobile dependencies...
    npm install
)

echo.
echo 2. Launching Expo EAS Standalone APK Builder...
echo.
echo Note: If you don't have an Expo account yet, you can create one for free when prompted.
echo The builder will generate an installable .apk file directly!
echo.
npx eas-cli build -p android --profile preview
echo.
pause
