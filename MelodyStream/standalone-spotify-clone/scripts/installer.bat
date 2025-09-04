@echo off
REM Spotify Clone Installer for Windows
REM This batch file helps set up the Spotify Clone on Windows systems

echo ================================================================
echo                    Spotify Clone Setup
echo ================================================================
echo.

REM Check if Python is installed
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Python found
    set PYTHON_AVAILABLE=1
) else (
    echo ✗ Python not found
    set PYTHON_AVAILABLE=0
)

REM Check if Node.js is installed
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Node.js found
    set NODE_AVAILABLE=1
) else (
    echo ✗ Node.js not found
    set NODE_AVAILABLE=0
)

REM Check current directory for required files
echo [3/4] Checking required files...
if exist "index.html" (
    echo ✓ index.html found
) else (
    echo ✗ index.html not found - please ensure you're in the correct directory
    pause
    exit /b 1
)

if exist "styles.css" (
    echo ✓ styles.css found
) else (
    echo ✗ styles.css not found
    pause
    exit /b 1
)

if exist "app.js" (
    echo ✓ app.js found
) else (
    echo ✗ app.js not found
    pause
    exit /b 1
)

if exist "database.js" (
    echo ✓ database.js found
) else (
    echo ✗ database.js not found
    pause
    exit /b 1
)

REM Start the application
echo [4/4] Starting Spotify Clone...
echo.

if %PYTHON_AVAILABLE%==1 (
    echo Starting Python HTTP server on port 8000...
    echo Open your browser and go to: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ================================================================
    python -m http.server 8000
) else if %NODE_AVAILABLE%==1 (
    echo Starting Node.js HTTP server on port 8000...
    echo Open your browser and go to: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ================================================================
    npx http-server -p 8000
) else (
    echo.
    echo No Python or Node.js found for local server.
    echo Opening application directly in browser...
    echo.
    echo NOTE: Some features may not work without a local server.
    echo Consider installing Python or Node.js for better compatibility.
    echo.
    start index.html
)

echo.
echo ================================================================
echo Setup complete! 
echo.
echo Default login credentials:
echo Username: demo
echo Password: password123
echo.
echo Or create a new account by clicking "Sign up"
echo ================================================================
pause