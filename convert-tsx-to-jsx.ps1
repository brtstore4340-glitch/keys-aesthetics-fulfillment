# PowerShell Script to Convert .tsx files to .jsx
# This script renames all .tsx files to .jsx in the src directory

$sourceDir = "d:\01 Main Work\Boots\Keys-Aesthetics\src"

# Find all .tsx files
$tsxFiles = Get-ChildItem -Path $sourceDir -Filter "*.tsx" -Recurse

# Arrays to track results
$convertedFiles = @()
$failedFiles = @()

Write-Host ""
Write-Host "========================================"
Write-Host "Converting .tsx files to .jsx"
Write-Host "========================================"
Write-Host ""
Write-Host "Found $($tsxFiles.Count) .tsx files"
Write-Host ""

foreach ($file in $tsxFiles) {
    try {
        $newName = $file.FullName -replace '\.tsx$', '.jsx'
        Rename-Item -Path $file.FullName -NewName $newName -Force
        
        $relativePath = $file.FullName.Replace($sourceDir, "src")
        $convertedFiles += $relativePath
        
        Write-Host "[OK] $relativePath" -ForegroundColor Green
    }
    catch {
        $failedFiles += $file.FullName
        Write-Host "[FAILED] $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "========================================"
Write-Host "Conversion Complete"
Write-Host "========================================"
Write-Host ""

Write-Host "Total files found: $($tsxFiles.Count)"
Write-Host "Successfully converted: $($convertedFiles.Count)" -ForegroundColor Green
Write-Host "Failed: $($failedFiles.Count)" -ForegroundColor Red

if ($failedFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed files:"
    foreach ($failed in $failedFiles) {
        Write-Host "  - $failed" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "All .tsx files have been converted to .jsx"
