# AGENTS.md

## 目标

本项目优先保证：

- 代码简单、容易阅读、容易维护。
- 修改范围小、少消耗 Token。
- AI 生成的代码能够直接符合项目规范。
- 不为了复用、扩展性或未来需求增加当前不需要的抽象。

技术栈：Vue 3 + Vite + TypeScript + Element Plus + Pinia + Vue Router + UnoCSS。

## 开始前

1. 先读本文件。
2. 需要了解项目已有能力时读 `docs/PROJECT_MAP.md`。
3. 页面任务先读 `docs/PAGE_PATTERNS.md`，只选 1 个最相似页面作为主要参考。
4. 使用或修改通用组件前读 `docs/COMPONENTS.md`。
5. 新增 API、路由、Store、图标时读取对应 Skill。
6. 只阅读目标文件和直接依赖，不默认扫描整个仓库。

对应 Skill：

- 页面 / CRUD：`.agents/skills/v3-generate-page/SKILL.md`
- API / Swagger：`.agents/skills/v3-connect-api/SKILL.md`
- Router / Menu：`.agents/skills/v3-upsert-route/SKILL.md`
- Pinia：`.agents/skills/v3-upsert-store/SKILL.md`
- Icons：`.agents/skills/v3-use-icons/SKILL.md`

## 核心原则

- 用最少的代码完成当前需求。
- 不添加用户未要求的功能。
- 不为未来可能出现的需求提前设计。
- 优先使用 Vue / Vue Router / Pinia / Element Plus 原生能力。
- 优先修改已有文件，不因为小需求创建大量新文件。
- 普通需求尽量控制在 1～3 个主要文件内完成。
- 同一逻辑实际重复 3 次后再考虑抽象。
- 代码关系优先显式表达，避免隐藏依赖和跨层跳转。
- 修改现有代码时匹配当前项目风格，不顺手重构无关代码。

每一行修改都应该能够追溯到当前需求。

## AI 执行规则

编码前：

- 新增页面、组件、API、Store、Composable、Util 前，先确认项目是否已有对应能力。
- 页面优先按 `PAGE_PATTERNS.md` 选择参考；找不到再搜索仓库。
- 只参考 1 套主要实现，不同时拼接多个页面风格。
- 已有能力可以完成时，不创建第二套实现。

编码时：

- 信息足够时直接实现，不为了非关键细节反复提问。
- 小范围歧义优先采用项目现有默认写法。
- 页面局部状态留在页面；跨页面共享才考虑 Pinia。
- 简单 CRUD 优先单文件，不机械拆组件。
- 不因为“更高级”“以后可能用”增加抽象。

完成前：

- 删除本次修改产生的未使用 import、变量、函数。
- 不主动清理修改前已经存在、且与当前需求无关的代码。
- 检查 git diff，确认没有无关格式化、顺手重构和额外功能。
- 执行与本次修改相关的 ESLint、TypeScript、测试和构建检查。

## 目录边界

- `src/pages`：业务页面。
- `src/common/components`：跨页面复用的通用组件。
- `src/common/apis`：请求函数与手写适配层。
- `src/common/apis/types`：Swagger / 后端契约类型。
- `src/common/composables`：真正具有跨页面复用价值的组合逻辑。
- `src/common/utils`：无业务状态的纯工具函数。
- `src/common/constants`：角色、缓存 key、生成枚举等常量。
- `src/pinia/stores`：跨页面共享状态。
- `src/router`：路由配置与守卫。
- `src/layouts`：后台壳层布局。

页面私有代码优先放页面目录，不要提前提升为全局能力。

已有能力速查：

- Composables：`docs/COMPOSABLES.md`
- Utils：`docs/UTILS.md`
- Components：`docs/COMPONENTS.md`
- 页面范式：`docs/PAGE_PATTERNS.md`
- API 生成：`docs/API_GENERATE.md`
- 代码样式：`docs/CODE_STYLE.md`

## Vue / TypeScript

- 统一使用 `<script setup lang="ts">`。
- 派生状态使用 `computed`；静态配置不要为了形式写成 `computed`。
- 能用普通函数解决就不要创建 composable。
- 父子通信优先 props / emit；跨页面共享状态再考虑 Pinia。
- 保持 TypeScript strict。
- 业务代码禁止使用 `any` 逃避类型设计。
- 类型导入使用 `import type`。
- 对象结构优先 `interface`；联合类型和工具类型使用 `type`。
- 不使用无意义的复杂泛型。
- 不为一个简单类型单独创建文件。
- 后端契约 DTO 直接从 `src/common/apis/types` 引用。

