const fs = require("node:fs")
const http = require("node:http")
const https = require("node:https")
const path = require("node:path")

/** 唯一本地缓存：由 SWAGGER_URL 拉取写入，再根据内容识别 v2 / v3 */
const DEFAULT_FILE = path.resolve(__dirname, "api.json")
const PROJECT_ROOT = path.resolve(__dirname, "..")

/** 中文 / 特殊 schema 名映射为合法 TS 标识符片段（按项目需要自行扩展） */
const CN_SCHEMA_NAME_MAP = {
  对象: "",
  实体: "Entity",
  分页查询实体类: "PageQuerySo"
}

/** 确保目录存在，不存在则递归创建 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/** 确保文件所在父目录存在 */
function ensureDirForFile(filePath) {
  ensureDir(path.dirname(filePath))
}

/**
 * 读取 .env 文件到 process.env（不覆盖已有环境变量）
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, "utf-8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const eq = trimmed.indexOf("=")
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith("'") && value.endsWith("'"))
      || (value.startsWith("\"") && value.endsWith("\""))
    ) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function loadProjectEnv() {
  const mode = process.env.NODE_ENV === "production" ? "production" : "development"
  loadEnvFile(path.join(PROJECT_ROOT, `.env.${mode}`))
  loadEnvFile(path.join(PROJECT_ROOT, ".env"))
}

/**
 * 解析命令行参数与环境变量
 * 支持: --url / --file / 位置参数 / SWAGGER_URL / SWAGGER_FILE
 * 默认缓存文件固定为 script/api.json
 */
function parseArgs() {
  loadProjectEnv()

  const args = process.argv.slice(2)
  let url = (process.env.SWAGGER_URL || "").trim()
  let file = (process.env.SWAGGER_FILE || "").trim()

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--url" && args[i + 1]) {
      url = args[++i]
    } else if (arg.startsWith("--url=")) {
      url = arg.slice(6)
    } else if (arg === "--file" && args[i + 1]) {
      file = args[++i]
    } else if (arg.startsWith("--file=")) {
      file = arg.slice(7)
    } else if (!arg.startsWith("-")) {
      if (/^https?:\/\//i.test(arg)) {
        url = arg
      } else {
        file = arg
      }
    }
  }

  const resolvedFile = file
    ? path.isAbsolute(file)
      ? file
      : path.resolve(process.cwd(), file)
    : DEFAULT_FILE

  return { url, file: resolvedFile }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http
    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchJson(res.headers.location).then(resolve).catch(reject)
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`请求失败 (${res.statusCode}): ${url}`))
          res.resume()
          return
        }
        let data = ""
        res.on("data", (chunk) => {
          data += chunk
        })
        res.on("end", () => {
          try {
            resolve(JSON.parse(data))
          } catch {
            reject(new Error(`响应不是有效 JSON: ${url}`))
          }
        })
      })
      .on("error", reject)
  })
}

/**
 * 根据文档内容识别版本
 * @returns {"v2" | "v3"} 识别出的 Swagger / OpenAPI 主版本
 */
function detectSwaggerVersion(schema) {
  if (!schema || typeof schema !== "object") {
    throw new Error("无效的 Swagger / OpenAPI 文档")
  }
  if (schema.swagger === "2.0") return "v2"
  if (typeof schema.openapi === "string" && schema.openapi.startsWith("3")) return "v3"
  throw new Error(
    `无法识别文档版本（需 swagger: "2.0" 或 openapi: "3.x"），当前字段: swagger=${schema.swagger}, openapi=${schema.openapi}`
  )
}

/** 将中文 / 特殊片段转为标识符友好字符串 */
function mapSchemaNamePart(part) {
  const trimmed = String(part || "").trim()
  if (!trimmed) return ""
  if (Object.hasOwn(CN_SCHEMA_NAME_MAP, trimmed)) {
    return CN_SCHEMA_NAME_MAP[trimmed]
  }

  let result = trimmed
  for (const [cn, en] of Object.entries(CN_SCHEMA_NAME_MAP)) {
    if (!cn) continue
    result = result.split(cn).join(en)
  }
  return result
}

