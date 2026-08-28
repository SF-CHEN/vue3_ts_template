const fs = require("node:fs")
const path = require("node:path")
const { loadSwagger, ensureDir } = require("./load-swagger.cjs")

// ================= 配置项 =================
// Swagger 来源：.env 中 SWAGGER_URL 拉取到 script/api.json，再按内容识别 v2 / v3
// 例如: pnpm api:generate
//       pnpm api:generate -- --url=http://localhost:8080/v3/api-docs

/** 生成的 API 根目录：src/common/apis/<module>.ts + types/<module>.ts */
const OUTPUT_DIR = path.resolve(__dirname, "../src/common/apis")

/** 类型定义目录：src/common/apis/types/<module>.ts */
const TYPES_DIR = path.join(OUTPUT_DIR, "types")

/** 前端常量目录 */
const CONSTANTS_DIR = path.resolve(__dirname, "../src/common/constants")

/** enums.ts 输出路径（由 OpenAPI enum 字段自动生成） */
const ENUMS_FILE = path.join(CONSTANTS_DIR, "enums.ts")

/** options.ts 输出路径（由 enums 自动生成下拉选项，label 可手填并在重新生成时保留） */
const OPTIONS_FILE = path.join(CONSTANTS_DIR, "options.ts")

/** registry.ts 输出路径（Enum / Options 聚合入口） */
const REGISTRY_FILE = path.join(CONSTANTS_DIR, "registry.ts")

/** 基础请求工具的引入路径 */
const IMPORT_REQUEST_STR = "import { request } from \"@/http/axios\""

/** URL 前缀过滤（业务无关前缀，如网关 temp） */
const URL_PREFIX_REPLACE = { from: "/temp", to: "" }

/** 路径中的版本前缀，切模块时跳过，但仍保留在请求 URL 中（除非被 URL_PREFIX_REPLACE 去掉） */
const PATH_VERSION_PREFIXES = new Set(["temp", "v1", "v2", "v3", "api"])

/** HTTP method 白名单 */
const HTTP_METHODS = new Set(["get", "post", "put", "delete", "patch", "head", "options"])

/** 自动生成区域标记（标记外的代码重新生成时不会被覆盖） */
const GEN_START = "/* <generated> */"
const GEN_END = "/* </generated> */"
// =========================================

/** 转义正则特殊字符 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** 从代码中提取 export function 的函数名 */
function extractExportedFunctionNames(code) {
  const names = []
  const re = /export\s+function\s+(\w+)/g
  let m = re.exec(code)
  while (m !== null) {
    names.push(m[1])
    m = re.exec(code)
  }
  return names
}

/** 从单段函数代码中提取函数名 */
function getFunctionNameFromCode(funcCode) {
  const m = funcCode.match(/export\s+function\s+(\w+)/)
  return m ? m[1] : null
}

/**
 * 解析代码中的 export function 块（含上方注释）
 * @returns {Map<string, { block: string, keep: boolean }>} 函数名到代码块的映射
 */
function extractFunctionBlocks(code) {
  const blocks = new Map()
  const funcRe = /((?:\/\/[^\n]*\n)*)(export function (\w+)\([^)]*\))/g
  let match = funcRe.exec(code)

  while (match !== null) {
    const start = match.index
    const funcName = match[3]
    const comments = match[1]
    const braceStart = code.indexOf("{", funcRe.lastIndex)
    if (braceStart === -1) {
      match = funcRe.exec(code)
      continue
    }

    let depth = 0
    let end = braceStart
    for (let i = braceStart; i < code.length; i++) {
      if (code[i] === "{") {
        depth++
      } else if (code[i] === "}") {
        depth--
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }

    blocks.set(funcName, {
      block: code.slice(start, end).trim(),
      keep: /\/\/ @keep\b/.test(comments)
    })
    match = funcRe.exec(code)
  }

  return blocks
}

/** 提取 <generated> 与 </generated> 之间的内容 */
function extractGeneratedSection(content) {
  const pattern = new RegExp(
    `${escapeRegExp(GEN_START)}([\\s\\S]*?)${escapeRegExp(GEN_END)}`
  )
  const match = content.match(pattern)
  return match ? match[1] : ""
}

/** 提取 </generated> 之后的自定义区域 */
function extractCustomSection(content) {
  const endIdx = content.indexOf(GEN_END)
  if (endIdx === -1) return ""
  return content.slice(endIdx + GEN_END.length)
}

/**
 * 合并函数列表：跳过标记外已自定义的函数，保留带 @keep 的函数
 */
function resolveGeneratedFunctions(functions, existingContent, relPath) {
  const customSection = extractCustomSection(existingContent)
  const customFuncNames = new Set(extractExportedFunctionNames(customSection))

  const existingGenerated = extractGeneratedSection(existingContent)
  const keptBlocks = extractFunctionBlocks(existingGenerated)

  const resolved = []
  const skippedCustom = []
  const kept = []

  functions.forEach((code) => {
    const name = getFunctionNameFromCode(code)
    if (!name) {
      resolved.push(code)
      return
    }

    if (customFuncNames.has(name)) {
      skippedCustom.push(name)
      return
    }

    const existing = keptBlocks.get(name)
    if (existing?.keep) {
      resolved.push(existing.block)
      kept.push(name)
      return
    }

    resolved.push(code)
  })

  if (skippedCustom.length) {
    console.log(`  ⏭️  ${relPath} 跳过自定义函数: ${skippedCustom.join(", ")}`)
  }
  if (kept.length) {
    console.log(`  📌 ${relPath} 保留 @keep 函数: ${kept.join(", ")}`)
  }

  return resolved
}

/**
 * 合并模块文件：仅替换 <generated> 标记内的内容，保留标记外的自定义代码
 * import 顺序：type-sibling 在前，value-internal（@/http/axios）在后（符合 ESLint perfectionist）
 */
