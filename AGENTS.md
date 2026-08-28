# AGENTS.md

## 目标

本项目优先保证：代码简单、容易阅读、容易维护、修改范围小、少消耗 Token。
不要为了复用、扩展性或未来需求增加当前不需要的抽象。

## 技术栈

Vue 3 + Vite + TypeScript + Element Plus + Pinia + Vue Router + UnoCSS。

## 基本原则

- 用最少的代码完成当前需求。
- 不添加用户未要求的功能。
- 不为未来可能出现的需求提前设计。
- 优先使用 Vue / Vue Router / Pinia / Element Plus 原生能力。
- 优先修改已有文件，不因为小需求创建大量新文件。
- 普通业务逻辑保持直接，不引入 Factory / Strategy / Registry / Repository / EventBus 等模式。
- 同一逻辑实际重复 3 次后再考虑抽象。
- 代码关系优先显式表达，避免隐藏依赖和跨层跳转。

## AI 执行规则

开始编码前：

1. 先阅读目标文件和直接依赖，不默认扫描整个仓库。
2. 新增页面、组件、API、Store、Composable、工具函数前，先搜索是否已有相似实现。
3. 只参考 1 个最相似、当前仍在使用的实现，不同时模仿多个风格。
4. 已有能力能解决时优先复用，不创建第二套实现。

编码时：

- 普通需求尽量控制在 1～3 个文件内完成。
- 信息足够时直接实现，不为了非关键细节反复提问。
- 需求存在小范围歧义时采用项目现有默认写法。
- 修改范围保持最小，不顺手重构无关代码。
- 不添加无意义注释；注释只解释“为什么”，不重复代码行为。

完成任务前：

1. 先对本次新增和修改的文件执行 ESLint 自动修复。
2. 再执行 TypeScript 类型检查。
3. 修复本次修改引入的 lint / typecheck 错误。
4. 需要验证完整项目时执行 `pnpm check`；涉及构建行为时再执行 `pnpm build`。
5. 不因为历史问题批量修改与当前任务无关的文件。

## ESLint 与代码质量

- `eslint.config.js` 是代码风格与 lint 规则的唯一事实来源，AGENTS.md 不重复维护具体格式规则。
- 不手动猜测引号、换行、排序等可自动修复规则，优先交给 ESLint。
- 不得为了让代码通过检查而关闭或降低 ESLint 规则。
- 不得随意新增 `eslint-disable`；确有必要时必须限定到最小范围并说明原因。
- 不得修改 TypeScript 配置降低类型检查强度来规避错误。
- 不得使用 `any`、强制类型断言或空 catch 仅为了让检查通过。

## 目录

- `src/pages`：业务页面。
- `src/common/components`：跨页面复用的通用组件。
- `src/common/apis`：请求函数与手写适配层。
- `src/common/apis/types`：Swagger / 后端契约类型（勿手改生成区）。
- `src/pinia/stores`：跨页面共享状态。
- `src/common/composables`：通用组合逻辑（速查见 `docs/COMPOSABLES.md`）。
- `src/common/utils`：无业务状态的纯工具函数（速查见 `docs/UTILS.md`）。
- `src/router`：路由配置与守卫。
- `src/layouts`：后台壳层布局。

页面私有代码优先放在页面目录，不要提前提升为全局能力。
后端契约类型直接从 `src/common/apis/types` 引用；不要创建只做 re-export 的页面 `types/index.ts`。
页面确有额外 UI 类型时优先放同目录 `types.ts`，简单类型可直接留在页面文件中。

## Vue

- 统一使用 `<script setup lang="ts">`。
- 简单 CRUD 优先保持单文件，不机械拆组件。
- 只有可复用、独立交互或明显独立 UI 区域才拆组件。
- 派生状态使用 `computed`；静态配置不要为了形式写成 `computed`。
- 能用普通函数解决就不要创建 composable。
- 能用 Vue slot 解决就不要创建 renderer / registry 系统。
- 父子通信优先 props / emit；跨页面共享状态再考虑 Pinia。

## TypeScript

- 保持 strict。
- 业务代码禁止 `any`；第三方类型确实无法表达时仅允许局部使用，禁止扩散。
- 类型导入使用 `import type`。
- 对象结构优先 `interface`；联合类型和工具类型使用 `type`；不用 `I` 前缀。
- 不使用无意义的复杂泛型。
- 不为一个简单类型单独创建文件。
- 契约 DTO 放 `src/common/apis/types`，页面类型禁止被 API 层反向引用。

## 表单

- 普通查询、编辑、CRUD 表单优先直接使用 Element Plus。
- `CustomForm` 只用于明确需要 schema 驱动、动态字段或多处复用同一表单配置的场景。
- 不为了减少几行模板代码把普通表单改成 schema 配置。
- 表单字段与后端 payload 一致时直接提交表单对象。
- 只有需要字段转换时才额外创建 submit payload。
- 简单一级对象复制使用 `{ ...obj }`，不默认使用 deep clone。

## 表格

- 普通列表可以使用 `CustomTable` 处理 columns / loading / pagination。
- `columns` 只描述普通列属性；标签、按钮、链接、复杂展示等特殊单元格使用 Vue slot。
- 不把业务点击逻辑放进 columns 配置。
- 不新增 column registry / renderer plugin。

## API

- 页面只能依赖 API，API 禁止反向依赖页面。
- request 层负责 Token、响应解包和通用错误处理。
- 通用错误已由 request 层提示时，页面默认不重复 catch + message。
- 页面只处理当前业务真正需要的成功提示、确认交互和特殊错误分支。

## Pinia

- 只有跨页面共享的状态才进入 Pinia。
- 页面局部状态留在页面。
- 使用 Setup Store。
- 只有确实需要 setup 外访问（如路由守卫、拦截器）时才创建 `useXxxStoreOutside()`。
- 持久化只有当前需求明确需要时才添加。

## 样式

- UnoCSS 负责布局、间距、尺寸和简单样式（统一 class 模式）。
- SCSS 只处理复杂样式、伪元素、动画和 Element Plus 覆盖。
- 同一个简单样式不要同时用 UnoCSS 和 SCSS 实现。
- 不主动增加复杂动画、渐变、装饰和过度视觉设计。

## 抽象规则

只有满足以下条件之一才考虑抽象：

- 相同逻辑已经实际出现至少 3 次。
- 已明确存在多个调用方，并且抽象后明显更容易理解。
- 单个文件职责已经明显混杂，拆分边界清晰。

禁止因为以下理由抽象：

- “以后可能会用”。
- “这样更高级”。
- “更符合某种设计模式”。
- “为了扩展性先预留”。

## 禁止默认生成

除非需求明确需要，否则不要新增：

- Service 层 / Repository 层 / Factory / Strategy / Registry / Event Bus
- 全局 Store / 全局 Composable / 通用 Base Component
- Adapter / Mapper / Manager 等仅用于转发的中间层
- 为未来功能预留的字段、参数、接口或空实现

## 验证

常用命令：

```bash
pnpm lint:fix
pnpm typecheck
pnpm check
pnpm test
pnpm build
```

“代码写完”不等于任务完成；至少通过与本次修改相关的 ESLint 和 TypeScript 检查后才算完成。
