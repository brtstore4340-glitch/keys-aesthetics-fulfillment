# File: tools\fix-vite-install.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

trap {
  Write-Host "[FATAL] $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

function New-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function NowStamp { Get-Date -Format "yyyyMMdd_HHmmss" }

$RepoRoot = (Get-Location).Path
$ToolsDir = Join-Path $RepoRoot "tools"
$LogsDir  = Join-Path $ToolsDir "logs"
New-Dir $ToolsDir
New-Dir $LogsDir

$stamp = NowStamp
$LogFile = Join-Path $LogsDir ("fix_vite_{0}.log" -f $stamp)

function Write-Log([string]$Message, [string]$Level="INFO") {
  $line = "[{0}][{1}] {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"), $Level, $Message
  Add-Content -LiteralPath $LogFile -Value $line -Encoding utf8
  $color = switch ($Level) {
    "PASS" { "Green" }
    "WARN" { "Yellow" }
    "FAIL" { "Red" }
    default { "Cyan" }
  }
  Write-Host $line -ForegroundColor $color
}

function Run-Cmd([string]$File, [string[]]$Args, [string]$WorkDir) {
  Write-Log ("RUN: {0} {1} (cwd={2})" -f $File, ($Args -join " "), $WorkDir) "INFO"
  $p = Start-Process -FilePath $File -ArgumentList $Args -WorkingDirectory $WorkDir -NoNewWindow -PassThru -Wait
  $code = $p.ExitCode
  if ($code -eq 0) {
    Write-Log ("EXIT=0 OK: {0}" -f $File) "PASS"
  } else {
    Write-Log ("EXIT={0} FAIL: {1}" -f $code, $File) "FAIL"
  }
  return $code
}

function Backup-File([string]$Path) {
  if (Test-Path -LiteralPath $Path) {
    $bakDir = Join-Path $ToolsDir ("backup_{0}" -f $stamp)
    New-Dir $bakDir
    $dest = Join-Path $bakDir (Split-Path -Leaf $Path)
    Copy-Item -LiteralPath $Path -Destination $dest -Force
    Set-Content -LiteralPath (Join-Path $ToolsDir "LAST_BACKUP_DIR.txt") -Value $bakDir -Encoding utf8
    Write-Log ("Backup: {0} -> {1}" -f $Path, $dest) "PASS"
  }
}

function Find-PackageJsonTargets([string]$Root) {
  # พยายามหา package.json ที่น่าจะเป็นเว็บก่อน: web/, client/, app/ (ถ้ามี)
  $candidates = @()
  foreach ($name in @("web","client","app","frontend")) {
    $p = Join-Path $Root $name
    $pj = Join-Path $p "package.json"
    if (Test-Path -LiteralPath $pj) { $candidates += $p }
  }

  # ถ้าไม่เจอ ให้ใช้ root ถ้ามี package.json
  $rootPkg = Join-Path $Root "package.json"
  if ($candidates.Count -eq 0 -and (Test-Path -LiteralPath $rootPkg)) {
    $candidates += $Root
  }

  # ถ้ายังไม่เจอ ให้ค้น package.json ใต้โฟลเดอร์ (จำกัด depth)
  if ($candidates.Count -eq 0) {
    $found = Get-ChildItem -LiteralPath $Root -Recurse -File -Filter "package.json" -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
      Select-Object -First 10
    foreach ($f in $found) {
      $candidates += (Split-Path -Parent $f.FullName)
    }
    $candidates = $candidates | Select-Object -Unique
  }

  return $candidates
}

Write-Log ("RepoRoot: {0}" -f $RepoRoot) "INFO"
Write-Log ("LogFile:  {0}" -f $LogFile) "INFO"

# 1) Check Node/NPM
$nodeOk = $false
$npmOk  = $false

try {
  $nodeV = & node -v 2>$null
  if ($LASTEXITCODE -eq 0 -and $nodeV) { $nodeOk = $true; Write-Log ("node -v = {0}" -f $nodeV) "PASS" }
} catch { }

try {
  $npmV = & npm -v 2>$null
  if ($LASTEXITCODE -eq 0 -and $npmV) { $npmOk = $true; Write-Log ("npm  -v = {0}" -f $npmV) "PASS" }
} catch { }

if (-not $nodeOk -or -not $npmOk) {
  Write-Log "Node.js หรือ npm ใช้งานไม่ได้ (ต้องติดตั้ง Node ก่อน) -> แนะนำติดตั้ง Node LTS แล้วเปิด terminal ใหม่" "FAIL"
  exit 2
}

# 2) Find target package.json folders
$targets = Find-PackageJsonTargets $RepoRoot
if ($targets.Count -eq 0) {
  Write-Log "ไม่พบ package.json ในโฟลเดอร์นี้เลย -> กรุณา cd ไปที่โฟลเดอร์โปรเจกต์ที่ถูกต้อง" "FAIL"
  exit 3
}

Write-Log ("Found package.json targets: {0}" -f ($targets -join ", ")) "INFO"

# 3) Fix each target
$overallFail = $false

