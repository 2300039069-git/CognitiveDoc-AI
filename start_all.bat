@echo off
title CognitiveDoc AI - Local Launcher
echo ======================================================================
echo Launching CognitiveDoc.AI (Local + Wi-Fi Mode)...
echo ======================================================================

:: Clean up any lingering processes on ports to avoid collisions
powershell -Command "Get-Process node, python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>nul

start "CognitiveDoc Backend" cmd /c "%~dp0start_backend.bat"
start "CognitiveDoc Frontend" cmd /c "%~dp0start_frontend.bat"

echo.
echo Both servers have been launched!
echo  - Frontend Local:  http://localhost:5173
echo  - Frontend Wi-Fi:  http://192.168.29.152:5173
echo  - Backend Docs:    http://localhost:8000/docs
echo  - Backend Users:   http://localhost:8000/backend-users
echo.
timeout /t 5
