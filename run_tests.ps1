# Function to print section headers
function Write-SectionHeader {
    param (
        [string]$Title
    )
    Write-Host "================================================"
    Write-Host $Title
    Write-Host "================================================"
}

# Function to check if a command was successful
function Test-CommandStatus {
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Success" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Failed" -ForegroundColor Red
        return $false
    }
}

# Run backend tests
Write-SectionHeader "Running Backend Tests"
Set-Location backend
python -m pytest tests/ -v --cov=src --cov-report=term-missing
if (-not (Test-CommandStatus)) { exit 1 }

# Run frontend tests
Write-SectionHeader "Running Frontend Tests"
Set-Location ../frontend
npm test -- --coverage --watchAll=false
if (-not (Test-CommandStatus)) { exit 1 }

# Run linting
Write-SectionHeader "Running Linting"
Write-Host "Backend linting..."
Set-Location ../backend
flake8 src/ tests/
if (-not (Test-CommandStatus)) { exit 1 }

Write-Host "Frontend linting..."
Set-Location ../frontend
npm run lint
if (-not (Test-CommandStatus)) { exit 1 }

# Run type checking
Write-SectionHeader "Running Type Checking"
Write-Host "Backend type checking..."
Set-Location ../backend
mypy src/ tests/
if (-not (Test-CommandStatus)) { exit 1 }

Write-Host "Frontend type checking..."
Set-Location ../frontend
npm run tsc
if (-not (Test-CommandStatus)) { exit 1 }

Write-SectionHeader "All tests completed successfully! 🎉" 