function mergeModuleFile(filePath, functions, typeImports, moduleName) {
  const relPath = path.relative(process.cwd(), filePath)
  const typeImportLine = typeImports.length
    ? `import type { ${typeImports.join(", ")} } from "./types/${moduleName}"\n`
    : ""
  const header = typeImportLine
    ? `${typeImportLine}${IMPORT_REQUEST_STR}\n\n`
    : `${IMPORT_REQUEST_STR}\n\n`
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : ""

  const resolvedFunctions = existing
    ? resolveGeneratedFunctions(functions, existing, relPath)
    : functions

  const generatedBody = resolvedFunctions.join("\n").trim()
  const generatedBlock = `${GEN_START}\n${generatedBody}\n${GEN_END}`

  if (!existing) {
    return `${header}${generatedBlock}\n`
  }

  const pattern = new RegExp(
    `${escapeRegExp(GEN_START)}[\\s\\S]*?${escapeRegExp(GEN_END)}`
  )

  if (pattern.test(existing)) {
    let updated = existing.replace(pattern, generatedBlock)
    // 先清掉全部 type 导入（兼容 CRLF、历史重复行），再写入唯一一行
    // 旧逻辑用 \n 结尾匹配，Windows CRLF 下会匹配失败并重复插入
    const typeImportPattern = /^import type \{[^}]+\} from ["']\.\/(?:type|types\/[^"']+)["']\r?\n/gm
    updated = updated.replace(typeImportPattern, "")

    if (typeImportLine) {
      if (updated.includes(IMPORT_REQUEST_STR)) {
        updated = updated.replace(
          IMPORT_REQUEST_STR,
          `${typeImportLine.trim()}\n${IMPORT_REQUEST_STR}`
        )
      } else {
        updated = `${typeImportLine}${updated}`
      }
    }
    return updated
  }

  console.warn(
    `⚠️  ${relPath} 无 <generated> 标记，已自动迁移（自定义代码请写在 </generated> 下方）`
  )
  return `${header}${generatedBlock}\n`
}

/**
 * 已存在且无 <generated> 的手写模块跳过覆盖
 * 兼容扁平文件 apis/<module>.ts 与旧目录 apis/<module>/index.ts
 */
function shouldSkipHandwrittenModule(moduleName) {
  const candidates = [
    path.join(OUTPUT_DIR, `${moduleName}.ts`),
    path.join(OUTPUT_DIR, moduleName, "index.ts")
  ]
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue
    const content = fs.readFileSync(filePath, "utf-8")
    if (!content.includes(GEN_START)) return true
  }
  return false
}

/** camelCase / PascalCase / snake → kebab-case */
function toKebabCase(str) {
  return String(str || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase()
}

/** kebab-case → PascalCase，如 attack-method → AttackMethod */
function kebabToPascalCase(str) {
  return String(str || "")
    .split("-")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

/**
 * 从 URL 提取模块目录名（kebab-case）
 * /temp/sys-dict/update → sys-dict
 * /V1/attackMethod/page → attack-method
 * /api/v1/users → users
 */
function getModuleNameFromUrl(reqUrl) {
  const pathParts = reqUrl.split("/").filter(Boolean)
  let start = 0
  while (start < pathParts.length - 1 && PATH_VERSION_PREFIXES.has(pathParts[start].toLowerCase())) {
    start += 1
  }
  return toKebabCase(pathParts[start] || "common") || "common"
}

/** 转换中划线/下划线命名为小驼峰 */
function toCamelCase(str) {
  str = str.replace(/_\d+$/, "")
  return str.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ""))
}

/** 属性名转 PascalCase（兼容 taskstatus / deployStatus 等） */
function toPropPascalCase(propName) {
  if (/^taskstatus$/i.test(propName)) return "TaskStatus"
  if (/^auditstatus$/i.test(propName)) return "AuditStatus"
  return propName.charAt(0).toUpperCase() + propName.slice(1)
}

/** Schema 名转 apis 模块目录名（EvaluationTask -> evaluation-task） */
function schemaToModuleName(schemaName) {
  return toKebabCase(schemaName)
}

/** enum 值集合签名（用于去重） */
function enumValuesSignature(values) {
  return [...values].sort().join("\0")
}

/** 是否跳过从 schema 扫描 enum（分页包装、统一响应等） */
function shouldScanSchemaForEnums(name) {
  if (/^Result[A-Z]/.test(name)) return false
  if (/^Page[A-Z]/.test(name)) return false
  if (name === "OrderItem") return false
  if (/^BaseDrop|^TreeDrop/.test(name)) return false
  return true
}

/**
 * 已知 enum 的命名与 canonical 来源（保证与业务语义一致、避免重复生成）
 * key: enumValuesSignature
 */
