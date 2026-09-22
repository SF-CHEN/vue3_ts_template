import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)
const allowMajor = args.includes("--latest")
const dryRun = args.includes("--dry-run")
const skipInstall = args.includes("--no-install")

// vue-tsc / Volar 仍依赖 TS 6 的 JS Compiler API，7.0 不能作为 typescript 包名。
const maxMajorExclusive = {
  typescript: 7
}

function parseVersion(version) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3])
  }
}

function compareVersion(a, b) {
  const left = parseVersion(a)
  const right = parseVersion(b)
  if (!left || !right) return 0
  return left.major - right.major || left.minor - right.minor || left.patch - right.patch
}

function isStable(version) {
  return /^\d+\.\d+\.\d+$/.test(version)
}

function pickTarget(name, current, versions, latestTag) {
  const currentParsed = parseVersion(current)
  if (!currentParsed) return current

  const cap = maxMajorExclusive[name]
  const candidates = versions.filter((version) => {
    if (!isStable(version)) return false
    const parsed = parseVersion(version)
    if (!parsed) return false
    if (cap !== undefined && parsed.major >= cap) return false
    if (!allowMajor && parsed.major !== currentParsed.major) return false
    return true
  })

  if (candidates.length === 0) return current

  const preferred = allowMajor && isStable(latestTag) && candidates.includes(latestTag)
    ? latestTag
    : candidates.reduce((best, version) => compareVersion(version, best) > 0 ? version : best)

  return preferred
}

async function fetchPackument(name) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}`
  let lastError = new Error(`${name}: fetch failed`)

  // 缩略 packument 更小；个别包（如 unocss）全量文档容易超时。
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/vnd.npm.install-v1+json" },
        signal: AbortSignal.timeout(15000)
      })
      if (!res.ok) throw new Error(`${name}: registry ${res.status}`)
      const data = await res.json()
      return {
        latest: data["dist-tags"]?.latest ?? "",
        versions: Object.keys(data.versions ?? {})
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }

  throw lastError
}

function collectDeps(pkg) {
  return [
    ...Object.keys(pkg.dependencies ?? {}).map(name => ({ name, section: "dependencies" })),
    ...Object.keys(pkg.devDependencies ?? {}).map(name => ({ name, section: "devDependencies" }))
  ]
}

async function main() {
  const pkgPath = path.join(root, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  const entries = collectDeps(pkg)

  const results = await Promise.all(entries.map(async ({ name, section }) => {
    const current = pkg[section][name]
    try {
      const { latest, versions } = await fetchPackument(name)
      return { name, section, current, next: pickTarget(name, current, versions, latest) }
    } catch (error) {
      return { name, section, current, error: error instanceof Error ? error.message : String(error) }
    }
  }))

  const updates = []
  const skipped = []

  for (const item of results) {
    if ("error" in item && item.error) {
      skipped.push({ name: item.name, reason: item.error })
      continue
    }
    if (item.next !== item.current) {
      updates.push(item)
      pkg[item.section][item.name] = item.next
    }
  }

  if (updates.length === 0) {
    console.log(allowMajor ? "依赖已是可用的最新版本。" : "当前 major 内已是最新。可用 --latest 尝试跨大版本。")
  } else {
    console.log(allowMajor ? "将更新到最新可用版本：" : "将在当前 major 内更新：")
    const width = Math.max(...updates.map(item => item.name.length))
    for (const item of updates) {
      console.log(`  ${item.name.padEnd(width)}  ${item.current}  →  ${item.next}`)
    }
  }

  if (skipped.length > 0) {
    console.log("查询失败，已跳过：")
    for (const item of skipped) {
      console.log(`  ${item.name}: ${item.reason}`)
    }
  }

  if (dryRun || updates.length === 0) {
    process.exit(updates.length === 0 && skipped.length === entries.length ? 1 : 0)
  }

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

  if (!skipInstall) {
    const result = spawnSync("pnpm", ["install"], {
      cwd: root,
      stdio: "inherit",
      shell: true
    })
    process.exit(result.status ?? 1)
  }
}

main()
