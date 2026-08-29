@echo off
title CognitiveDoc.AI - Mobile App Server (Expo)
color 0b
echo ============================================================
echo   CognitiveDoc.AI - Launching React Native Mobile App
echo ============================================================
echo.
echo 1. Checking dependencies in mobile/...
cd /d "%~dp0mobile"
if not exist "node_modules" (
    echo Installing mobile dependencies...
    npm install
)
echo.
echo 2. Starting Expo Development Server...
echo Scan the QR code with Expo Go on your mobile phone!
echo.
npm start
pause
