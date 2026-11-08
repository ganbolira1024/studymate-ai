@echo off
title StudyMate AI - Expo login
cd /d "%~dp0"
echo === Checking Expo login ===
call npx expo whoami
if errorlevel 1 (
  echo Not logged in. Enter username ganbolira1024 and your password:
  call npx expo login
)
call npx expo whoami
echo === Starting Expo ===
call npx expo start --clear
pause
