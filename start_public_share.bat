@echo off
title CognitiveDoc AI - Global Public Share Launcher (Cloudflare)
echo ======================================================================
echo Launching CognitiveDoc.AI for Global Mobile Access (Cloudflare)...
echo ======================================================================

:: Clean up any lingering processes on ports to avoid collisions
powershell -Command "Get-Process node, python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>nul

start "CognitiveDoc Backend" cmd /c "%~dp0start_backend.bat"
start "CognitiveDoc Frontend" cmd /c "%~dp0start_frontend.bat"

echo.
echo Waiting 4 seconds for servers to start...
timeout /t 4 /nobreak >nul

echo.
echo ======================================================================
echo Connecting Cloudflare Global Edge HTTPS Tunnel...
echo (100%% Free, Zero Warning Pages, Instant Access on Any 4G/5G/Wi-Fi)
echo ======================================================================
echo.
echo Look for the "https://xxxx.trycloudflare.com" link below and copy it:
echo.

"%~dp0cloudflared.exe" tunnel --url http://localhost:5173
pause
