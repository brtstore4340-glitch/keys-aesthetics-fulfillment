# PowerShell Script to Copy Files to B444 Folder
# This script copies specified files and converts them to .jsx extension

# Define source and destination base paths
$sourceBase = "D:\01 Main Work\Boots\Keys-Pro\client\src"
$destBase = "D:\01 Main Work\Boots\Keys-Pro\client\src\B444"

# Create B444 folder if it doesn't exist
if (-not (Test-Path $destBase)) {
    New-Item -ItemType Directory -Path $destBase -Force | Out-Null
    Write-Host "Created folder: $destBase" -ForegroundColor Green
}

# List of files to copy (relative paths)
$filesToCopy = @(
    "\Pages\AccountingDashboard",
    "\Pages\AccountingOrders",
    "\Pages\AdminCategories",
    "\Pages\AdminDashboard",
    "\Pages\AdminOrders",
    "\Pages\AdminProducts",
    "\Pages\AdminUsers",
    "\Pages\CreateOrder",
    "\Pages\StaffDashboard",
    "\Pages\StaffOrders",
    "\Pages\StaffSelection",
    "\Components\UserNotRegisteredError",
    "\Components\ui\avatar",
    "\Components\ui\aspect-ratio",
    "\Components\ui\alert",
    "\Components\ui\dropdown-menu",
    "\Components\ui\sonner",
    "\Components\ui\toast",
    "\Components\ui\command",
    "\Components\ui\pagination",
    "\Components\ui\textarea",
    "\Components\ui\radio-group",
    "\Components\ui\switch",
    "\Components\ui\menubar",
    "\Components\ui\card",
    "\Components\ui\label",
    "\Components\ui\input",
    "\Components\ui\badge",
    "\Components\ui\resizable",
    "\Components\ui\tooltip",
    "\Components\ui\checkbox",
    "\Components\ui\table",
    "\Components\ui\dialog",
    "\Components\ui\progress",
    "\Components\ui\input-otp",
    "\Components\ui\popover",
    "\Components\ui\hover-card",
    "\Components\ui\breadcrumb",
    "\Components\ui\calendar",
    "\Components\ui\toggle-group",
    "\Components\ui\use-toast",
    "\Components\ui\slider",
    "\Components\ui\sidebar",
    "\Components\ui\chart",
    "\Components\ui\carousel",
    "\Components\ui\tabs",
    "\Components\ui\sheet",
    "\Components\ui\scroll-area",
    "\Components\ui\drawer",
    "\Components\ui\button",
    "\Components\ui\collapsible",
    "\Components\ui\toaster",
    "\Components\ui\navigation-menu",
    "\Components\ui\alert-dialog",
    "\Components\ui\select",
    "\Components\ui\separator",
    "\Components\ui\context-menu",
    "\Components\ui\skeleton",
    "\Components\ui\form",
    "\Components\ui\toggle",
    "\Components\ui\accordion",
    "\Components\ui\FloatingParticles",
    "\Components\ui\GlassButton",
    "\Components\ui\GlassCard",
    "\Components\ui\GlassInput",
    "\Components\ui\GlassUpload",
    "\Components\auth\PinPad",
    "\Components\auth\UserGrid",
    "\Components\layout\DashboardLayout",
    "\Entities\ProductCategory",
    "\Entities\Product",
    "\Entities\Order"
)

# Possible extensions to check
$extensions = @(".jsx", ".tsx", ".js", ".ts")

# Arrays to track results
$copiedFiles = @()
$missingFiles = @()

Write-Host ""
Write-Host "========================================"
Write-Host "Starting File Copy Process"
Write-Host "========================================"
Write-Host ""

foreach ($relativePath in $filesToCopy) {
    $found = $false
    $sourceFile = $null
    
    # Try each extension
    foreach ($ext in $extensions) {
        $testPath = $sourceBase + $relativePath + $ext
        if (Test-Path $testPath) {
            $sourceFile = $testPath
            $found = $true
            break
        }
    }
    
    if ($found) {
        # Get the file name without extension
        $fileName = Split-Path $relativePath -Leaf
        $folderPath = Split-Path $relativePath -Parent
        
        # Create destination folder structure
        $destFolder = Join-Path $destBase $folderPath
        if (-not (Test-Path $destFolder)) {
            New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
        }
        
        # Set destination file with .jsx extension
        $destFile = Join-Path $destFolder ($fileName + ".jsx")
        
        # Copy the file
        Copy-Item -Path $sourceFile -Destination $destFile -Force
        
        $copiedFiles += [PSCustomObject]@{
            Source = $sourceFile
            Destination = $destFile
        }
        
        Write-Host "[OK] Copied: $relativePath" -ForegroundColor Green
    }
    else {
        $missingFiles += $relativePath
        Write-Host "[MISSING] $relativePath" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "========================================"
Write-Host "Copy Process Complete"
Write-Host "========================================"
Write-Host ""

Write-Host "Total files to copy: $($filesToCopy.Count)"
Write-Host "Successfully copied: $($copiedFiles.Count)" -ForegroundColor Green
Write-Host "Missing files: $($missingFiles.Count)" -ForegroundColor Red

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "Missing Files List:"
    Write-Host "========================================"
    foreach ($missing in $missingFiles) {
        Write-Host "  - $missing" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "All files have been copied to: $destBase"
