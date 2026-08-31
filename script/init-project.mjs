import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptDir, "..")
const folderName = path.basename(root)

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8")
}

function writeText(file, content) {
  fs.writeFileSync(path.join(root, file), content, "utf8")
}

function toKebabCase(value) {
  return value
    .replace(/[\\/_\s]+/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function toTitle(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getArgValue(names) {
  const args = process.argv.slice(2).filter(arg => arg !== "--")
  for (let i = 0; i < args.length; i++) {
    for (const name of names) {
      if (args[i] === name && args[i + 1]) return args[i + 1]
      if (args[i].startsWith(`${name}=`)) return args[i].slice(name.length + 1)
    }
  }
}

const env = readText(".env")
const currentTitle = env.match(/^VITE_APP_TITLE\s*=\s*(.+)$/m)?.[1]?.trim()
const projectTitle = getArgValue(["--title", "--ProjectTitle", "-ProjectTitle"])
  || (currentTitle !== "Vue Admin Template" ? currentTitle : toTitle(folderName))
const projectName = toKebabCase(folderName)

const packageJson = JSON.parse(readText("package.json"))
packageJson.name = projectName
writeText("package.json", `${JSON.stringify(packageJson, null, 2)}\n`)

writeText(
  ".env",
  env.replace(/^VITE_APP_TITLE\s*=\s*.+$/m, `VITE_APP_TITLE = ${projectTitle}`)
)

const cacheKeyFile = "src/common/constants/cache-key.ts"
writeText(
  cacheKeyFile,
  readText(cacheKeyFile).replace(
    /const SYSTEM_NAME = "[^"]+"/,
    `const SYSTEM_NAME = "${projectName}"`
  )
)

const loginFile = "src/pages/login/index.vue"
writeText(
  loginFile,
  readText(loginFile).replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${projectTitle}</h1>`)
)

console.log(`项目初始化完成：${projectName} / ${projectTitle}`)
