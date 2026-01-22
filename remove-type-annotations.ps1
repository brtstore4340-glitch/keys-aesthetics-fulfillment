# PowerShell Script to Remove TypeScript Type Annotations from JSX files
# This script removes TypeScript syntax from all .jsx files

$sourceDir = "d:\01 Main Work\Boots\Keys-Aesthetics\src"

# Find all .jsx files
$jsxFiles = Get-ChildItem -Path $sourceDir -Filter "*.jsx" -Recurse

Write-Host ""
Write-Host "========================================"
Write-Host "Removing TypeScript Type Annotations"
Write-Host "========================================"
Write-Host ""
Write-Host "Found $($jsxFiles.Count) .jsx files"
Write-Host ""

$totalFixed = 0

foreach ($file in $jsxFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileFixed = $false
    
    # Remove type annotations from function parameters
    # Pattern: (param: type) => or (param: type, param2: type) =>
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z_$<>\[\]''"\|\s]+\)', '($1)'
    
    # Pattern: (param: type) => for arrow functions
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(string|number|boolean|any|void|object|Array[<>a-zA-Z_$\[\]''"|]+)\s*\)', '$1)'
    
    # Remove simple type annotations: const x: type =
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(string|number|boolean|any|void|object|Array[<>a-zA-Z_$\[\]''"|]+)\s*=', '$1 ='
    
    # Remove optional property markers: prop?: type
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\?\s*:\s*(string|number|boolean|any|void|object|Array[<>a-zA-Z_$\[\]''"|]+)', '$1'
    
    # Remove required property markers: prop: type
    $content = $content -replace '^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(string|number|boolean|any|void|object|Array[<>a-zA-Z_$\[\]''"|]+)\s*;?\s*$', '  // $1', 'Multiline'
    
    # Remove interface/type definitions
    $content = $content -replace 'interface\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\{[^}]*\}', ''
    $content = $content -replace 'type\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]+;', ''
    
    # Remove generic type parameters: Array<Type>
    $content = $content -replace 'Array<[^>]+>', 'Array'
    
    # Remove union types in parameters: (status: Order['status'])
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z_$][a-zA-Z0-9_$]*\[[^\]]+\]\)', '($1)'
    
    # Check if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $relativePath = $file.FullName.Replace($sourceDir, "src")
        Write-Host "[FIXED] $relativePath" -ForegroundColor Green
        $totalFixed++
        $fileFixed = $true
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Type Annotation Removal Complete"
Write-Host "========================================"
Write-Host ""
Write-Host "Total files processed: $($jsxFiles.Count)"
Write-Host "Files modified: $totalFixed" -ForegroundColor Green
Write-Host ""
