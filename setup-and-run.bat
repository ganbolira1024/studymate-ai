@echo off
title StudyMate AI setup
cd /d "%~dp0"
echo === Installing packages ===
call npm install
echo === Starting Expo - scan the QR code with Expo Go ===
call npx expo start
pause
