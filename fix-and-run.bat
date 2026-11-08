@echo off
title StudyMate AI - fix icons and run
cd /d "%~dp0"
if "%EXPO_TOKEN%"=="" (
  echo No saved Expo token. Paste your token - right-click to paste - then press Enter:
  set /p EXPO_TOKEN=Token: 
)
call npx expo whoami
echo === Installing @expo/vector-icons ===
call npx expo install @expo/vector-icons
echo === Starting Expo ===
call npx expo start --clear
pause
