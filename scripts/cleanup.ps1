Write-Host "🧹 Cleaning up Next.js build artifacts..." -ForegroundColor Green

# Stop any running Node processes
Write-Host "🛑 Stopping Node processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ Stopped Node processes" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  No Node processes running" -ForegroundColor Blue
}

# Directories to clean
$dirsToClean = @(
    ".next",
    "out", 
    "build",
    "dist",
    "node_modules\.cache"
)

# Clean directories
foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Write-Host "🗑️  Removing $dir..." -ForegroundColor Yellow
        try {
            Remove-Item -Path $dir -Recurse -Force
            Write-Host "✅ Removed $dir" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Could not remove $dir : $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "ℹ️  $dir does not exist, skipping..." -ForegroundColor Blue
    }
}

# Clean TypeScript build info
if (Test-Path "*.tsbuildinfo") {
    Write-Host "🗑️  Cleaning TypeScript build info..." -ForegroundColor Yellow
    Remove-Item -Path "*.tsbuildinfo" -Force
}

Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White 