const KNOWN_ENUM_META = {
  [enumValuesSignature(["PENDING", "RUNNING", "COMPLETED", "FAILED", "PUBLISHED"])]: {
    typeName: "EvaluationTaskStatus",
    enumConstName: "EvaluationTaskStatusEnum",
    schemaName: "EvaluationTask",
    propName: "taskstatus",
    description: "评测任务状态（与后端 EvaluationTask.taskstatus 一致）"
  },
  [enumValuesSignature(["NOT_DEPLOYED", "DEPLOYING", "DEPLOYED"])]: {
    typeName: "DeployStatus",
    enumConstName: "DeployStatusEnum",
    schemaName: "EvaluationTask",
    propName: "deployStatus",
    description: "部署状态（与后端 EvaluationTask.deployStatus 一致）"
  },
  [enumValuesSignature(["UNAUDITED", "AUDITED"])]: {
    typeName: "AuditStatus",
    enumConstName: "AuditStatusEnum",
    schemaName: "EvaluationTask",
    propName: "auditstatus",
    description: "审核状态（与后端 EvaluationTask.auditstatus 一致）"
  },
  [enumValuesSignature(["WAITING_IMAGE_UPLOAD", "PENDING", "REJECTED", "ACCEPTED", "RECALLED"])]: {
    typeName: "SubmissionTaskStatus",
    enumConstName: "SubmissionTaskStatusEnum",
    schemaName: "SubmissionTask",
    propName: "status",
    description: "送检任务状态（与后端 SubmissionTask.status 一致）"
  },
  [enumValuesSignature(["LOCAL_FILE", "REMOTE_PULL"])]: {
    typeName: "ImageMethod",
    enumConstName: "ImageMethodEnum",
    schemaName: "SubmissionTask",
    propName: "imageMethod",
    description: "镜像方式（与后端 SubmissionTask.imageMethod 一致）"
  },
  [enumValuesSignature(["WAITING", "RUNNING", "PAUSED", "FINISHED", "FAILED"])]: {
    typeName: "QTaskStatus",
    enumConstName: "QTaskStatusEnum",
    schemaName: "QTaskInfo",
    propName: "status",
    description: "Quartz 任务状态（与后端 QTaskInfo.status 一致）"
  },
  [enumValuesSignature([
    "MODEL_TYPE",
    "DATA_MODALITY",
    "DATA_TYPE",
    "IMAGE_TYPE",
    "DATA_FORMAT",
    "TASK_TYPE",
    "COMPOSITE_SCENE",
    "DIMENSION"
  ])]: {
    typeName: "DictType",
    enumConstName: "DictTypeEnum",
    schemaName: "SysDict",
    propName: "dictType",
    description: "系统字典类型（与后端 SysDict.dictType 一致，动态选项走 SysDict API）"
  }
}

/** 从未知 enum 推导类型名（fallback） */
function resolveFallbackEnumMeta(schemaName, propName, description) {
  const propPascal = toPropPascalCase(propName)
  let typeName

  if (propName === "status") {
    typeName = `${schemaName}Status`
  } else if (/^taskstatus$/i.test(propName)) {
    typeName = `${schemaName.replace(/Task$/, "")}TaskStatus`
  } else {
    typeName = `${schemaName}${propPascal}`
  }

  return {
    typeName,
    enumConstName: `${typeName}Enum`,
    schemaName,
    propName,
    description: description || `${typeName}（与后端 ${schemaName}.${propName} 一致）`
  }
}

/** 从 OpenAPI schemas 收集所有 enum 字段 */
function collectEnumDefinitions(schemas) {
  const grouped = new Map()

  Object.entries(schemas).forEach(([schemaName, schema]) => {
    if (!shouldScanSchemaForEnums(schemaName)) return
    if (!schema?.properties) return

    Object.entries(schema.properties).forEach(([propName, propConfig]) => {
      if (!propConfig?.enum?.length) return

      const signature = enumValuesSignature(propConfig.enum)
      if (!grouped.has(signature)) {
        grouped.set(signature, {
          values: [...propConfig.enum],
          candidates: []
        })
      }

      grouped.get(signature).candidates.push({
        schemaName,
        propName,
        description: propConfig.description || schema.description || ""
      })
    })
  })

  const definitions = []

  grouped.forEach((group, signature) => {
    const known = KNOWN_ENUM_META[signature]
    const meta = known || resolveFallbackEnumMeta(
      group.candidates[0].schemaName,
      group.candidates[0].propName,
      group.candidates[0].description
    )

    definitions.push({
      ...meta,
      values: group.values
    })
  })

  return definitions.sort((a, b) => a.typeName.localeCompare(b.typeName))
}

/** 生成 enums.ts 中 <generated> 区域内的内容（import + 枚举定义） */
function generateEnumsGeneratedBody(definitions, schemaModuleMap = new Map()) {
  const importByModule = new Map()

  definitions.forEach((def) => {
    const moduleName = schemaModuleMap.get(def.schemaName) || schemaToModuleName(def.schemaName)
    if (!importByModule.has(moduleName)) {
      importByModule.set(moduleName, new Set())
    }
    importByModule.get(moduleName).add(def.schemaName)
  })

  const importLines = [...importByModule.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([moduleName, schemaNames]) => {
      const types = [...schemaNames].sort().join(", ")
      return `import type { ${types} } from "@@/apis/types/${moduleName}"`
    })

  const blocks = definitions.map((def) => {
    const enumEntries = def.values
      .map(value => `  ${value}: '${value}',`)
      .join("\n")

    return `/** ${def.description} */
export type ${def.typeName} = NonNullable<${def.schemaName}['${def.propName}']>

export const ${def.enumConstName} = {
${enumEntries}
}`
  })

  return [
    ...importLines,
    "",
    blocks.join("\n\n"),
    ""
  ].join("\n")
}

/**
 * 合并带 <generated> 标记的常量文件：仅替换标记内内容，保留 </generated> 下方自定义代码
 */
function mergeConstantsGeneratedFile({ relPath, existingContent, generatedBody, customHint }) {
  const generatedBlock = `${GEN_START}\n${generatedBody.trim()}\n${GEN_END}`

  if (!existingContent) {
    return [
      "/** Auto-generated — do not edit manually */",
      "",
      generatedBlock,
      "",
      customHint,
      ""
    ].join("\n")
  }

  const customSection = extractCustomSection(existingContent)
  const pattern = new RegExp(
    `${escapeRegExp(GEN_START)}[\\s\\S]*?${escapeRegExp(GEN_END)}`
  )

  if (pattern.test(existingContent)) {
    const header = existingContent.slice(0, existingContent.indexOf(GEN_START)).trimEnd()
    return `${header}\n\n${generatedBlock}${customSection}`
  }

  console.warn(
    `⚠️  ${relPath} 无 <generated> 标记，已自动迁移（自定义代码请写在 </generated> 下方）`
  )
  return [
    "/** Auto-generated — do not edit manually */",
    "",
    generatedBlock,
    customSection || "\n"
  ].join("\n")
}

