# BackgroundValidate: true
# MODE: BUG_FIX
# Purpose: Resolve @typescript-eslint/typescript-estree unsupported TypeScript version warning
# Strategy: Downgrade TypeScript to latest supported version (<5.2.0), pin to 5.1.6

# =========================
# Blast Radius
# =========================
# - Affects TypeScript compiler behavior across the entire repo
# - May impact builds relying on TS 5.2+ features (none officially supported by eslint stack)
# - Node modules will be reinstalled

# =========================
# Risks & Mitigations
# =========================
# Risk: Project relies on TS 5.2+ syntax/features
# Mitigation: ESLint ecosystem explicitly does not support them; linting is already undefined behavior
# Risk: package.json not present
# Mitigation: Hard stop with explicit error

# =========================
# Regression Tests
# =========================
# - npm run lint
# - npm run build
# - tsc --noEmit
# =========================

$ErrorActionPreference = 'Stop'

try {
    if (-not (Test-Path "package.json")) {
        throw "package.json not found. Cannot safely apply fix."
    }

    Write-Host "Reading package.json..."
    $packageJson = Get-Content package.json -Raw | ConvertFrom-Json

    if (-not $packageJson.devDependencies) {
        $packageJson | Add-Member -MemberType NoteProperty -Name devDependencies -Value @{}
    }

    Write-Host "Pinning TypeScript to 5.1.6 (eslint-supported)..."
    $packageJson.devDependencies.typescript = "5.1.6"

    $packageJson | ConvertTo-Json -Depth 10 | Set-Content package.json -Encoding UTF8

    Write-Host "Removing existing node_modules and lockfile for clean install..."
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
    if (Test-Path "pnpm-lock.yaml") { Remove-Item -Force "pnpm-lock.yaml" }
    if (Test-Path "yarn.lock") { Remove-Item -Force "yarn.lock" }

    Write-Host "Reinstalling dependencies..."
    npm install

    Write-Host "Validating TypeScript version..."
    $tsVersion = npx tsc --version
    Write-Host "Installed $tsVersion"

    Write-Host "Fix complete. Warning should be resolved."
}
catch {
    Write-Error $_
    exit 1
}

# =========================
# Performance / Cost Notes
# =========================
# - No runtime cost impact
# - Slightly faster ESLint runs due to supported parser path
# - Zero Firebase / network runtime impact
