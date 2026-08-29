@echo off
title CognitiveDoc AI - React Frontend
echo ========================================================
echo Starting CognitiveDoc.AI React Web Portal on port 5173...
echo ========================================================
cd /d "%~dp0frontend"
npm run dev
pause
