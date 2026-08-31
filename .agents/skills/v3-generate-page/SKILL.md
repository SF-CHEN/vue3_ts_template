---
name: v3-generate-page
description: Create or modify Vue 3 business pages, CRUD pages, list/detail/edit pages in this repository. Use this as the page-level workflow and delegate API, route, store, and icon details to the corresponding v3 skills when those concerns are involved.
---

# Vue3 页面生成

## 目标

按当前项目已有模式完成页面需求，优先简单、直接、少文件，不为了页面生成额外架构。
生成的代码除了能运行，还应让后续开发者能较快理解关键业务流程；对非直观逻辑主动补充适量注释。

## 开始前

1. 阅读根目录 `AGENTS.md`。
2. 搜索 1 个最相似且仍在使用的页面；CRUD 默认参考 `src/pages/demo/article/index.vue`。
3. 只读取目标页面及直接依赖，不默认扫描整个仓库。
4. 先判断本次是否需要：API、路由、Store、图标。

涉及以下内容时同时遵循对应 Skill：

- 接口 / Swagger / 后端联调：`../v3-connect-api/SKILL.md`
- 新增或修改路由：`../v3-upsert-route/SKILL.md`
- 跨页面共享状态：`../v3-upsert-store/SKILL.md`
- 新增图标或路由菜单图标：`../v3-use-icons/SKILL.md`

## 默认页面结构

普通页面优先控制为：

```text
src/pages/<domain>/index.vue
```

只有真实需要时再增加：

```text
src/common/apis/<module>.ts
src/common/apis/types/<module>.ts
src/pages/<domain>/types.ts
src/pinia/stores/<domain>.ts
```

不要为了形式创建 `components/`、`composables/`、`constants/`、`types/index.ts`。

## 实现规则

- 使用 `<script setup lang="ts">`。
- 查询、编辑、CRUD 表单默认直接使用 Element Plus。
- 只有 schema / 动态字段场景才使用 `CustomForm`。
- 普通列表可使用 `CustomTable`；标签、按钮、链接、复杂单元格使用 slot。
- 表单字段与后端 payload 一致时直接提交表单对象。
- 页面局部状态留在页面；跨页面共享才使用 Pinia。
- 通用错误由 request 层处理时，页面不要重复 `catch + ElMessage.error`。
- 成功提示、删除确认、业务特殊错误由页面负责。
- 静态 columns / options / rules 不要无意义包成 `computed`。
- 不新增 Service / Repository / Manager / Registry / Event Bus。

## 注释要求

生成或修改页面代码时，默认在真正需要理解上下文的位置补简短注释，而不是完全不写注释。

优先给这些代码加注释：

- 查询、提交、分页重置、状态切换等关键业务流程中不明显的步骤。
- 权限、缓存、路由状态、生命周期、副作用等非纯 UI 逻辑。
- 页面数据与后端 DTO 之间的转换或兼容处理。
- 特殊边界条件和不能采用常规写法的原因。
- 复杂过滤、排序、映射、计算背后的业务规则。

注释应解释业务意图或 Why，例如：

```ts
function handleSearch() {
  // 查询条件变化后从第一页重新查询，避免保留旧页码导致出现空页。
  pagination.pageCurrent = 1
  getTableData()
}
```

不要给显而易见的代码逐行加注释，例如不要写“设置 loading”“调用接口”“赋值表格数据”这类代码翻译。
一个普通函数通常保持 0～2 条关键注释即可；复杂函数按理解需要增加，但避免让注释比业务代码更长。

## 页面完成顺序

1. 页面结构与交互。
2. 接口调用与类型。
3. 必要的路由。
4. 必要的权限判断。
5. 必要的图标。
6. 检查关键业务逻辑是否有足够的理解型注释。
7. ESLint 自动修复与 TypeScript 检查。

## 完成检查

- 是否只参考了一套现有写法？
- 是否能在 1～3 个主要文件内理解功能？
- 关键业务逻辑是否有适量解释意图/原因的注释？
- 是否存在逐行翻译代码的无意义注释？
- 是否创建了没有真实价值的中间层？
- 是否重复处理了 request 层已经处理的错误？
- 是否为了几行代码提前抽象？
- 是否通过与本次修改相关的 ESLint / TypeScript 检查？
