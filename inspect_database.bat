@echo off
title CognitiveDoc AI - Database Inspector
echo ========================================================
echo Inspecting CognitiveDoc SQLite Database...
echo ========================================================
cd /d "%~dp0\backend"
"C:\Users\Lenovo\AppData\Local\Programs\Python\Python311\python.exe" inspect_db.py
pause