/** typeName -> OPTIONS 常量名，如 EvaluationTaskStatus -> EVALUATION_TASK_STATUS_OPTIONS */
function typeNameToOptionsConstName(typeName) {
  const snake = typeName.replace(/([A-Z])/g, "_$1").replace(/^_/, "").toUpperCase()
  return `${snake}_OPTIONS`
}

/** 解析已有 options.ts 中各 OPTIONS 的 label（按 enum 成员名匹配，重新生成时保留） */
function parseExistingOptionLabels(content) {
  const result = new Map()
  const block = content.includes(GEN_START) ? extractGeneratedSection(content) || content : content
  const optionsBlockRe = /export const (\w+) = \[([\s\S]*?)\]\s*as const/g
  let match = optionsBlockRe.exec(block)

  while (match !== null) {
    const constName = match[1]
    const arrayBody = match[2]
    const valueLabels = new Map()
    const itemRe = /\{\s*label:\s*('(?:\\'|[^'])*'|"")\s*,\s*value:\s*\w+\.(\w+)\s*\}/g
    let item = itemRe.exec(arrayBody)

    while (item !== null) {
      let label = item[1]
      if (label.startsWith("'")) {
        label = label.slice(1, -1).replace(/\\'/g, "'")
      } else {
        label = ""
      }
      valueLabels.set(item[2], label)
      item = itemRe.exec(arrayBody)
    }

    result.set(constName, valueLabels)
    match = optionsBlockRe.exec(block)
  }

  return result
}

/** 格式化 label 字面量（允许空字符串） */
function formatLabelLiteral(label) {
  if (!label) return "''"
  return `'${label.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`
}

/** 生成 options.ts 中 <generated> 区域内的内容 */
function generateOptionsGeneratedBody(definitions, existingLabels) {
  const enumImports = [...definitions.map(def => def.enumConstName)].sort()

  const blocks = definitions.map((def) => {
    const optionsConstName = typeNameToOptionsConstName(def.typeName)
    const preservedLabels = existingLabels.get(optionsConstName) || new Map()

    const items = def.values
      .map((value) => {
        const label = preservedLabels.get(value) ?? ""
        return `  { label: ${formatLabelLiteral(label)}, value: ${def.enumConstName}.${value} },`
      })
      .join("\n")

    return `/** ${def.description} */
export const ${optionsConstName} = [
${items}
] as const`
  })

  return [
    `import { ${enumImports.join(", ")} } from './enums'`,
    "",
    "/**",
    " * 下拉选择器选项",
    " * 用于 Select、Radio、Checkbox 等组件",
    " * label 默认为空，可手填；重新生成 api 时会按 value 保留已有 label",
    " */",
    "",
    blocks.join("\n\n"),
    ""
  ].join("\n")
}

/** typeName -> 聚合访问 key，如 EvaluationTaskStatus -> evaluationTaskStatus */
function typeNameToRegistryKey(typeName) {
  return typeName.charAt(0).toLowerCase() + typeName.slice(1)
}

/** OPTIONS 常量名 -> 聚合 key，如 EVALUATION_TASK_STATUS_OPTIONS -> evaluationTaskStatus */
function optionsConstNameToRegistryKey(constName) {
  if (constName.endsWith("_OPTIONS")) {
    const snake = constName.slice(0, -"_OPTIONS".length)
    return snake
      .toLowerCase()
      .split("_")
      .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
      .join("")
  }
  return constName.charAt(0).toLowerCase() + constName.slice(1)
}

/** 解析 options.ts 自定义区（</generated> 下方）导出的选项数组 */
function parseCustomOptionsExports(optionsContent, generatedConstNames) {
  const customSection = extractCustomSection(optionsContent)
  if (!customSection.trim()) return []

  const exports = []
  const seenKeys = new Set()
  const re = /export const (\w+) = \[/g
  let match = re.exec(customSection)

  while (match !== null) {
    const constName = match[1]
    if (generatedConstNames.has(constName)) {
      match = re.exec(customSection)
      continue
    }

    const registryKey = optionsConstNameToRegistryKey(constName)
    if (seenKeys.has(registryKey)) {
      console.warn(`  ⚠️  options 自定义选项 ${constName} 的 key "${registryKey}" 重复，已跳过`)
      match = re.exec(customSection)
      continue
    }

    seenKeys.add(registryKey)
    exports.push({ constName, registryKey })
    match = re.exec(customSection)
  }

  return exports.sort((a, b) => a.registryKey.localeCompare(b.registryKey))
}

/** 写入 options.ts */
function writeOptionsFile(definitions) {
  ensureDir(CONSTANTS_DIR)
  const existing = fs.existsSync(OPTIONS_FILE) ? fs.readFileSync(OPTIONS_FILE, "utf-8") : ""
  const existingLabels = parseExistingOptionLabels(existing)
  const generatedBody = generateOptionsGeneratedBody(definitions, existingLabels)
  const content = mergeConstantsGeneratedFile({
    relPath: "src/common/constants/options.ts",
    existingContent: existing,
    generatedBody,
    customHint: "// 自定义选项请写在此下方，重新生成 api 时不会覆盖，并会自动合并到 registry.ts 的 Options"
  })
  fs.writeFileSync(OPTIONS_FILE, content, "utf-8")
  console.log(`✅ 已生成常量: src/common/constants/options.ts (${definitions.length} 组选项)`)
}

/** 生成 registry.ts 中 <generated> 区域内的内容 */
function generateRegistryGeneratedBody(definitions, customOptionsExports = []) {
  const enumImports = [...new Set(definitions.map(def => def.enumConstName))].sort()

  const generatedOptions = definitions.map(def => ({
    registryKey: typeNameToRegistryKey(def.typeName),
    constName: typeNameToOptionsConstName(def.typeName)
  }))

  const generatedKeys = new Set(generatedOptions.map(item => item.registryKey))
  const mergedOptions = [...generatedOptions]

  customOptionsExports.forEach((item) => {
    if (generatedKeys.has(item.registryKey)) {
      console.warn(
        `  ⚠️  options 自定义选项 ${item.constName} 的 key "${item.registryKey}" 与生成项冲突，已跳过`
      )
      return
    }
    mergedOptions.push(item)
  })

  mergedOptions.sort((a, b) => a.registryKey.localeCompare(b.registryKey))

  const optionsImports = [...new Set(mergedOptions.map(item => item.constName))].sort()

  const enumEntries = definitions
    .map(def => `  ${typeNameToRegistryKey(def.typeName)}: ${def.enumConstName},`)
    .join("\n")

  const optionsEntries = mergedOptions
    .map(item => `  ${item.registryKey}: ${item.constName},`)
    .join("\n")

  return [
    `import { ${enumImports.join(", ")} } from './enums'`,
    `import { ${optionsImports.join(", ")} } from './options'`,
    "",
    "/** 枚举聚合入口，用法：Enum.evaluationTaskStatus.PENDING */",
    "export const Enum = {",
    enumEntries,
    "} as const",
    "",
    "/** 下拉选项聚合入口，用法：Options.evaluationTaskStatus（含 options.ts 自定义区导出） */",
    "export const Options = {",
    optionsEntries,
    "} as const",
    ""
  ].join("\n")
}

/** 写入 registry.ts */
function writeRegistryFile(definitions) {
  ensureDir(CONSTANTS_DIR)
  const optionsContent = fs.existsSync(OPTIONS_FILE) ? fs.readFileSync(OPTIONS_FILE, "utf-8") : ""
  const generatedConstNames = new Set(
    definitions.map(def => typeNameToOptionsConstName(def.typeName))
  )
  const customOptionsExports = parseCustomOptionsExports(optionsContent, generatedConstNames)
  const generatedBody = generateRegistryGeneratedBody(definitions, customOptionsExports)
  const existing = fs.existsSync(REGISTRY_FILE) ? fs.readFileSync(REGISTRY_FILE, "utf-8") : ""
  const content = mergeConstantsGeneratedFile({
    relPath: "src/common/constants/registry.ts",
    existingContent: existing,
    generatedBody,
    customHint: "// 自定义聚合入口请写在此下方，重新生成 api 时不会覆盖"
  })
  fs.writeFileSync(REGISTRY_FILE, content, "utf-8")

  const customHint = customOptionsExports.length
    ? `，含 ${customOptionsExports.length} 个自定义选项`
    : ""
  console.log(`✅ 已生成常量: src/common/constants/registry.ts${customHint}`)
}

/** 写入 enums.ts */
function writeEnumsFile(schemas, schemaModuleMap = new Map()) {
  ensureDir(CONSTANTS_DIR)
  const definitions = collectEnumDefinitions(schemas)
  const generatedBody = generateEnumsGeneratedBody(definitions, schemaModuleMap)
  const existing = fs.existsSync(ENUMS_FILE) ? fs.readFileSync(ENUMS_FILE, "utf-8") : ""
  const content = mergeConstantsGeneratedFile({
    relPath: "src/common/constants/enums.ts",
    existingContent: existing,
    generatedBody,
    customHint: "// 自定义枚举 / 扩展请写在此下方，重新生成 api 时不会覆盖"
  })
  fs.writeFileSync(ENUMS_FILE, content, "utf-8")
  console.log(`✅ 已生成常量: src/common/constants/enums.ts (${definitions.length} 个枚举)`)
  writeOptionsFile(definitions)
  writeRegistryFile(definitions)
  return definitions
}

/** 是否为 OpenAPI 路径参数段，如 {taskCode} */
function isPathParamSegment(segment) {
  return /^\{[^}]+\}$/.test(segment)
}

/** 是否为统一响应包装类型 Result / ResultXxx */
function isResultWrapper(name) {
  return name === "Result" || /^Result[A-Z]/.test(name)
}

/** 枚举值转 TS 联合类型 */
function formatEnumUnion(values) {
  return values.map(v => `'${v}'`).join(" | ")
}

/**
 * OpenAPI schema -> TypeScript 类型字符串
 */
function resolveTsType(schema, schemas) {
  if (!schema) return "unknown"

  if (schema.$ref) {
    return schema.$ref.split("/").pop()
  }

  if (schema.enum) {
    return formatEnumUnion(schema.enum)
  }

  if (schema.type === "array") {
    return `${resolveTsType(schema.items, schemas)}[]`
  }

  if (schema.type === "integer" || schema.type === "number") return "number"
  if (schema.type === "boolean") return "boolean"
  if (schema.type === "string") return "string"
  if (schema.type === "object") {
    if (schema.additionalProperties) {
      const valType = resolveTsType(schema.additionalProperties, schemas)
      return `Record<string, ${valType}>`
    }
    return "Record<string, unknown>"
  }

  if (schema.allOf?.length) {
    return schema.allOf.map(s => resolveTsType(s, schemas)).join(" & ")
  }

  if (schema.oneOf?.length || schema.anyOf?.length) {
    const items = schema.oneOf || schema.anyOf
    return items.map(s => resolveTsType(s, schemas)).join(" | ")
  }

  return "unknown"
}

/** 从 schema 递归收集 $ref 引用的类型名（不含 Result 包装） */
function collectSchemaRefs(schema, schemas, collected) {
  if (!schema) return

  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop()
    if (!collected.has(refName) && !isResultWrapper(refName)) {
      collected.add(refName)
      const refSchema = schemas[refName]
      if (refSchema) collectSchemaRefsFromObject(refSchema, schemas, collected)
    }
    return
  }

  if (schema.type === "array") {
    collectSchemaRefs(schema.items, schemas, collected)
    return
  }

  if (schema.allOf) schema.allOf.forEach(s => collectSchemaRefs(s, schemas, collected))
  if (schema.oneOf) schema.oneOf.forEach(s => collectSchemaRefs(s, schemas, collected))
  if (schema.anyOf) schema.anyOf.forEach(s => collectSchemaRefs(s, schemas, collected))
  if (schema.properties) {
    Object.values(schema.properties).forEach(prop =>
      collectSchemaRefs(prop, schemas, collected)
    )
  }
}

function collectSchemaRefsFromObject(schema, schemas, collected) {
  if (schema.properties) {
    Object.values(schema.properties).forEach(prop =>
      collectSchemaRefs(prop, schemas, collected)
    )
  }
  if (schema.enum && schema.$ref) {
    collectSchemaRefs(schema, schemas, collected)
  }
}

/** 从 requestBody 提取 schema（兼容 application/json、text/plain 等） */
function extractRequestBodySchema(requestBody) {
  if (!requestBody?.content) return null

  const preferredMediaTypes = [
    "application/json",
    "*/*",
    "application/x-www-form-urlencoded",
    "text/plain",
    "multipart/form-data"
  ]

  for (const mediaType of preferredMediaTypes) {
    if (requestBody.content[mediaType]?.schema) {
      return requestBody.content[mediaType].schema
    }
  }

  const first = Object.values(requestBody.content).find(item => item?.schema)
  return first?.schema ?? null
}

/** 是否应生成 request body 参数 */
function hasRequestBodyParam(requestBody, schemas) {
  const requestSchema = extractRequestBodySchema(requestBody)
  if (!requestSchema) return false

  const bodyType = resolveTsType(requestSchema, schemas)
  return !!bodyType && bodyType !== "unknown" && bodyType !== "void"
}

/** 获取 request body 的 TS 类型 */
function resolveRequestBodyType(requestBody, schemas) {
  const requestSchema = extractRequestBodySchema(requestBody)
  return requestSchema ? resolveTsType(requestSchema, schemas) : null
}

/** 从 operation 收集关联的 schema 引用 */
function collectRefsFromOperation(operation, schemas, collected) {
  (operation.parameters || []).forEach((param) => {
    collectSchemaRefs(param.schema, schemas, collected)
  })

  const requestSchema = extractRequestBodySchema(operation.requestBody)
  if (requestSchema) collectSchemaRefs(requestSchema, schemas, collected)

  const successResp = operation.responses?.["200"] || operation.responses?.["201"]
  const responseSchema
    = successResp?.content?.["application/json"]?.schema
      || successResp?.content?.["*/*"]?.schema
  if (responseSchema) {
    const unwrapped = unwrapResponseType(responseSchema, schemas)
    if (unwrapped.refName && !isResultWrapper(unwrapped.refName)) {
      collected.add(unwrapped.refName)
      collectSchemaRefsFromObject(schemas[unwrapped.refName], schemas, collected)
    }
  }
}

/**
 * 解包 ResultXxx 响应，返回实际 data 类型
 * @returns {{ tsType: string, refName?: string }} 解包后的类型信息
 */
function unwrapResponseType(schema, schemas) {
  if (!schema) return { tsType: "unknown" }

  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop()
    if (isResultWrapper(refName)) {
      const resultSchema = schemas[refName]
      const dataSchema = resultSchema?.properties?.data
      if (!dataSchema) return { tsType: "void" }

      // data: {} 或无实质类型的空 schema
      if (
        !dataSchema.$ref
        && !dataSchema.items
        && !dataSchema.properties
        && !dataSchema.type
      ) {
        return { tsType: "void" }
      }

      if (dataSchema.type === "boolean") return { tsType: "boolean" }
      if (dataSchema.type === "string") return { tsType: "string" }
      if (dataSchema.type === "integer" || dataSchema.type === "number") {
        return { tsType: "number" }
      }
      if (dataSchema.type === "array") {
        const itemType = resolveTsType(dataSchema.items, schemas)
        const itemRef = dataSchema.items?.$ref?.split("/").pop()
        return { tsType: `${itemType}[]`, refName: itemRef }
      }
      if (dataSchema.$ref) {
        const innerRef = dataSchema.$ref.split("/").pop()
        return { tsType: innerRef, refName: innerRef }
      }
      if (dataSchema.type === "object" && !dataSchema.properties) {
        return { tsType: "void" }
      }

      return { tsType: "void" }
    }
    return { tsType: refName, refName }
  }

  return { tsType: resolveTsType(schema, schemas) }
}

