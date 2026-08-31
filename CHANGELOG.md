# Changelog

所有重要变更记录在此文件。

## Unreleased

### Changed

- 强化 AI 开发约束：最小修改、先找相似实现、避免提前抽象，并以 ESLint / TypeScript / Test / Build 作为质量门槛。
- 普通 CRUD 默认使用 Element Plus + `CustomTable` + slot；`CustomForm` 仅用于明确的 schema / 动态表单。
- `CustomForm` 删除运行时字段 registry，固定内置字段通过直接映射管理，额外字段使用 slot。
- HTTP 请求层直接返回业务 `data`，手写 API 与 Swagger 生成 API 使用一致的 `request<T>()` 契约。
- 布局功能改为 `src/layouts/config.ts` 静态配置，删除运行时 Settings Drawer / Settings Store。
- 初始化脚本由 PowerShell 改为跨平台 Node.js 脚本。
- 开发代理变量改为仅构建端读取的 `DEV_PROXY_TARGET`，`VITE_*` 只用于浏览器公开配置。
- 简化 Vite、TypeScript、Router、Pinia、Composables、Utils 和 Screenfull 等模板基础设施。

### Removed

- 未使用的插件安装层、`v-permission`、Settings 相关组件与 Store。
- 未使用的工具函数、类型中间层、CustomForm registry 和部分冗余依赖。

### Validation

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## 0.1.0

### Added

- Vue 3 + Vite + TypeScript 管理后台基础模板。
- Element Plus、Pinia、Vue Router、UnoCSS、Sass。
- Mock / 真实认证适配层。
- 动态路由与角色 / 权限过滤。
- `CustomTable`、`CustomForm`、`CustomDialog` 等通用组件。
- Swagger / OpenAPI API 与类型生成脚本。
- 项目初始化脚本。

### Notes

- `0.x` 阶段允许较积极地调整模板结构；破坏性改动应在升级文档中给出迁移步骤。
