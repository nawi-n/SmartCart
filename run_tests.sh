#!/bin/bash

# Function to print section headers
print_header() {
    echo "================================================"
    echo "$1"
    echo "================================================"
}

# Function to check if a command was successful
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ Success"
    else
        echo "❌ Failed"
        exit 1
    fi
}

# Run backend tests
print_header "Running Backend Tests"
cd backend
python -m pytest tests/ -v --cov=src --cov-report=term-missing
check_status

# Run frontend tests
print_header "Running Frontend Tests"
cd ../frontend
npm test -- --coverage --watchAll=false
check_status

# Run linting
print_header "Running Linting"
echo "Backend linting..."
cd ../backend
flake8 src/ tests/
check_status

echo "Frontend linting..."
cd ../frontend
npm run lint
check_status

# Run type checking
print_header "Running Type Checking"
echo "Backend type checking..."
cd ../backend
mypy src/ tests/
check_status

echo "Frontend type checking..."
cd ../frontend
npm run tsc
check_status

print_header "All tests completed successfully! 🎉" 