## 表单与表格

- 普通查询、编辑、CRUD 表单直接使用 Element Plus。
- 不为了少写模板改成 Schema Form。
- 表单字段与后端 payload 一致时直接提交普通对象。
- 普通列表可以使用 `CustomTable`。
- 特殊单元格使用 Vue slot，不把业务点击逻辑放进 columns。
- 复杂表格需求允许直接使用 `el-table`，不要为了一个页面无限扩展 `CustomTable`。

详细边界见 `docs/COMPONENTS.md`。

## API

- 页面只能依赖 API，API 禁止反向依赖页面。
- 页面不要直接创建 Axios 实例。
- `request<T>()` 直接返回业务 `data`。
- request 层负责 Token、响应解包和通用错误处理。
- 通用错误已由 request 层提示时，页面默认不重复 `catch + ElMessage.error`。
- 页面只处理成功提示、确认交互和真正需要的业务特殊错误。

## Pinia

- 只有跨页面共享的状态才进入 Pinia。
- 页面局部查询、表单、Dialog、loading 留在页面。
- 使用 Setup Store。
- 只有确实需要 setup 外访问时才增加 outside helper。
- 持久化只有需求明确需要时才添加。

## 注释

生成代码时默认补充适量“理解型注释”。

应该解释：

- 为什么这样做。
- 关键业务流程和边界条件。
- 数据转换 / 兼容逻辑。
- watch、生命周期、守卫、缓存等副作用原因。
- workaround 的背景。

不要逐行翻译代码，不给显而易见的赋值和函数调用写注释。

示例：

```ts
// 查询条件变化后回到第一页，避免旧页码在新结果集中不存在。
pagination.pageCurrent = 1
await getTableData()
```

普通清晰函数通常只需要 0～2 条关键注释。

## 自动生成区域

以下内容主要由 API Generator 管理：

```text
src/common/apis/types/**
src/common/constants/enums.ts
src/common/constants/options.ts
src/common/constants/registry.ts
src/common/apis/docs/api.md
```

- 不要把生成文件里的结构当作普通业务架构范例。
- `constants/registry.ts` 只用于聚合生成的 Enum / Options；普通业务仍禁止新增 Registry 模式。
- 需要调整生成结果时优先修改 `script/generate-api.cjs` / `script/doc.cjs`。
- 带明确自定义保留区的生成文件，只在保留区内手写扩展。

## 样式

- UnoCSS：布局、间距、尺寸、简单样式。
- SCSS：复杂选择器、伪元素、动画和 Element Plus 覆盖。
- 同一个简单样式不要同时使用 UnoCSS 和 SCSS。
- 不主动增加复杂动画、渐变、暗黑模式和无业务价值的装饰。

## ESLint 与代码质量

`eslint.config.js` 是代码风格机器事实来源。

当前关键约定：

- 双引号。
- 无分号。
- 无尾逗号。
- 大括号 1tbs。
- 允许短 if 单行。
- 不强制 import 排序。
- 没有 Prettier，不要新增 Prettier 配置。

不得为了通过检查而：

- 关闭或降低 ESLint 规则。
- 随意增加 `eslint-disable`。
- 降低 TypeScript 类型检查强度。
- 使用 `any`、无意义断言或空 catch 掩盖错误。

详细样式见 `docs/CODE_STYLE.md`。

## 禁止默认生成

除非需求明确需要，否则不要新增：

- Service / Repository。
- Factory / Strategy / Registry。
- Event Bus。
- Manager / Adapter / Mapper 等仅转发中间层。
- 全局 Store / 全局 Composable / Base Component。
- Schema Form / Schema Table / Renderer System。
- 为未来功能预留的字段、参数、接口和空实现。

## 验证

常用命令：

```bash
pnpm lint:fix
pnpm typecheck
pnpm check
pnpm test
pnpm build
```

最低要求：

1. 先对本次新增和修改文件执行 ESLint 自动修复。
2. 再执行 TypeScript 类型检查。
3. 修复本次修改引入的 lint / typecheck 错误。
4. 修改 Utils、Router helper、权限计算、复杂纯逻辑时优先补测试。
5. 涉及构建配置或完整项目行为时执行 `pnpm build`。
6. 不因为历史问题批量修改与当前任务无关的文件。

“代码写完”不等于任务完成；检查通过且 diff 只包含当前需求，才算完成。