/** 清理 JSDoc 文本，避免破坏注释块 */
function sanitizeJSDoc(text) {
  if (!text) return ""
  return String(text).replace(/\*\//g, "* /").replace(/\s+/g, " ").trim()
}

/** 常见字段名 -> 默认注释（OpenAPI 未提供 description 时使用） */
const COMMON_PROP_DESCRIPTIONS = {
  id: "主键 ID",
  ids: "ID 列表",
  name: "名称",
  total: "总条数",
  size: "每页条数",
  current: "当前页码",
  pages: "总页数",
  records: "数据列表",
  orders: "排序规则",
  entity: "实体查询条件",
  data: "关联数据",
  children: "子节点",
  column: "排序字段",
  asc: "是否升序",
  deleted: "逻辑删除标记",
  createdat: "创建时间",
  updatedat: "更新时间",
  description: "描述",
  pageSize: "分页大小",
  pageCurrent: "当前页",
  orderColumn: "排序字段",
  orderType: "排序方式",
  pid: "父级 ID",
  dictType: "字典类型",
  dictValue: "字典值",
  enabled: "是否启用",
  sortOrder: "排序号"
}

/** 从 schema 名称推断接口注释 */
function inferSchemaDescription(name, schema) {
  if (schema?.description) return sanitizeJSDoc(schema.description)

  if (name === "OrderItem") return "排序项"

  if (name.startsWith("PageQuerySo")) {
    const entity = name.slice("PageQuerySo".length)
    return `${entity} 分页查询参数`
  }

  if (name.startsWith("Page")) {
    const entity = name.slice("Page".length)
    return `${entity} 分页结果`
  }

  if (name.startsWith("BaseDrop")) {
    const entity = name.slice("BaseDrop".length)
    return `${entity} 下拉选项`
  }

  if (name.startsWith("TreeDrop")) {
    const entity = name.slice("TreeDrop".length)
    return `${entity} 树形下拉选项`
  }

  if (name.endsWith("Params")) {
    return `${name} 请求参数`
  }

  return ""
}

/** 推断字段注释 */
function inferPropertyDescription(propName, propConfig, parentSchemaName) {
  if (propConfig?.description) return sanitizeJSDoc(propConfig.description)
  if (COMMON_PROP_DESCRIPTIONS[propName]) return COMMON_PROP_DESCRIPTIONS[propName]

  if (propName === "id" && parentSchemaName.endsWith("Params")) {
    if (parentSchemaName.startsWith("BatchDel")) return "待删除 ID 列表"
    if (parentSchemaName.startsWith("DeleteOne") || parentSchemaName.startsWith("GetDetailById")) {
      return "主键 ID"
    }
  }

  if (propName === "dimId" && parentSchemaName.includes("Dropdown")) return "维度 ID"
  if (propName === "modelTypeId") return "模型类型 ID"

  return ""
}

/** 格式化 interface / type 顶部 JSDoc */
function formatInterfaceJSDoc(description) {
  if (!description) return ""
  return `/** ${sanitizeJSDoc(description)} */\n`
}

/** 格式化字段行尾 JSDoc */
function formatPropComment(description) {
  if (!description) return ""
  return ` /** ${description} */`
}

/** 生成单个 interface / type 定义 */
function generateTypeDefinition(name, schema, schemas) {
  if (!schema) return ""

  if (schema.enum) {
    const desc = inferSchemaDescription(name, schema) || `${name} 枚举`
    return `${formatInterfaceJSDoc(desc)}export type ${name} = ${formatEnumUnion(schema.enum)}`
  }

  const desc = inferSchemaDescription(name, schema)
  const required = new Set(schema.required || [])
  const lines = [`${formatInterfaceJSDoc(desc)}export interface ${name} {`]

  if (schema.properties) {
    for (const [propName, propConfig] of Object.entries(schema.properties)) {
      const optional = required.has(propName) ? "" : "?"
      const propType = resolveTsType(propConfig, schemas)
      const propDesc = inferPropertyDescription(propName, propConfig, name)
      lines.push(`  ${propName}${optional}: ${propType};${formatPropComment(propDesc)}`)
    }
  }

  lines.push("}")
  return lines.join("\n")
}

/** 生成模块 types 文件内容 */
function generateTypesFileContent(schemaNames, paramsInterfaces, schemas) {
  const parts = ["/** Auto-generated — do not edit manually */", ""]

  const sortedNames = [...schemaNames].sort()
  sortedNames.forEach((name) => {
    const def = generateTypeDefinition(name, schemas[name], schemas)
    if (def) parts.push(def, "")
  })

  paramsInterfaces.forEach(({ code }) => {
    parts.push(code, "")
  })

  return `${parts.join("\n").trimEnd()}\n`
}

/**
 * 从 URL 提取动作名
 */
function getActionNameFromUrl(url, method) {
  const segments = url.split("/").filter(Boolean).filter(seg => !isPathParamSegment(seg))
  let actionName = toCamelCase(segments.pop() || "request")

  if (/\{[^}]+\}/.test(url)) {
    const methodPrefix = method.toLowerCase()
    actionName = methodPrefix + actionName.charAt(0).toUpperCase() + actionName.slice(1)
  }

  return actionName.replace(/[^\w$]/g, "") || "request"
}

