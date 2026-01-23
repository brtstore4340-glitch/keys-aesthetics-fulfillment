# BackgroundValidate: true
# MODE: BUG-FIX
# Issue: firebase-tools predeploy spawns ".\cmd \c ..." (ENOENT). Root cause is almost always a malformed predeploy command in firebase.json
#        (e.g., "cmd \\c ..." or ".\\cmd \\c ...") which turns "/c" into "\c" and/or "cmd" into ".\cmd".
#
# Blast radius:
# - firebase.json predeploy commands execution on Windows (functions deploy). Could affect deploy pipeline.
#
# Risks & mitigations:
# - Risk: unintended string replacements in firebase.json.
#   Mitigation: create timestamped backup; apply narrowly-scoped regex replacements; validate JSON parses after edit.
#
# Regression tests to run (executed by this script where safe):
# - npm --prefix functions run lint
# - (optional) firebase deploy --only functions
#
# Performance/cost notes:
# - No runtime cost. Prevents failed deploy loops; avoids wasted CI/dev time.

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Find-FirebaseJsonRoot {
  param([string]$StartPath)

  $p = Resolve-Path -LiteralPath $StartPath
  for ($i = 0; $i -lt 8; $i++) {
    $candidate = Join-Path -Path $p -ChildPath 'firebase.json'
    if (Test-Path -LiteralPath $candidate) { return $p }
    $parent = Split-Path -Path $p -Parent
    if ($parent -eq $p) { break }
    $p = $parent
  }
  throw "firebase.json not found in current directory or up to 8 parents. StartPath=$StartPath"
}

function Backup-File {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (!(Test-Path -LiteralPath $Path)) { throw "Backup target not found: $Path" }
  $ts = Get-Date -Format "yyyyMMdd_HHmmss"
  $bak = "$Path.bak.$ts"
  Copy-Item -LiteralPath $Path -Destination $bak -Force
  return $bak
}

function Assert-Json-Parses {
  param([Parameter(Mandatory=$true)][string]$JsonText, [string]$Label = "JSON")
  try {
    $null = $JsonText | ConvertFrom-Json -ErrorAction Stop
  } catch {
    throw "$Label failed to parse as JSON: $($_.Exception.Message)"
  }
}

function Fix-FirebasePredeployCmd {
  param([Parameter(Mandatory=$true)][string]$FirebaseJsonPath)

  $raw = Get-Content -LiteralPath $FirebaseJsonPath -Raw -Encoding UTF8
  Assert-Json-Parses -JsonText $raw -Label "Original firebase.json"

  $original = $raw

  # 1) Replace ".\cmd" or ".\\cmd" (common when someone wrote a relative command) -> "cmd"
  $raw = [regex]::Replace($raw, '(?i)(?<![A-Za-z0-9_])\.\s*\\cmd(?:\.exe)?\b', 'cmd')

  # 2) Replace "cmd \c" or "cmd \\c" -> "cmd /c"
  #    - This is the key bug that yields "\c" which cross-spawn treats oddly and can produce ".\cmd \c ..." ENOENT.
  $raw = [regex]::Replace($raw, '(?i)\bcmd(?:\.exe)?(\s+)\\c\b', 'cmd$1/c')
  $raw = [regex]::Replace($raw, '(?i)\bcmd(?:\.exe)?(\s+)\\\\c\b', 'cmd$1/c')

  # 3) If someone used "cmd /c" already, keep it. If "cmd  /c" weird spacing, leave it.
  # 4) Prefer cmd.exe explicitly (optional). Keep "cmd" to minimize churn.

  if ($raw -ne $original) {
    $bak = Backup-File -Path $FirebaseJsonPath
    Write-Host "Backed up firebase.json => $bak" -ForegroundColor DarkGray
    Assert-Json-Parses -JsonText $raw -Label "Patched firebase.json"
    Set-Content -LiteralPath $FirebaseJsonPath -Value $raw -Encoding UTF8
    Write-Host "Patched: $FirebaseJsonPath" -ForegroundColor Green
  } else {
    Write-Host "No changes needed in firebase.json (no malformed cmd predeploy patterns found)." -ForegroundColor Yellow
  }
}

function Assert-CommandExists {
  param([Parameter(Mandatory=$true)][string]$Name)
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $cmd) { throw "Required command not found in PATH: $Name" }
  return $cmd
}

function Run-FunctionsLintIfAvailable {
  param(
    [Parameter(Mandatory=$true)][string]$ProjectRoot
  )

  $functionsDir = Join-Path -Path $ProjectRoot -ChildPath 'functions'
  if (!(Test-Path -LiteralPath $functionsDir)) {
    Write-Host "Skipping lint: functions directory not found at $functionsDir" -ForegroundColor Yellow
    return
  }

  $pkg = Join-Path -Path $functionsDir -ChildPath 'package.json'
  if (!(Test-Path -LiteralPath $pkg)) {
    Write-Host "Skipping lint: functions/package.json not found." -ForegroundColor Yellow
    return
  }

  $pkgObj = Get-Content -LiteralPath $pkg -Raw -Encoding UTF8 | ConvertFrom-Json
  $hasLint = $false
  if ($pkgObj.scripts -and $pkgObj.scripts.lint) { $hasLint = $true }

  if (-not $hasLint) {
    Write-Host "Skipping lint: no scripts.lint found in functions/package.json" -ForegroundColor Yellow
    return
  }

  Assert-CommandExists -Name 'npm' | Out-Null

  Write-Host "Running: npm --prefix functions run lint" -ForegroundColor Cyan
  & npm --prefix $functionsDir run lint
  if ($LASTEXITCODE -ne 0) { throw "functions lint failed with exit code $LASTEXITCODE" }
  Write-Host "functions lint OK" -ForegroundColor Green
}

try {
  # Validate Windows cmd availability
  if (-not $env:COMSPEC) { throw "COMSPEC env var is missing; cannot locate cmd.exe reliably." }
  if (!(Test-Path -LiteralPath $env:COMSPEC)) { throw "COMSPEC points to missing file: $env:COMSPEC" }

  $root = Find-FirebaseJsonRoot -StartPath (Get-Location).Path
  $firebaseJson = Join-Path -Path $root -ChildPath 'firebase.json'

  Fix-FirebasePredeployCmd -FirebaseJsonPath $firebaseJson

  # Quick sanity: ensure firebase-tools can find cmd + npm lint runs
  Run-FunctionsLintIfAvailable -ProjectRoot $root

  Write-Host ""
  Write-Host "Next (manual) regression:" -ForegroundColor DarkCyan
  Write-Host "  firebase deploy --only functions" -ForegroundColor DarkCyan
  Write-Host ""
  Write-Host "If deploy still fails, paste your firebase.json predeploy section here." -ForegroundColor DarkGray
}
catch {
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
  throw
}
