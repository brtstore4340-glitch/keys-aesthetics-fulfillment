# publish-to-github.ps1
# Safe publish local project to GitHub (handles big repos ~10k files)
# - Backup .git
# - Detect >100MB files (GitHub blocks) and stop
# - Init, commit, create repo with gh (if available), push
#
# Run example:
# powershell -ExecutionPolicy Bypass -File .\publish-to-github.ps1 -ProjectPath "D:\MyApp" -Owner "myuser" -RepoName "myrepo" -Visibility private -UseSSH

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

trap {
  try { Write-Host "[FATAL] $($_.Exception.Message)" -ForegroundColor Red } catch {}
  exit 1
}

param(
  [Parameter(Mandatory=$true)][string]$ProjectPath,
  [Parameter(Mandatory=$true)][string]$Owner,
  [Parameter(Mandatory=$true)][string]$RepoName,
  [ValidateSet("public","private")][string]$Visibility = "private",
  [switch]$UseSSH,
  [string]$Branch = "main",
  [string]$CommitMessage = "Initial commit",
  [long]$BlockFileBytes = 100MB,
  [switch]$AutoCreateRepoWithGh = $true
)

function New-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Now-Stamp() {
  return (Get-Date).ToString("yyyyMMdd_HHmmss")
}

$toolsDir = Join-Path $ProjectPath "tools"
$logsDir  = Join-Path $toolsDir "logs"
New-Dir $toolsDir
New-Dir $logsDir

$logFile = Join-Path $logsDir ("publish_github_{0}.log" -f (Now-Stamp))
function Log([string]$Level, [string]$Msg) {
  $line = "[{0}][{1}] {2}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff"), $Level, $Msg
  Add-Content -LiteralPath $logFile -Value $line -Encoding UTF8
  switch ($Level) {
    "PASS" { Write-Host $line -ForegroundColor Green }
    "WARN" { Write-Host $line -ForegroundColor Yellow }
    "FAIL" { Write-Host $line -ForegroundColor Red }
    default { Write-Host $line -ForegroundColor Cyan }
  }
}

function Assert-Command([string]$Cmd) {
  $null = Get-Command $Cmd -ErrorAction Stop
}

function Run([string]$Exe, [string[]]$Args, [string]$WorkDir) {
  $argLine = ($Args -join " ")
  Log "INFO" ("RUN: {0} {1}" -f $Exe, $argLine)

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $Exe
  $psi.WorkingDirectory = $WorkDir
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError  = $true
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  foreach ($a in $Args) { [void]$psi.ArgumentList.Add($a) }

  $p = New-Object System.Diagnostics.Process
  $p.StartInfo = $psi
  $null = $p.Start()
  $stdout = $p.StandardOutput.ReadToEnd()
  $stderr = $p.StandardError.ReadToEnd()
  $p.WaitForExit()

  if ($stdout) { Log "INFO" $stdout.TrimEnd() }
  if ($stderr) { Log "WARN" $stderr.TrimEnd() }

  Log "INFO" ("EXITCODE: {0}" -f $p.ExitCode)
  return $p.ExitCode
}

function Backup-GitDir([string]$Root) {
  $gitDir = Join-Path $Root ".git"
  if (-not (Test-Path -LiteralPath $gitDir)) {
    Log "INFO" "No .git found. Skip backup."
    return $null
  }

  $bkRoot = Join-Path $toolsDir ("backup_{0}" -f (Now-Stamp))
  New-Dir $bkRoot
  $dest = Join-Path $bkRoot ".git"
  Log "INFO" ("Backing up .git => {0}" -f $dest)

  Copy-Item -LiteralPath $gitDir -Destination $dest -Recurse -Force

  $lastBk = Join-Path $toolsDir "LAST_BACKUP_DIR.txt"
  Set-Content -LiteralPath $lastBk -Value $bkRoot -Encoding UTF8
  Log "PASS" ("Backup done: {0}" -f $bkRoot)
  return $bkRoot
}

