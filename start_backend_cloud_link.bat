@echo off
title CognitiveDoc AI - Backend Global Cloud Link (Cloudflare)
color 0a

echo ======================================================================
echo    CognitiveDoc.AI - 100%% Free Permanent Global Backend Launcher
echo ======================================================================
echo.
echo No credit cards, no accounts, no credit limits, no signup errors!
echo This connects your FastAPI backend directly to Cloudflare's global edge.
echo.

:: 1. Start the FastAPI backend server in a separate background window
echo [1/2] Starting FastAPI backend server on port 8000...
start "CognitiveDoc Backend Core" /min cmd /c "cd /d "%~dp0backend" && "C:\Users\Lenovo\AppData\Local\Programs\Python\Python311\python.exe" run.py"

:: Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

echo [2/2] Generating global HTTPS link with Cloudflare...
echo.
echo ======================================================================
echo Copy the "https://xxxx.trycloudflare.com" link shown below:
echo (This is your live backend API URL that works worldwide)
echo ======================================================================
echo.

"%~dp0cloudflared.exe" tunnel --url http://127.0.0.1:8000

pause