/** 构建带路径参数的 URL 字符串 */
function buildRequestUrl(url, pathParams) {
  let result = url.replace(URL_PREFIX_REPLACE.from, URL_PREFIX_REPLACE.to)
  pathParams.forEach((param) => {
    result = result.replace(`{${param.name}}`, `\${${param.name}}`)
  })
  return result
}

/** 生成 Query 参数接口 */
function generateParamsInterface(funcName, queryParams, schemas, summary) {
  const interfaceName = `${funcName.charAt(0).toUpperCase() + funcName.slice(1)}Params`
  const interfaceDesc = summary ? `${summary} - 请求参数` : `${interfaceName} 请求参数`
  const required = new Set()
  const lines = [`${formatInterfaceJSDoc(interfaceDesc)}export interface ${interfaceName} {`]

  queryParams.forEach((param) => {
    if (param.required) required.add(param.name)
    const propType = resolveTsType(param.schema, schemas)
    const optional = param.required ? "" : "?"
    const propDesc = inferPropertyDescription(
      param.name,
      { description: param.description },
      interfaceName
    )
    lines.push(`  ${param.name}${optional}: ${propType};${formatPropComment(propDesc)}`)
  })

  lines.push("}")
  return { name: interfaceName, code: lines.join("\n") }
}

/**
 * 生成单个 API 函数的代码
 */
