# 代码风格（给 AI）

生成代码时按本文写出最终形态，不要依赖事后 `eslint --fix` 才变成规范代码。  
格式规则的机器事实来源仍是 `eslint.config.js`；本文是同一套规则的可读摘要。

本仓库**没有 Prettier**。不要新增 `.prettierrc`，不要用 Prettier 格式化。

## 配置文件怎么分工

| 文件 | 作用 |
| --- | --- |
| `eslint.config.js` | `@antfu/eslint-config` + 本仓库覆盖项；JS/TS/Vue 风格与 lint 的唯一来源 |
| `.editorconfig` | 编辑器层：UTF-8、2 空格、LF、去行尾空格、文件末空行 |
| `.vscode/settings.json` | 保存时 ESLint fix；关闭 Prettier；风格类规则在 IDE 里静音但仍会自动修 |
| `tsconfig.json` | `strict`、路径别名 `@/*` → `src/*`、`@@/*` → `src/common/*` |
| `vite.config.ts` | 同上别名；Vue / UnoCSS / AutoImport / Components |
| `.npmrc` | `pnpm`；`registry.npmmirror.com`；`save-exact = true` |
| `uno.config.ts` | UnoCSS；布局用 class，不要另起一套 CSS 方法论 |
| `AGENTS.md` | 架构与实现原则（不重复罗列每一条 ESLint 规则） |

## 本仓库相对 antfu 默认的覆盖（必须记住）

`@antfu/eslint-config` 默认偏 **单引号、多行尾逗号、stroustrup 大括号、if 必须换行、import 强制排序**。本仓库改成了下面这样：

```text
引号          双引号 "  （不是 antfu 默认的单引号）
分号          不要
缩进          2 空格
尾逗号        禁止       style/comma-dangle: never
大括号        1tbs       if / else / catch 的 } else { 写在同一行
if 换行        关闭       短 if 可以写在同一行
import 排序    关闭       不要按 perfectionist 重排；对齐当前文件已有顺序
console        允许
debugger       允许
```

不要按网上 antfu 示例去写 `'foo'`、`{ a: 1, }`、`} else` 换行。

## 必须写成这样

### 引号、分号、逗号、缩进

```ts
const name = "demo"
const list = [1, 2, 3]
const payload = {
  username: "admin",
  password: "123456"
}

function load() {
  return request<SysUser>({
    url: "sysUser/page",
    method: "post",
    data
  })
}
```

错误：`'demo'`、`const name = "demo";`、`password: "123456",`（对象/数组/参数最后一项带逗号）。

### 大括号：1tbs

```ts
if (ok) {
  submit()
} else {
  reset()
}

try {
  await save()
} catch {
  // 通用错误已由 request 层提示
} finally {
  loading.value = false
}
```

错误（antfu 默认 stroustrup）：

```ts
if (ok) {
  submit()
}
else {
  reset()
}
```

### 短 if 允许同一行

项目关闭了 `antfu/if-newline`，现有代码也是这样写的：

```ts
if (token) config.headers["x-token"] = token
if (data.user) userStore.setProfile(data.user)
if (apiData.code === 0) return apiData.data
```

多语句或需要注释时再用花括号换行。

### Vue SFC 块顺序

固定：`<script>` → `<template>` → `<style>`。

```vue
<script lang="ts" setup>
defineOptions({ name: "DemoUser" })
</script>

<template>
  <div class="p-4">
    <el-button type="primary" @click="handleSearch">查询</el-button>
  </div>
</template>
```

- 用 `<script lang="ts" setup>`（不要 Options API）。
- 组件名用 `defineOptions({ name: "Xxx" })`。
- 不要手写 `import { ref, computed } from "vue"`，不要手写 `useRoute` / `useRouter` / `ElMessage` 的 import（见下方 AutoImport）。

### Vue 模板属性换行

`vue/max-attributes-per-line`：

- **同一行**最多 **5** 个属性。
- **一旦折行**，每行 **1** 个属性。
- 短标签优先单行；不要无故把 2～3 个属性拆成多行。

