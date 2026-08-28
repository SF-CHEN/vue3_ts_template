<#
.SYNOPSIS
  仅初始化项目配置（包名 / 标题 / 缓存 Key 等），不复制或拉取模板。

.EXAMPLE
  pnpm run init

.EXAMPLE
  pnpm run init -- -ProjectTitle 数据保险箱
#>

# 不使用 param() 命名参数：pnpm 会传入 "--"，导致 -File 下 -ProjectTitle 绑定失败
$ErrorActionPreference = "Stop"
try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $OutputEncoding = [Console]::OutputEncoding
  if ($PSVersionTable.PSVersion.Major -ge 7) {
    [Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
  }
} catch {
  # 忽略控制台编码设置失败，不影响文件写入
}

function Get-CliArgValue {
  param(
    [AllowEmptyCollection()]
    [string[]] $ArgList,
    [string[]] $Names
  )
  for ($i = 0; $i -lt $ArgList.Count; $i++) {
    $current = $ArgList[$i]
    foreach ($name in $Names) {
      if ($current -eq $name -and ($i + 1) -lt $ArgList.Count) {
        return $ArgList[$i + 1]
      }
      $prefix = "$name="
      if ($current.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $current.Substring($prefix.Length)
      }
    }
  }
  return $null
}

function Get-ProjectRoot {
  param([string] $ScriptRoot = $PSScriptRoot)
  return (Resolve-Path (Join-Path $ScriptRoot "..")).Path
}

function ConvertTo-KebabCase([string] $Name) {
  $s = $Name -replace '[\\/_\s]+', '-'
  $s = $s -creplace '([a-z0-9])([A-Z])', '$1-$2'
  return ($s.ToLower() -replace '-+', '-' -replace '^-|-$', '')
}

function ConvertTo-TitleCase([string] $Name) {
  $parts = ($Name -split '[-_\s]+' | Where-Object { $_ })
  return ($parts | ForEach-Object {
      if ($_.Length -le 1) { $_.ToUpper() } else { $_.Substring(0, 1).ToUpper() + $_.Substring(1).ToLower() }
    }) -join ' '
}

function Read-ViteTitleFromEnv([string] $Root) {
  $envFile = Join-Path $Root ".env"
  if (-not (Test-Path -LiteralPath $envFile)) { return $null }
  $content = [System.IO.File]::ReadAllText($envFile, [System.Text.UTF8Encoding]::new($false))
  if ($content -match 'VITE_APP_TITLE\s*=\s*(.+)') {
    return $Matches[1].Trim()
  }
  return $null
}

function Read-PackageName([string] $Root) {
  $pkg = Join-Path $root "package.json"
  if (-not (Test-Path -LiteralPath $pkg)) { return $null }
  $content = [System.IO.File]::ReadAllText($pkg, [System.Text.UTF8Encoding]::new($false))
  if ($content -match '"name"\s*:\s*"([^"]+)"') {
    return $Matches[1]
  }
  return $null
}

function Read-SystemName([string] $Root) {
  $file = Join-Path $Root "src/common/constants/cache-key.ts"
  if (-not (Test-Path -LiteralPath $file)) { return $null }
  $content = [System.IO.File]::ReadAllText($file, [System.Text.UTF8Encoding]::new($false))
  if ($content -match 'const SYSTEM_NAME = "([^"]+)"') {
    return $Matches[1]
  }
  return $null
}

function Set-FileContentUtf8([string] $FilePath, [string] $Content) {
  [System.IO.File]::WriteAllText($FilePath, $Content, [System.Text.UTF8Encoding]::new($false))
}

function Update-TextFile {
  param(
    [string] $FilePath,
    [scriptblock] $Updater,
    [string] $Label,
    [ref] $ChangeCount
  )
  if (-not (Test-Path -LiteralPath $FilePath)) {
    Write-Host "  skip (missing): $FilePath" -ForegroundColor DarkGray
    return
  }
  $content = [System.IO.File]::ReadAllText($FilePath, [System.Text.UTF8Encoding]::new($false))
  $updated = & $Updater $content
  if ($null -ne $updated -and $updated -ne $content) {
    Set-FileContentUtf8 $FilePath $updated
    $ChangeCount.Value++
    Write-Host "  ok $Label" -ForegroundColor Green
  }
}

