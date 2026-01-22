# PowerShell Script to Remove ALL TypeScript Syntax from JSX files
# This script removes TypeScript syntax patterns from all .jsx files

$sourceDir = "d:\01 Main Work\Boots\Keys-Aesthetics\src"

# Find all .jsx files
$jsxFiles = Get-ChildItem -Path $sourceDir -Filter "*.jsx" -Recurse

Write-Host ""
Write-Host "========================================"
Write-Host "Removing ALL TypeScript Syntax"
Write-Host "========================================"
Write-Host ""

$totalFixed = 0

foreach ($file in $jsxFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 1. Remove type annotations from function parameters: (param: type) =>
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*string\s*\)', '($1)'
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*number\s*\)', '($1)'
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*boolean\s*\)', '($1)'
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)', '($1)'
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*void\s*\)', '($1)'
    
    # 2. Remove type annotations with multiple parameters: (a: string, b: number)
    $content = $content -replace ',\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*string', ', $1'
    $content = $content -replace ',\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*number', ', $1'
    $content = $content -replace ',\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*boolean', ', $1'
    
    # 3. Remove complex type annotations: Order['status']
    $content = $content -replace '\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z_$][a-zA-Z0-9_$]*\[[^\]]+\]\)', '($1)'
    $content = $content -replace ',\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z_$][a-zA-Z0-9_$]*\[[^\]]+\]', ', $1'
    
    # 4. Remove non-null assertions: value! => value
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$\.]*)\s*!([^=])', '$1$2'
    
    # 5. Remove optional property modifiers in interfaces: prop?: type
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\?\s*:\s*string', '$1'
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\?\s*:\s*number', '$1'
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\?\s*:\s*boolean', '$1'
    $content = $content -replace '([a-zA-Z_$][a-zA-Z0-9_$]*)\?\s*:\s*any', '$1'
    
    # 6. Remove type assertions: value as Type => value
    $content = $content -replace '\s+as\s+[a-zA-Z_$][a-zA-Z0-9_$]*(\[[^\]]+\])?\s*\)', ')'
    
    # 7. Remove variable type annotations: const x: type =
    $content = $content -replace '(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*string\s*=', '$1 $2 ='
    $content = $content -replace '(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*number\s*=', '$1 $2 ='
    $content = $content -replace '(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*boolean\s*=', '$1 $2 ='
    
    # 8. Remove interface property type annotations with semicolons
    $content = $content -replace '^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*string\s*;?\s*$', '', 'Multiline'
    $content = $content -replace '^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*number\s*;?\s*$', '', 'Multiline'
    $content = $content -replace '^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*boolean\s*;?\s*$', '', 'Multiline'
    
    # Check if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $relativePath = $file.FullName.Replace($sourceDir + "\", "")
        Write-Host "[FIXED] $relativePath" -ForegroundColor Green
        $totalFixed++
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "TypeScript Syntax Removal Complete"
Write-Host "========================================"
Write-Host ""
Write-Host "Files modified: $totalFixed" -ForegroundColor Green
Write-Host ""
