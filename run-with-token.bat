@echo off
title StudyMate AI (Expo token)
cd /d "%~dp0"
echo Paste your Expo access token (right-click to paste), then press Enter:
set /p EXPO_TOKEN=Token: 
call npx expo whoami
call npx expo start
pause