function Ensure-GitIgnore([string]$Root) {
  $gi = Join-Path $Root ".gitignore"
  if (Test-Path -LiteralPath $gi) {
    Log "INFO" ".gitignore already exists."
    return
  }

  $content = @'
# Node / JS
node_modules/
dist/
build/
coverage/
.vite/
.cache/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Env
.env
.env.*
!.env.example

# OS / Editor
.DS_Store
Thumbs.db
.vscode/
.idea/

# Firebase
.firebase/
*.log

# Local tooling
tools/backup_*/
tools/logs/
'@

  Set-Content -LiteralPath $gi -Value $content -Encoding UTF8
  Log "PASS" "Created .gitignore"
}

function Find-LargeFiles([string]$Root, [long]$LimitBytes) {
  Log "INFO" ("Scanning files >= {0} bytes (~{1} MB) ..." -f $LimitBytes, [math]::Round($LimitBytes/1MB,2))

  $skipDirs = @(
    "\node_modules\",
    "\dist\",
    "\build\",
    "\.git\",
    "\.firebase\",
    "\.vite\",
    "\tools\backup_",
    "\tools\logs\"
  )

  $results = New-Object System.Collections.Generic.List[object]

  Get-ChildItem -LiteralPath $Root -Recurse -File -Force |
    ForEach-Object {
      $full = $_.FullName
      foreach ($sd in $skipDirs) {
        if ($full -like "*$sd*") { return }
      }
      if ($_.Length -ge $LimitBytes) {
        $results.Add([pscustomobject]@{
          Path = $full.Substring($Root.Length).TrimStart("\")
          SizeMB = [math]::Round($_.Length / 1MB, 2)
        })
      }
    }

  return $results
}

# -------------------- MAIN --------------------
if (-not (Test-Path -LiteralPath $ProjectPath)) {
  throw "ProjectPath not found: $ProjectPath"
}

$ProjectPath = (Resolve-Path -LiteralPath $ProjectPath).Path
Log "INFO" ("ProjectPath: {0}" -f $ProjectPath)
Log "INFO" ("Owner/Repo: {0}/{1}  Visibility: {2}  Branch: {3}  UseSSH: {4}" -f $Owner,$RepoName,$Visibility,$Branch,$UseSSH.IsPresent)

Assert-Command "git"
Log "PASS" ("git: {0}" -f (& git --version))

$ghOk = $true
try {
  Assert-Command "gh"
  Log "PASS" ("gh: {0}" -f (& gh --version | Select-Object -First 1))
} catch {
  $ghOk = $false
  Log "WARN" "gh (GitHub CLI) not found. Repo auto-create will be skipped."
}

# 1) Backup existing .git
Backup-GitDir -Root $ProjectPath | Out-Null

# 2) Block large files (>=100MB)
$large = Find-LargeFiles -Root $ProjectPath -LimitBytes $BlockFileBytes
if ($large.Count -gt 0) {
  $listFile = Join-Path $toolsDir "LARGE_FILES_BLOCKED.txt"
  $lines = $large | Sort-Object SizeMB -Descending | ForEach-Object { "{0} MB`t{1}" -f $_.SizeMB, $_.Path }
  Set-Content -LiteralPath $listFile -Value $lines -Encoding UTF8

  Log "FAIL" ("Found {0} file(s) too large for normal GitHub push. See: {1}" -f $large.Count, $listFile)
  Log "WARN" "Fix: remove them from repo, or use Git LFS for those file types."
  Log "WARN" "GitHub blocks single files over 100MB, and push size is enforced at 2GB."
  exit 3
} else {
  Log "PASS" "No blocked large files found."
}

# 3) Ensure .gitignore
Ensure-GitIgnore -Root $ProjectPath

# 4) Init git if needed
$gitDir = Join-Path $ProjectPath ".git"
if (-not (Test-Path -LiteralPath $gitDir)) {
  $ec = Run -Exe "git" -Args @("init") -WorkDir $ProjectPath
  if ($ec -ne 0) { throw "git init failed" }
} else {
  Log "INFO" ".git exists. Using existing repo."
}

# 5) Performance knobs for big repos on Windows
try {
  Run "git" @("config","core.preloadindex","true") $ProjectPath | Out-Null
  Run "git" @("config","core.fscache","true") $ProjectPath | Out-Null
  Run "git" @("config","gc.auto","0") $ProjectPath | Out-Null
  Log "PASS" "Applied git performance configs."
} catch {
  Log "WARN" "Could not apply some git configs (non-fatal)."
}

# 6) Set default branch name
try {
  Run "git" @("branch","-M",$Branch) $ProjectPath | Out-Null
} catch {
  Log "WARN" "Could not rename branch (non-fatal)."
}

# 7) Add + commit
$ecAdd = Run -Exe "git" -Args @("add","-A") -WorkDir $ProjectPath
if ($ecAdd -ne 0) { throw "git add failed" }

# Commit (handle empty commit)
$ecCommit = Run -Exe "git" -Args @("commit","-m",$CommitMessage) -WorkDir $ProjectPath
if ($ecCommit -ne 0) {
  Log "WARN" "git commit failed (maybe nothing to commit). Continuing..."
}

# 8) Remote URL
$remoteUrl = ""
if ($UseSSH) {
  $remoteUrl = "git@github.com:{0}/{1}.git" -f $Owner, $RepoName
} else {
  $remoteUrl = "https://github.com/{0}/{1}.git" -f $Owner, $RepoName
}
Log "INFO" ("Remote URL: {0}" -f $remoteUrl)

# 9) Create repo via gh (optional)
if ($AutoCreateRepoWithGh -and $ghOk) {
  # Check if repo already exists
  $ecView = Run -Exe "gh" -Args @("repo","view","{0}/{1}" -f $Owner,$RepoName) -WorkDir $ProjectPath
  if ($ecView -ne 0) {
    $visArg = if ($Visibility -eq "public") { "--public" } else { "--private" }
    $args = @("repo","create","{0}/{1}" -f $Owner,$RepoName, $visArg, "--source=.", "--remote=origin", "--push")
    $ecCreate = Run -Exe "gh" -Args $args -WorkDir $ProjectPath
    if ($ecCreate -ne 0) {
      Log "WARN" "gh repo create failed. We'll try manual remote set + push."
    } else {
      Log "PASS" "Repo created and pushed via gh."
      Log "PASS" ("DONE. Open: https://github.com/{0}/{1}" -f $Owner,$RepoName)
      exit 0
    }
  } else {
    Log "INFO" "Repo exists on GitHub already."
  }
}

# 10) Ensure remote origin
$ecRemoteList = Run -Exe "git" -Args @("remote") -WorkDir $ProjectPath
if ($ecRemoteList -ne 0) { throw "git remote list failed" }

# Add/set origin
try {
  Run "git" @("remote","add","origin",$remoteUrl) $ProjectPath | Out-Null
  Log "PASS" "Added remote origin."
} catch {
  # If exists, set-url
  Run "git" @("remote","set-url","origin",$remoteUrl) $ProjectPath | Out-Null
  Log "PASS" "Updated remote origin URL."
}

# 11) Push
$ecPush = Run -Exe "git" -Args @("push","-u","origin",$Branch) -WorkDir $ProjectPath
if ($ecPush -ne 0) {
  Log "FAIL" "git push failed. Most common causes: auth / blocked file / push too large."
  Log "WARN" "If using HTTPS, you may need GitHub token login. If using SSH, ensure SSH key is set."
  exit 4
}

Log "PASS" ("DONE. Open: https://github.com/{0}/{1}" -f $Owner,$RepoName)
exit 0