/**
 * 将 schema 名清洗为合法 PascalCase 标识符
 * 例: Result«Page«AttackMethod对象»» → ResultPageAttackMethod
 */
function sanitizeTypeName(rawName) {
  let name = String(rawName || "")

  // 由内向外展开泛型 « »
  let prev = null
  while (name !== prev && name.includes("«")) {
    prev = name
    name = name.replace(/([^«»]+)«([^«»]+)»/g, (_, outer, inner) => {
      const innerName = sanitizeTypeName(inner)
      const outerName = mapSchemaNamePart(outer)
      return `${outerName}${innerName}`
    })
  }

  name = mapSchemaNamePart(name)
  name = name
    .replace(/对象/g, "")
    .replace(/[^\w$]/g, "")

  if (!name) name = "UnknownSchema"
  if (!/^[A-Z_$]/i.test(name)) name = `T${name}`

  // 基础类型包装：Resultboolean → ResultBoolean
  name = name.replace(/^(Result|Page|List|BaseDropVo)(boolean|int|object|string|number)$/i, (_, prefix, t) => {
    return `${prefix}${t.charAt(0).toUpperCase()}${t.slice(1).toLowerCase()}`
  })

  return name
}

/** 深拷贝 JSON 对象 */
function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

/**
 * 递归改写对象中的 $ref，并同步 definitions 键名
 * @returns {{ value: any, nameMap: Map<string, string> }} 改写后的对象及名称映射
 */
