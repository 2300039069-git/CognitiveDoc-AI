@echo off
title CognitiveDoc AI - Backend Server
echo ========================================================
echo Starting CognitiveDoc.AI FastAPI Backend on port 8000...
echo ========================================================
cd /d "%~dp0backend"
"C:\Users\Lenovo\AppData\Local\Programs\Python\Python311\python.exe" run.py
pause