function generateFunctionCode(url, method, details, moduleName, schemas, moduleContext) {
  const summary = details.summary || "无描述"
  const actionName = getActionNameFromUrl(url, method)
  const moduleSuffix = kebabToPascalCase(moduleName)

  let funcName = actionName
  if (!actionName.toLowerCase().includes(moduleSuffix.toLowerCase())) {
    funcName = actionName + moduleSuffix
  }

  const pathParams = (details.parameters || []).filter(p => p.in === "path")
  const queryParams = (details.parameters || []).filter(p => p.in === "query")
  const bodyType = resolveRequestBodyType(details.requestBody, schemas)
  const hasBodyParams = hasRequestBodyParam(details.requestBody, schemas)

  const requestSchema = extractRequestBodySchema(details.requestBody)
  if (requestSchema) collectSchemaRefs(requestSchema, schemas, moduleContext.schemaNames)

  const successResp = details.responses?.["200"] || details.responses?.["201"]
  const responseSchema
    = successResp?.content?.["application/json"]?.schema
      || successResp?.content?.["*/*"]?.schema
  const { tsType: returnType, refName: returnRef } = unwrapResponseType(
    responseSchema,
    schemas
  )
  if (returnRef && !isResultWrapper(returnRef)) {
    collectSchemaRefs({ $ref: `#/components/schemas/${returnRef}` }, schemas, moduleContext.schemaNames)
  }

  const args = []
  const usedTypes = moduleContext.usedTypes

  pathParams.forEach((param) => {
    const paramType = resolveTsType(param.schema, schemas)
    args.push(`${param.name}: ${paramType}`)
    collectSchemaRefs(param.schema, schemas, moduleContext.schemaNames)
  })

  if (hasBodyParams && bodyType) {
    args.push(`data: ${bodyType}`)
    const baseBodyType = bodyType.replace("[]", "")
    if (/^[A-Z]/.test(baseBodyType) && !baseBodyType.includes("|") && !baseBodyType.includes("Record")) {
      usedTypes.add(baseBodyType)
    }
  }

  let paramsInterfaceName = null
  if (queryParams.length > 0) {
    const paramsDef = generateParamsInterface(funcName, queryParams, schemas, summary)
    paramsInterfaceName = paramsDef.name
    moduleContext.paramsInterfaces.set(paramsInterfaceName, paramsDef.code)
    usedTypes.add(paramsInterfaceName)
    queryParams.forEach(p => collectSchemaRefs(p.schema, schemas, moduleContext.schemaNames))
    args.push(`params: ${paramsInterfaceName}`)
  }

  if (returnType && returnType !== "unknown" && returnType !== "void") {
    if (returnRef && !isResultWrapper(returnRef)) {
      usedTypes.add(returnRef)
    } else if (!returnType.includes("|") && !returnType.includes("Record")) {
      const baseType = returnType.replace("[]", "")
      if (/^[A-Z]/.test(baseType)) usedTypes.add(baseType)
    }
  }

  const requestUrl = buildRequestUrl(url, pathParams)
  const requestProps = [`    url: \`${requestUrl}\``, `    method: "${method.toUpperCase()}"`]

  if (hasBodyParams && bodyType) requestProps.push("    data")
  if (queryParams.length > 0) requestProps.push("    params")

  const returnTypeAnnotation = returnType === "void" ? "void" : returnType

  return `
// ${summary}
export function ${funcName}(${args.join(", ")}): Promise<${returnTypeAnnotation}> {
  return request<${returnTypeAnnotation}>({
${requestProps.join(",\n")}
  })
}`
}

