@echo off
chcp 65001 >nul 2>&1
title SIT Assistant - חשיבה המצאתית שיטתית

echo ============================================
echo    SIT Assistant - חשיבה המצאתית שיטתית
echo ============================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo [*] מתקין חבילות...
    call npm install
    if errorlevel 1 (
        echo [!] שגיאה בהתקנת חבילות
        pause
        exit /b 1
    )
    echo [+] חבילות הותקנו בהצלחה
    echo.
)

:: Check if .env exists
if not exist ".env" (
    echo [!] קובץ .env לא נמצא!
    echo [*] צור קובץ .env בתיקיית הפרויקט עם התוכן הבא:
    echo     ANTHROPIC_API_KEY=your-api-key-here
    echo.
    echo [*] ניתן להשיג מפתח API מ: https://console.anthropic.com/
    pause
    exit /b 1
)

echo [*] מפעיל שרת Backend בפורט 3001...
start /b cmd /c "node server.js"

:: Wait for backend to start
timeout /t 2 /nobreak >nul

echo [*] מפעיל שרת Frontend...
start /b cmd /c "npx vite --port 5173 --open"

echo.
echo ============================================
echo    האפליקציה פועלת!
echo    פתח את הדפדפן בכתובת:
echo    http://localhost:5173
echo ============================================
echo.
echo    לסגירה לחץ Ctrl+C או סגור חלון זה
echo.

:: Keep the window open
cmd /k
