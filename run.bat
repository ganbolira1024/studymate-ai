@echo off
title StudyMate AI - run
cd /d "%~dp0"
if "%EXPO_TOKEN%"=="" (
  echo No saved Expo token. Paste your token - right-click to paste - then press Enter:
  set /p EXPO_TOKEN=Token: 
)
call npx expo whoami
echo === Starting Expo ===
call npx expo start --clear
pause
