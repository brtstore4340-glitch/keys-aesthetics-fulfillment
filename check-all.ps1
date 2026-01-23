param(
  [string]$RepoRoot = "D:\01 Main Work\Boots\keys-aesthetics-fulfillment"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

function H($m){ Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function OK($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function WARN($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function ERR($m){ Write-Host "[ERR] $m" -ForegroundColor Red }

cd $RepoRoot
H "PATH"
Write-Host (Get-Location)

# --------------------------------------------------
H "GIT"
if(Test-Path ".git"){
  OK "Git repo detected"
  git branch --show-current
  git status --short
} else {
  ERR "Not a git repository (.git missing)"
}

# --------------------------------------------------
H "NODE / NPM"
try {
  OK ("Node: " + (node -v))
  OK ("npm : " + (npm -v))
} catch {
  ERR "Node or npm not available"
}

# --------------------------------------------------
H "ROOT package.json"
if(Test-Path "package.json"){
  OK "package.json exists"
  try {
    node -p "require('./package.json').name" | Out-Null
    OK "package.json parses"
    Write-Host "workspaces ="
    node -p "JSON.stringify(require('./package.json').workspaces)"
  } catch {
    ERR "package.json invalid JSON"
  }
} else {
  ERR "Missing root package.json"
}

# --------------------------------------------------
H "WORKSPACE DETECTION"
$wsApp = "apps/fulfillment-web/package.json"
$wsFn  = "functions/package.json"

if(Test-Path $wsApp){
  OK "apps/fulfillment-web workspace found"
  node -p "require('./apps/fulfillment-web/package.json').name"
} else {
  ERR "apps/fulfillment-web/package.json missing"
}

if(Test-Path $wsFn){
  OK "functions workspace found"
  node -p "require('./functions/package.json').name"
} else {
  WARN "functions/package.json missing (functions build will be skipped)"
}

# --------------------------------------------------
H "WEB APP STRUCTURE"
if(Test-Path "apps/fulfillment-web/index.html"){
  OK "index.html present"
} else {
  ERR "index.html missing (Vite entry)"
}

if(Test-Path "apps/fulfillment-web/src"){
  OK "src/ present"
} else {
  ERR "src/ missing"
}

$viteConfigs = Get-ChildItem "apps/fulfillment-web" -Filter "vite.config.*" -ErrorAction SilentlyContinue
if($viteConfigs){
  OK ("Vite config: " + ($viteConfigs.Name -join ", "))
} else {
  WARN "No vite.config.* in app (default Vite config will be used)"
}

# --------------------------------------------------
H "DEPENDENCY CHECK (WEB)"
try {
  npm -w apps/fulfillment-web ls react | Out-Null
  OK "react resolved in workspace"
} catch {
  ERR "react NOT resolved in workspace"
}

# --------------------------------------------------
H "BUILD CHECK"
Write-Host "Web build:"
try {
  npm -w apps/fulfillment-web run build
  OK "Web build OK"
} catch {
  ERR "Web build FAILED"
}

if(Test-Path $wsFn){
  Write-Host "Functions build:"
  try {
    npm -w functions run build
    OK "Functions build OK"
  } catch {
    WARN "Functions build failed or no build script"
  }
}

# --------------------------------------------------
H "FIREBASE CONFIG"
$firebaseFiles = @(
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "storage.rules"
)

foreach($f in $firebaseFiles){
  if(Test-Path $f){
    OK "$f present"
  } else {
    WARN "$f missing"
  }
}

# --------------------------------------------------
H "RISKY FILES (INFO ONLY)"
$risky = Get-ChildItem . -Recurse -Include "*.bak","*.env","*.env.*","*_backup_*" -ErrorAction SilentlyContinue |
         Select-Object -First 10

if($risky){
  WARN "Found backup/secret-like files (review .gitignore):"
  $risky | ForEach-Object { Write-Host " - $($_.FullName)" }
} else {
  OK "No obvious risky files detected"
}

# --------------------------------------------------
H "SUMMARY"
Write-Host "If no [ERR] above → system is HEALTHY"
Write-Host "Next recommended:"
Write-Host "  git add -A"
Write-Host "  git commit -m `"chore: monorepo stable`""
Write-Host "  git push"
