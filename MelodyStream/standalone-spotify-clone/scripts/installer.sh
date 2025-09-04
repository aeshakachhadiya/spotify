#!/bin/bash

# Spotify Clone Installer for macOS/Linux
# This script helps set up the Spotify Clone on Unix-based systems

echo "================================================================"
echo "                    Spotify Clone Setup"
echo "================================================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ "$2" = "success" ]; then
        echo -e "${GREEN}✓${NC} $1"
    elif [ "$2" = "error" ]; then
        echo -e "${RED}✗${NC} $1"
    elif [ "$2" = "warning" ]; then
        echo -e "${YELLOW}⚠${NC} $1"
    else
        echo "• $1"
    fi
}

# Check if Python is installed
echo "[1/4] Checking Python installation..."
if command -v python3 &> /dev/null; then
    print_status "Python 3 found" "success"
    PYTHON_CMD="python3"
    PYTHON_AVAILABLE=1
elif command -v python &> /dev/null; then
    print_status "Python found" "success"
    PYTHON_CMD="python"
    PYTHON_AVAILABLE=1
else
    print_status "Python not found" "error"
    PYTHON_AVAILABLE=0
fi

# Check if Node.js is installed
echo "[2/4] Checking Node.js installation..."
if command -v node &> /dev/null; then
    print_status "Node.js found ($(node --version))" "success"
    NODE_AVAILABLE=1
else
    print_status "Node.js not found" "error"
    NODE_AVAILABLE=0
fi

# Check current directory for required files
echo "[3/4] Checking required files..."
required_files=("index.html" "styles.css" "app.js" "database.js")
all_files_present=1

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file found" "success"
    else
        print_status "$file not found" "error"
        all_files_present=0
    fi
done

if [ $all_files_present -eq 0 ]; then
    echo
    print_status "Some required files are missing. Please ensure you're in the correct directory." "error"
    exit 1
fi

# Start the application
echo "[4/4] Starting Spotify Clone..."
echo

# Function to open browser
open_browser() {
    echo "Opening browser..."
    if command -v open &> /dev/null; then
        # macOS
        open "$1"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$1"
    elif command -v wslview &> /dev/null; then
        # WSL
        wslview "$1"
    else
        echo "Please manually open your browser and go to: $1"
    fi
}

# Start appropriate server
if [ $PYTHON_AVAILABLE -eq 1 ]; then
    echo "Starting Python HTTP server on port 8000..."
    echo "Server will be available at: http://localhost:8000"
    echo
    echo "Press Ctrl+C to stop the server"
    echo "================================================================"
    
    # Open browser after a short delay
    (sleep 2 && open_browser "http://localhost:8000") &
    
    # Start Python server
    $PYTHON_CMD -m http.server 8000
    
elif [ $NODE_AVAILABLE -eq 1 ]; then
    echo "Starting Node.js HTTP server on port 8000..."
    echo "Server will be available at: http://localhost:8000"
    echo
    echo "Press Ctrl+C to stop the server"
    echo "================================================================"
    
    # Open browser after a short delay
    (sleep 2 && open_browser "http://localhost:8000") &
    
    # Start Node.js server
    npx http-server -p 8000
    
else
    echo
    print_status "No Python or Node.js found for local server." "warning"
    echo "Opening application directly in browser..."
    echo
    print_status "NOTE: Some features may not work without a local server." "warning"
    print_status "Consider installing Python or Node.js for better compatibility." "warning"
    echo
    
    # Open file directly
    open_browser "file://$(pwd)/index.html"
fi

echo
echo "================================================================"
echo "Setup complete!"
echo
echo "Default login credentials:"
echo "Username: demo"
echo "Password: password123"
echo
echo "Or create a new account by clicking 'Sign up'"
echo "================================================================"