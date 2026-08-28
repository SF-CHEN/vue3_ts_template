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

## AI 执行规则

- 开始编码前先阅读目标文件和直接依赖，不扫描整个仓库。
- 优先参考 1 个最相似页面，不同时模仿多个实现。
- 普通需求尽量控制在 1～3 个文件内完成。
- 信息足够时直接实现，不为了非关键细节反复提问。
- 需求存在小范围歧义时采用项目现有默认写法。
- 完成后必须检查 TypeScript 类型和 lint。

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

## Vue

- 统一使用 `<script setup lang="ts">`。
- 简单 CRUD 优先保持单文件，不机械拆组件。
- 只有可复用、独立交互或明显独立 UI 区域才拆组件。
- 派生状态使用 `computed`；静态配置不要为了形式写成 `computed`。
- 能用普通函数解决就不要创建 composable。
- 能用 Vue slot 解决就不要创建 renderer / registry 系统。

## TypeScript

- 保持 strict。
- 业务代码禁止 `any`；第三方类型确实无法表达时仅允许局部使用，禁止扩散。
- 类型导入使用 `import type`。
- 对象结构优先 `interface`；联合类型和工具类型使用 `type`；不用 `I` 前缀。
- 不使用无意义的复杂泛型。
- 不为一个简单类型单独创建文件。
- 契约 DTO 放 `src/common/apis/types`，页面类型禁止被 API 层反向引用。

## 表单

- 普通表单优先直接使用 Element Plus，或使用 `CustomForm`。
- 表单字段与后端 payload 一致时直接提交表单对象。
- 只有需要字段转换时才额外创建 submit payload。
- 简单一级对象复制使用 `{ ...obj }`，不默认使用 deep clone。

## 表格

- 普通列表可以使用 `CustomTable` 处理 columns / loading / pagination。
- 特殊单元格优先使用 slot。
- 不新增 column registry / renderer plugin。

## API

- 页面只能依赖 API，API 禁止反向依赖页面。
- request 层负责 Token、响应解包和通用错误处理。
- 通用错误已由 request 层提示时，页面默认不重复 catch + message。

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

## 禁止默认生成

除非需求明确需要，否则不要新增：

- Service 层 / Repository 层 / Factory / Strategy / Registry / Event Bus
- 全局 Store / 全局 Composable / 通用 Base Component
- 为未来功能预留的代码

## 验证

常用命令：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