/**
 * 主逻辑
 */
async function main() {
  const { schema, version } = await loadSwagger()
  const schemas = schema.components?.schemas || {}
  const modules = {}

  Object.keys(schema.paths || {}).forEach((reqUrl) => {
    const methods = schema.paths[reqUrl]
    const moduleName = getModuleNameFromUrl(reqUrl)

    if (!modules[moduleName]) {
      modules[moduleName] = {
        functions: [],
        schemaNames: new Set(),
        paramsInterfaces: new Map(),
        usedTypes: new Set()
      }
    }

    const moduleContext = modules[moduleName]

    Object.keys(methods).forEach((method) => {
      if (!HTTP_METHODS.has(method.toLowerCase())) return

      const details = methods[method]
      collectRefsFromOperation(details, schemas, moduleContext.schemaNames)

      const code = generateFunctionCode(
        reqUrl,
        method,
        details,
        moduleName,
        schemas,
        moduleContext
      )
      moduleContext.functions.push(code)
    })
  })

  ensureDir(OUTPUT_DIR)
  ensureDir(TYPES_DIR)

  /** schema 名 -> 实际写入的模块文件名（供 enums 引用） */
  const schemaModuleMap = new Map()

  Object.keys(modules).forEach((moduleName) => {
    const mod = modules[moduleName]
    const typesFilePath = path.join(TYPES_DIR, `${moduleName}.ts`)
    const apiFilePath = path.join(OUTPUT_DIR, `${moduleName}.ts`)

    if (shouldSkipHandwrittenModule(moduleName)) {
      console.warn(`⏭️  跳过手写模块: src/common/apis/${moduleName}（无 <generated> 标记）`)
      return
    }

    mod.schemaNames.forEach((schemaName) => {
      if (!schemaModuleMap.has(schemaName)) {
        schemaModuleMap.set(schemaName, moduleName)
      }
    })

    const paramsInterfaces = [...mod.paramsInterfaces.entries()].map(([name, code]) => ({
      name,
      code
    }))

    const typesContent = generateTypesFileContent(
      mod.schemaNames,
      paramsInterfaces,
      schemas
    )
    fs.writeFileSync(typesFilePath, typesContent, "utf-8")
    console.log(`✅ 已生成类型: src/common/apis/types/${moduleName}.ts`)

    const typeImports = [...mod.usedTypes].sort()
    const apiContent = mergeModuleFile(apiFilePath, mod.functions, typeImports, moduleName)
    fs.writeFileSync(apiFilePath, apiContent, "utf-8")
    console.log(`✅ 已生成接口: src/common/apis/${moduleName}.ts`)
  })

  writeEnumsFile(schemas, schemaModuleMap)

  console.log(`🎉 全部生成完毕！（文档版本: ${version}）`)
}

main().catch((err) => {
  console.error(`❌ ${err.message}`)
  process.exit(1)
})
