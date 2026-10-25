# TransitTech Development Startup Script
Write-Host "TransitTech - Smart Campus Transport System" -ForegroundColor Cyan
Write-Host "Starting development environment..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "`nChecking MongoDB connection..." -ForegroundColor Yellow
$mongoTest = @"
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
client.connect()
  .then(() => {
    console.log('MongoDB is running');
    process.exit(0);
  })
  .catch(e => {
    console.log('MongoDB is NOT running');
    process.exit(1);
  });
"@
$mongoTest | node 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: MongoDB is NOT running on localhost:27017" -ForegroundColor Yellow
    Write-Host "Please start MongoDB before running the application." -ForegroundColor Yellow
    Write-Host "`nTo start MongoDB (if using local install):" -ForegroundColor Gray
    Write-Host "  mongod --dbpath C:\data\db" -ForegroundColor Gray
    Write-Host ""
}

# Seed database
Write-Host "`nSeeding demo data..." -ForegroundColor Yellow
cd "$PSScriptRoot\server"
node scripts/seedDatabase.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not seed database (MongoDB may not be running)" -ForegroundColor Yellow
} else {
    Write-Host "Database seeded successfully" -ForegroundColor Green
}

# Start servers
Write-Host "`nStarting servers..." -ForegroundColor Green
Write-Host "- Backend server will start on http://localhost:5000" -ForegroundColor Cyan
Write-Host "- Frontend will start on http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all servers" -ForegroundColor Gray

cd "$PSScriptRoot\server"
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow -PassThru
Write-Host "Backend process started (PID: $($serverProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

cd "$PSScriptRoot\client"
$clientProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow -PassThru
Write-Host "Frontend process started (PID: $($clientProcess.Id))" -ForegroundColor Green

Write-Host "`n✓ Development environment ready!" -ForegroundColor Green

# Wait for processes
$serverProcess.WaitForExit()
$clientProcess.WaitForExit()
