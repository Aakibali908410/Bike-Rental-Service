<#
.SYNOPSIS
    Securely launches mongosh connected to your MongoDB Atlas cluster.
.DESCRIPTION
    Reads MONGO_URI from backend/backend/.env without printing or leaking secrets into the console.
#>

$ErrorActionPreference = "Stop"

# Locate .env file
$envPaths = @(
    (Join-Path $PSScriptRoot "backend\backend\.env"),
    (Join-Path $PSScriptRoot "backend\.env"),
    (Join-Path $PSScriptRoot ".env")
)

$targetEnv = $null
foreach ($path in $envPaths) {
    if (Test-Path $path) {
        $targetEnv = $path
        break
    }
}

if (-not $targetEnv) {
    Write-Host "[ERROR] Could not find .env in backend/backend/ or backend/" -ForegroundColor Red
    exit 1
}

# Extract connection URI securely without printing it
$line = Get-Content $targetEnv | Where-Object { $_ -match '^(MONGO_URI|MONGODB_URI|MONGO_URL)=' } | Select-Object -First 1

if (-not $line) {
    Write-Host "[ERROR] MONGO_URI / MONGODB_URI not found in $targetEnv" -ForegroundColor Red
    exit 1
}

$uri = $line -replace '^(MONGO_URI|MONGODB_URI|MONGO_URL)=', ''
$uri = $uri.Trim()

if (-not (Get-Command mongosh -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] 'mongosh' command not found in PATH." -ForegroundColor Red
    Write-Host "Please ensure MongoDB Shell is installed." -ForegroundColor Yellow
    exit 1
}

Write-Host "[INFO] Connecting to MongoDB Atlas cluster securely..." -ForegroundColor Cyan
& mongosh $uri

