# Changelog

本文件记录 **vue-admin-template** 的版本变更与迁移要点。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。  
升级操作说明见 [docs/UPGRADE.md](./docs/UPGRADE.md)。

## [Unreleased]

### Added

- （预留）后续版本在此追加

### Changed

### Fixed

### Migration

- 无

---

## [0.1.0] - 2026-08-04

首个可独立复制的管理后台模板版本，由 dataSafe 业务项目按《Vue 管理后台模板抽取方案》净化而来。

### Added

- 应用壳：Vue 3 + Vite 7 + TypeScript + Element Plus + Pinia + Vue Router + UnoCSS
- 布局能力：侧边栏、顶栏、标签页、主题 / 灰色 / 色弱、移动端自适应
- 权限：动态路由、`admin` / `user` 演示角色、按钮级 `permissions` 示例
- 认证适配层 `src/common/apis/auth.ts`（`AuthApi` + 本地 Mock，可切换真实后端）
- Axios 封装：baseURL、Bearer Token、统一错误与 401 登出
- 通用组件：CustomTable、CustomForm、CustomDialog、CustomPagination、Screenfull
- 示例页：首页 Dashboard、文章 CRUD（`src/pages/demo/article`）
- 工程脚本：`pnpm run init` 项目命名初始化
- Swagger 可选能力：`pnpm api:generate` / `pnpm api:doc`（`script/load-swagger.cjs`、`generate-api.cjs`、`doc.cjs`）
- 文档：`README.md`、`AGENTS.md`、`docs/UPGRADE.md`

### Changed

- 相对 dataSafe：路由收敛为登录 / 首页 / 错误页 / demo，移除 task、resource、system 业务域
- Token 请求头由业务侧 `X-Token` 改为更通用的 `Authorization: Bearer`
- 用户摘要角色改为直接使用 `roles` / `permissions`，不再依赖 `sign` → 角色映射
- Vite 代理目标改为环境变量 `VITE_PROXY_TARGET`，默认 `127.0.0.1`
- 依赖精简：移除 mqtt、echarts、mind-elixir、spark-md5、js-md5 等业务向依赖

### Removed

- 业务页面与业务 API / 类型契约
- MQTT、图片服务、内网 IP 等环境专属配置
- ChunkUpload、TaskLogDialog、RelationMindMap 等业务绑定组件

### Migration

从 **dataSafe 业务仓** 迁到本模板 `0.1.0`：

1. 以本目录为新仓库起点，勿在原仓批量删除业务代码后当模板用。
2. 将业务页面迁入 `src/pages/<domain>`，在 `dynamicRoutes` 注册并配置 `roles` / `permissions`。
3. 实现或替换 `src/common/apis/auth.ts` 中的 `realAuthApi`；关闭 Mock：`VITE_USE_MOCK=false`。
4. 若后端仍用 `X-Token` 或 `code` 约定不同，在 `src/http/axios.ts` 适配，不要改回写死内网地址。
5. 配置 `SWAGGER_URL` 后执行 `pnpm api:generate`；手写模块与生成模块分文件存放。
6. 执行 `pnpm run init -- -ProjectTitle <标题>` 更新包名、标题与缓存 Key。
7. 按 `docs/UPGRADE.md` 验收清单回归。

从 **尚无模板基线的空项目** 接入：直接复制本模板并按 `README.md` 冷启动即可，无额外迁移步骤。

---

[Unreleased]: https://github.com/example/vue-admin-template/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/example/vue-admin-template/releases/tag/v0.1.0
