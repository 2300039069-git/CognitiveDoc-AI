@echo off
title CognitiveDoc.AI - Deploy Backend to Hugging Face Spaces
color 0b

echo ======================================================================
echo    CognitiveDoc.AI - Hugging Face Spaces 1-Click Deployer
echo ======================================================================
echo.
echo Hugging Face Spaces provides:
echo  - 100%% FREE FOREVER (Zero credit limits)
echo  - 16 GB RAM and 2 vCPUs
echo  - Permanent HTTPS API URL
echo.
echo Make sure you have created your Space on Hugging Face first:
echo   1. Go to: https://huggingface.co/new-space
echo   2. Choose Space SDK: "Docker" -> "Blank"
echo   3. Set Visibility: "Public"
echo.
echo ======================================================================
echo.

set /p HF_USERNAME="Enter your Hugging Face Username: "
set /p HF_SPACE="Enter your Space Name (e.g. cognitivedoc-api): "
set /p HF_TOKEN="Enter your Hugging Face Access Token (write token from huggingface.co/settings/tokens): "

if "%HF_USERNAME%"=="" (
    echo Error: Username cannot be empty.
    pause
    exit /b 1
)
if "%HF_SPACE%"=="" (
    echo Error: Space name cannot be empty.
    pause
    exit /b 1
)

echo.
echo [1/3] Preparing backend deployment package...
cd /d "%~dp0backend"

:: Initialize a clean git inside backend if not already present
if exist .git (
    rmdir /s /q .git
)
git init -b main
git config user.name "%HF_USERNAME%"
git config user.email "%HF_USERNAME%@users.noreply.huggingface.co"

git add .
git commit -m "Deploy CognitiveDoc.AI Enterprise FastAPI backend to Hugging Face Spaces"

echo.
echo [2/3] Connecting to Hugging Face Space repository...
git remote add space https://%HF_USERNAME%:%HF_TOKEN%@huggingface.co/spaces/%HF_USERNAME%/%HF_SPACE%

echo.
echo [3/3] Uploading backend files to Hugging Face Spaces...
git push -f space main

echo.
echo ======================================================================
echo SUCCESS! Your backend has been uploaded to Hugging Face Spaces.
echo.
echo Your public API Base URL will be:
echo   https://%HF_USERNAME%-%HF_SPACE%.hf.space/api
echo.
echo Open your Space in the browser to view the Docker build logs:
echo   https://huggingface.co/spaces/%HF_USERNAME%/%HF_SPACE%
echo ======================================================================
echo.

:: Clean up local backend .git to prevent conflicts with parent repo
rmdir /s /q .git

pause
