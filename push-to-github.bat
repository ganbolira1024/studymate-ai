@echo off
title StudyMate AI - push to GitHub
cd /d "%~dp0"
if not exist .git git init
git config user.name >nul 2>&1 || git config user.name "ganbolira1024"
git config user.email >nul 2>&1 || git config user.email "ganbolira1024@users.noreply.github.com"
git add -A
git commit -m "StudyMate AI: Expo app, mock AI tutor, quiz, planner, Supabase schema"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/ganbolira1024/studymate-ai.git
git push -u origin main
echo.
echo Done. Check https://github.com/ganbolira1024/studymate-ai
pause
