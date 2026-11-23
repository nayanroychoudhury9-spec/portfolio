@echo off
title Push Portfolio to GitHub
echo ========================================================
echo   Pushing Portfolio to GitHub (main branch)...
echo ========================================================
echo.

set "PATH=C:\Program Files\Git\cmd;%PATH%"

cd /d "C:\VS FILES"

echo Checking Git Remote...
git remote -v
echo.

echo Pushing commits to https://github.com/nayanroychoudhury9-spec/portfolio.git ...
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo   SUCCESS! All files have been pushed to GitHub.
) else (
    echo   If GitHub prompted for login, please sign in.
)
echo ========================================================
pause
