@echo off
title SIT Assistant

echo ============================================
echo    SIT Assistant - Start
echo ============================================
echo.

if not exist "node_modules" (
    echo [*] Installing packages...
    call npm install
    if errorlevel 1 (
        echo [!] Error installing packages
        pause
        exit /b 1
    )
    echo [+] Packages installed successfully
    echo.
)

if not exist ".env" (
    echo [!] .env file not found!
    echo [*] Create a .env file with:
    echo     ANTHROPIC_API_KEY=your-api-key-here
    echo.
    echo [*] Get your API key from: https://console.anthropic.com/
    pause
    exit /b 1
)

echo [*] Starting Backend server on port 3001...
start /b cmd /c "node server.js"

timeout /t 2 /nobreak >nul

echo [*] Starting Frontend server...
start /b cmd /c "npx vite --port 5173 --open"

echo.
echo ============================================
echo    App is running!
echo    Open browser at: http://localhost:5173
echo ============================================
echo.
echo    Press Ctrl+C or close this window to stop
echo.

cmd /k