foreach ($workDir in $targets) {
  $pkgPath = Join-Path $workDir "package.json"
  if (-not (Test-Path -LiteralPath $pkgPath)) { continue }

  Write-Log ("---- TARGET: {0}" -f $workDir) "INFO"

  Backup-File $pkgPath
  Backup-File (Join-Path $workDir "package-lock.json")

  # Read package.json
  $raw = Get-Content -LiteralPath $pkgPath -Raw -Encoding utf8
  $json = $null
  try {
    $json = $raw | ConvertFrom-Json
  } catch {
    Write-Log ("package.json parse ไม่ได้: {0}" -f $pkgPath) "FAIL"
    $overallFail = $true
    continue
  }

  # Ensure scripts.dev exists (optional)
  $hasScripts = $false
  if ($null -ne $json.scripts) { $hasScripts = $true }

  # Check if Vite is installed
  $viteBin = Join-Path $workDir "node_modules\.bin\vite.cmd"
  $hasViteBin = Test-Path -LiteralPath $viteBin

  # 4) npm install if node_modules missing
  $nodeModules = Join-Path $workDir "node_modules"
  if (-not (Test-Path -LiteralPath $nodeModules)) {
    Write-Log "node_modules ไม่มี -> เริ่ม npm install" "WARN"
    $code = Run-Cmd "npm" @("install") $workDir
    if ($code -ne 0) {
      $overallFail = $true
      continue
    }
  } else {
    Write-Log "พบ node_modules แล้ว" "PASS"
  }

  # Refresh vite bin check
  $hasViteBin = Test-Path -LiteralPath $viteBin

  # 5) Install vite if missing
  if (-not $hasViteBin) {
    Write-Log "ยังไม่พบ vite ใน node_modules/.bin -> ติดตั้ง vite เป็น devDependency" "WARN"
    $code = Run-Cmd "npm" @("i","-D","vite") $workDir
    if ($code -ne 0) {
      $overallFail = $true
      continue
    }
  } else {
    Write-Log "มี vite แล้ว (node_modules/.bin)" "PASS"
  }

  # 6) Ensure scripts.dev is present (best effort, no over-engineer)
  $needWritePkg = $false
  if ($null -eq $json.scripts) {
    $json | Add-Member -NotePropertyName "scripts" -NotePropertyValue (@{}) -Force
    $needWritePkg = $true
  }
  if ($null -eq $json.scripts.dev -or [string]::IsNullOrWhiteSpace([string]$json.scripts.dev)) {
    $json.scripts.dev = "vite"
    $needWritePkg = $true
    Write-Log 'เพิ่ม "scripts.dev": "vite"' "PASS"
  }

  if ($needWritePkg) {
    $out = $json | ConvertTo-Json -Depth 50
    # เขียนแบบ UTF-8 no BOM
    [System.IO.File]::WriteAllText($pkgPath, $out, (New-Object System.Text.UTF8Encoding($false)))
    Write-Log ("Wrote package.json (utf8 no bom): {0}" -f $pkgPath) "PASS"
  } else {
    Write-Log "package.json ไม่ต้องแก้ scripts เพิ่ม" "PASS"
  }

  # 7) Verify vite
  $code = Run-Cmd "npm" @("exec","--","vite","--version") $workDir
  if ($code -ne 0) {
    Write-Log "vite ยังรันไม่ได้ -> ลอง npx vite --version" "WARN"
    $code2 = Run-Cmd "npx" @("vite","--version") $workDir
    if ($code2 -ne 0) { $overallFail = $true; continue }
  }

  # 8) Try run dev (optional, but helpful)
  if ($hasScripts) {
    Write-Log "ลองรัน: npm run dev (กด Ctrl+C เพื่อหยุดเมื่อขึ้น localhost แล้ว)" "INFO"
    Write-Log "หมายเหตุ: ถ้าเป็น CI/Terminal ที่ไม่อยากเปิด server ข้ามขั้นนี้ได้" "INFO"
    try {
      # ใช้ Start-Process เพื่อไม่ค้างสคริปต์แบบจับไม่ได้
      $p = Start-Process -FilePath "npm" -ArgumentList @("run","dev") -WorkingDirectory $workDir -PassThru
      Start-Sleep -Seconds 3
      if (-not $p.HasExited) {
        Write-Log "เริ่ม dev server แล้ว (ปล่อยให้รันต่อเอง) -> ถ้าจะหยุดให้กด Ctrl+C ในหน้าต่างนั้น" "PASS"
      } else {
        Write-Log ("dev exited early code={0}" -f $p.ExitCode) "WARN"
        if ($p.ExitCode -ne 0) { $overallFail = $true }
      }
    } catch {
      Write-Log ("รัน dev ไม่สำเร็จ: {0}" -f $_.Exception.Message) "FAIL"
      $overallFail = $true
    }
  } else {
    Write-Log "scripts ไม่พบใน package.json (แปลก) แต่ติดตั้ง vite แล้ว" "WARN"
  }
}

if ($overallFail) {
  Write-Log "สรุป: บาง target ยัง FAIL ให้ส่ง log กลับมาดูต่อ" "FAIL"
  exit 10
}

Write-Log "สรุป: ติดตั้ง/เช็ค Vite สำเร็จทุก target" "PASS"
exit 0