# 剥离 pnpm/npm 传入的 "--"，再解析 -ProjectTitle
$argList = @($args | Where-Object { $_ -ne '--' })
$ProjectTitle = Get-CliArgValue -ArgList $argList -Names @('-ProjectTitle', '--ProjectTitle', 'ProjectTitle')

# 本仓库作为模板时的占位（复制后按文件夹名替换）
$TemplateDefaults = @{
  projectName  = 'vue-admin-template'
  projectTitle = 'Vue Admin Template'
  systemName   = 'vue-admin-template'
  loginTitle   = 'Vue Admin Template'
}

$root = Get-ProjectRoot
$folderName = Split-Path $root -Leaf
$t = $TemplateDefaults

$existingTitle = Read-ViteTitleFromEnv $root
$existingPackageName = Read-PackageName $root
$existingSystemName = Read-SystemName $root

$resolvedTitle = if (-not [string]::IsNullOrWhiteSpace($ProjectTitle)) {
  $ProjectTitle.Trim()
} elseif ($existingTitle -and $existingTitle -ne $t.projectTitle) {
  $existingTitle
} else {
  ConvertTo-TitleCase $folderName
}

$n = @{
  projectName  = ConvertTo-KebabCase $folderName
  projectTitle = $resolvedTitle
  systemName   = ConvertTo-KebabCase $folderName
  loginTitle   = $resolvedTitle
}

Write-Host "=== Init from folder: $folderName ===" -ForegroundColor Cyan
Write-Host "package=$($n.projectName)  title=$($n.projectTitle)  system=$($n.systemName)`n"

$changes = 0
$changeRef = [ref]$changes

# package.json name：优先替换当前值，其次模板占位
Update-TextFile -FilePath (Join-Path $root "package.json") -Label "package.json name" -ChangeCount $changeRef -Updater {
  param($content)
  $fromNames = @($existingPackageName, $t.projectName) | Where-Object { $_ } | Select-Object -Unique
  foreach ($from in $fromNames) {
    if ($from -eq $n.projectName) { continue }
    $next = $content.Replace("`"name`": `"$from`"", "`"name`": `"$($n.projectName)`"")
    if ($next -ne $content) { return $next }
  }
  return $content
}

# .env 标题：整行替换，支持重复执行 / -ProjectTitle
Update-TextFile -FilePath (Join-Path $root ".env") -Label "env VITE_APP_TITLE" -ChangeCount $changeRef -Updater {
  param($content)
  return [regex]::Replace(
    $content,
    'VITE_APP_TITLE\s*=\s*.+',
    "VITE_APP_TITLE = $($n.projectTitle)",
    1
  )
}

# cache-key SYSTEM_NAME
Update-TextFile -FilePath (Join-Path $root "src/common/constants/cache-key.ts") -Label "cache-key SYSTEM_NAME" -ChangeCount $changeRef -Updater {
  param($content)
  $fromNames = @($existingSystemName, $t.systemName) | Where-Object { $_ } | Select-Object -Unique
  foreach ($from in $fromNames) {
    if ($from -eq $n.systemName) { continue }
    $next = $content.Replace("const SYSTEM_NAME = `"$from`"", "const SYSTEM_NAME = `"$($n.systemName)`"")
    if ($next -ne $content) { return $next }
  }
  return $content
}

# 登录页标题：替换模板 HTML 标题，或已有纯文本标题
Update-TextFile -FilePath (Join-Path $root "src/pages/login/index.vue") -Label "login title" -ChangeCount $changeRef -Updater {
  param($content)
  $candidates = @(
    $t.loginTitle,
    $existingTitle,
    'Vue Admin Template'
  ) | Where-Object { $_ -and $_ -ne $n.loginTitle } | Select-Object -Unique

  foreach ($from in $candidates) {
    if ($content.Contains($from)) {
      return $content.Replace($from, $n.loginTitle)
    }
  }

  # 兜底：直接替换 <h1>...</h1>（替换串中的 $ 需转义）
  $safeTitle = $n.loginTitle.Replace('$', '$$')
  return [regex]::Replace($content, '<h1>[\s\S]*?</h1>', "<h1>$safeTitle</h1>", 1)
}

Write-Host "`n=== Done ($changes changes) ===" -ForegroundColor Green
Write-Host "Optional: pnpm run init -- -ProjectTitle 中文标题" -ForegroundColor Yellow