function rewriteRefsAndNames(root) {
  const nameMap = new Map()

  function mapName(original) {
    if (!nameMap.has(original)) {
      nameMap.set(original, sanitizeTypeName(original))
    }
    return nameMap.get(original)
  }

  function walk(node) {
    if (!node || typeof node !== "object") return node
    if (Array.isArray(node)) return node.map(walk)

    const next = {}
    for (const [key, value] of Object.entries(node)) {
      if (key === "$ref" && typeof value === "string") {
        const matched = value.match(/^#\/(definitions|components\/schemas)\/(.+)$/)
        if (matched) {
          const mapped = mapName(matched[2])
          next[key] = `#/components/schemas/${mapped}`
        } else {
          next[key] = value
        }
      } else {
        next[key] = walk(value)
      }
    }
    return next
  }

  return { value: walk(root), nameMap }
}

/** 将 Swagger2 参数顶层 type 收拢到 schema */
function normalizeV2Parameter(param) {
  if (!param || typeof param !== "object") return param
  if (param.in === "body") return param

  if (param.schema) return param

  const schema = {}
  if (param.type !== undefined) schema.type = param.type
  if (param.format !== undefined) schema.format = param.format
  if (param.items !== undefined) schema.items = param.items
  if (param.enum !== undefined) schema.enum = param.enum
  if (param.$ref !== undefined) schema.$ref = param.$ref

  const next = { ...param, schema: Object.keys(schema).length ? schema : { type: "string" } }
  delete next.type
  delete next.format
  delete next.items
  delete next.enum
  delete next.$ref
  return next
}

/** 将单个 operation 从 Swagger2 转为 OpenAPI3 形态 */
function normalizeV2Operation(operation) {
  if (!operation || typeof operation !== "object") return operation

  const next = { ...operation }
  const parameters = []
  let requestBody = null

  for (const param of operation.parameters || []) {
    if (param.in === "body") {
      requestBody = {
        required: param.required !== false,
        description: param.description,
        content: {
          "application/json": {
            schema: param.schema || { type: "object" }
          }
        }
      }
      continue
    }
    parameters.push(normalizeV2Parameter(param))
  }

  next.parameters = parameters
  if (requestBody) next.requestBody = requestBody

  const responses = {}
  for (const [code, response] of Object.entries(operation.responses || {})) {
    if (!response || typeof response !== "object") {
      responses[code] = response
      continue
    }
    if (response.schema) {
      const { schema, ...rest } = response
      responses[code] = {
        ...rest,
        content: {
          "application/json": { schema },
          "*/*": { schema }
        }
      }
    } else {
      responses[code] = response
    }
  }
  next.responses = responses

  return next
}

/** Swagger 2.0 → 内部 OpenAPI 3 形态 */
function normalizeSwaggerV2(rawSchema) {
  const cloned = cloneJson(rawSchema)
  const { value: rewritten, nameMap } = rewriteRefsAndNames(cloned)

  const schemas = {}
  for (const [originalName, schema] of Object.entries(rewritten.definitions || {})) {
    const mapped = nameMap.get(originalName) || sanitizeTypeName(originalName)
    schemas[mapped] = schema
  }

  const paths = {}
  for (const [url, methods] of Object.entries(rewritten.paths || {})) {
    const nextMethods = {}
    for (const [method, operation] of Object.entries(methods || {})) {
      if (method.startsWith("x-") || method === "parameters") {
        nextMethods[method] = operation
        continue
      }
      nextMethods[method] = normalizeV2Operation(operation)
    }
    paths[url] = nextMethods
  }

  return {
    openapi: "3.0.0",
    info: rewritten.info || { title: "API", version: "1.0.0" },
    paths,
    components: {
      schemas,
      securitySchemes: rewritten.securityDefinitions || {}
    },
    tags: rewritten.tags || [],
    servers: rewritten.host
      ? [{ url: `${rewritten.schemes?.[0] || "http"}://${rewritten.host}${rewritten.basePath || ""}` }]
      : []
  }
}

/** OpenAPI 3：仅做 $ref / schema 名清洗（通常已是合法标识符） */
function normalizeSwaggerV3(rawSchema) {
  const cloned = cloneJson(rawSchema)
  const components = cloned.components || {}
  const originalSchemas = components.schemas || {}

  const { value: rewritten, nameMap } = rewriteRefsAndNames(cloned)
  const schemas = {}
  for (const [originalName, schema] of Object.entries(rewritten.components?.schemas || originalSchemas)) {
    const mapped = nameMap.get(originalName) || sanitizeTypeName(originalName)
    schemas[mapped] = schema
  }

  return {
    ...rewritten,
    components: {
      ...(rewritten.components || {}),
      schemas
    }
  }
}

/**
 * 按内容识别版本并归一化为 OpenAPI3 形态
 * @returns {{ schema: object, version: "v2" | "v3" }} 归一化后的文档和原始版本
 */
function normalizeSwagger(rawSchema) {
  const version = detectSwaggerVersion(rawSchema)
  const schema = version === "v2" ? normalizeSwaggerV2(rawSchema) : normalizeSwaggerV3(rawSchema)
  return { schema, version }
}

/**
 * 加载 Swagger / OpenAPI 文档
 * - 有 SWAGGER_URL / --url：拉取并写入 script/api.json
 * - 无 URL：读取本地 api.json
 * - 根据 api.json 内容自动识别 v2 / v3 并归一化
 */
async function loadSwagger() {
  const { url, file } = parseArgs()
  let rawSchema

  if (url) {
    console.log(`📥 正在拉取 Swagger 文档: ${url}`)
    rawSchema = await fetchJson(url)
    ensureDirForFile(file)
    fs.writeFileSync(file, JSON.stringify(rawSchema, null, 2), "utf-8")
    console.log(`💾 已缓存到: ${path.relative(process.cwd(), file)}`)
  } else {
    if (!fs.existsSync(file)) {
      throw new Error(
        `未找到 Swagger 文件: ${file}\n请在 .env 中配置 SWAGGER_URL，或使用:\n  pnpm api:generate -- --url=http://localhost:8080/v3/api-docs`
      )
    }
    rawSchema = JSON.parse(fs.readFileSync(file, "utf-8"))
    console.log(`📄 读取本地文档: ${path.relative(process.cwd(), file)}`)
  }

  const { schema, version } = normalizeSwagger(rawSchema)
  console.log(`🔎 识别文档版本: ${version === "v2" ? "Swagger 2.0" : "OpenAPI 3.x"}`)
  return { schema, file, version, rawSchema }
}

module.exports = {
  loadSwagger,
  parseArgs,
  detectSwaggerVersion,
  normalizeSwagger,
  sanitizeTypeName,
  DEFAULT_FILE,
  ensureDir,
  ensureDirForFile
}
