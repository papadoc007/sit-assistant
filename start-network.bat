@echo off
title SIT Assistant - Network Mode

echo ============================================
echo    SIT Assistant - Network Mode
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
    pause
    exit /b 1
)

:: Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do set LOCAL_IP=%%b
)

echo [*] Starting Backend server on port 3001...
start /b cmd /c "node server.js"

timeout /t 2 /nobreak >nul

echo [*] Starting Frontend server (network mode)...
start /b cmd /c "npx vite --port 5173 --host 0.0.0.0"

echo.
echo ============================================
echo    App is running on your network!
echo.
echo    Local:   http://localhost:5173
echo    Network: http://%LOCAL_IP%:5173
echo.
echo    Share the Network URL with others
echo ============================================
echo.
echo    Press Ctrl+C or close this window to stop
echo.

cmd /k