```vue
<el-button type="primary" @click="handleSearch">查询</el-button>

<el-form
  ref="formRef"
  :model="formData"
  :rules="formRules"
  label-width="80px"
  @submit.prevent
>
```

### 函数写法

顶层用 `function`，不要 `const fn = () => {}`（antfu `top-level-function`）。

```ts
async function getTableData() {
  const res = await pageSysUser({
    pageCurrent: 1,
    pageSize: 10
  })
  tableData.value = res.records ?? []
}

function handleSearch() {
  pagination.value.pageCurrent = 1
  getTableData()
}
```

回调、简单 map 仍可用箭头函数：`list.map(item => item.id)`。

### import

- 类型用 `import type`。
- 业务代码禁止 `any`。
- **不要**按 `perfectionist/sort-imports` 分组重排。
- 顺序对齐当前文件：先 `import type`，再值 import；别名路径用双引号。

```ts
import type { FormInstance } from "element-plus"
import type { SysUser } from "@@/apis/types/sys-user"
import { pageSysUser } from "@@/apis/sys-user"
import CustomTable from "@@/components/CustomTable/index.vue"
import { useUserStore } from "@/pinia/stores/user"
```

路径：

- `@/` → `src/`
- `@@/` → `src/common/`
- 不要写一长串相对路径 `../../../common/...`

### AutoImport / 组件自动注册

`vite.config.ts` 已注入，**不要重复 import**：

- Vue：`ref` `reactive` `computed` `watch` `onMounted` 等
- Vue Router：`useRoute` `useRouter`
- Pinia：`defineStore` `storeToRefs`
- Element Plus 反馈：`ElMessage` `ElMessageBox` `ElNotification` `ElLoading`
- 模板里的 `ElButton` `ElForm` 等（`unplugin-vue-components`）

仍需显式 import：本仓库 API、页面组件、`@@/utils`、`@@/constants`、类型、第三方库（axios 等）。

## antfu 仍生效、生成时也容易写错的规则

未在 `eslint.config.js` 关闭的规则保持 antfu 默认，常见包括：

- 对象 / 数组最后一个元素不要尾逗号（本仓库已强制 never）。
- 比较用 `===` / `!==`。
- 未使用变量、未使用 import 会报错；不要留占位 import。
- `catch` 参数不用就省略：`catch { }`，不要 `catch (e) { }` 后不用 `e`。
- `import type` 与值 import 分开。
- Vue：不要在 `<script setup>` 里同时用默认导出。
- `style/brace-style` 已改为 1tbs，其余 spacing 交给 ESLint；生成时仍应自带合理空格，例如 `if (ok)`、`{ username: "" }`、箭头 `item => item.id`。

`formatters: true` 只作用于 css / html / markdown 等；**Vue/TS 不要用 Prettier 插件格式化**。

忽略目录（不要为了“规范”去改这些文件）：

- `*/skills`、`**/skills/**`
- `docs/VUE3_AI_TEMPLATE_REVIEW.md`
- `src/common/apis/docs/**`（OpenAPI 生成说明）
- `src/common/apis/types/**` 的生成区不要手改契约

## 和风格无关、但生成代码经常一起错的约定

完整原则见 `AGENTS.md`。风格文档只强调和“写出来像不像本仓库”强相关的几条：

- 页面放 `src/pages/<域>/<模块>/index.vue`；普通 CRUD 单文件。
- 请求走 `@@/apis/*` 的函数，不要在页面里 `axios`。
- `request<T>()` 已经是业务 `data`。
- 列表用 `CustomTable`；特殊单元格用 slot，不要把点击逻辑塞进 columns。
- 布局/间距用 UnoCSS class；复杂覆盖才写 `<style scoped lang="scss">`。
- 中文注释只写意图和边界，不翻译每一行。

## 写完后怎么验

只跑本次改过的文件也可以：

```bash
pnpm lint:fix
pnpm typecheck
```

全量：`pnpm check`（`eslint .` + `vue-tsc --noEmit`）。

不得为了过检查而加 `eslint-disable`、改 `eslint.config.js`、放宽 `tsconfig`、或使用 `any` / 乱断言。
