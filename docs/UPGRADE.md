# 模板版本升级说明

本文说明如何把基于本模板创建的业务项目，升级到更新的模板版本。

模板版本号见 `package.json` 的 `version`，变更明细见 [CHANGELOG.md](../CHANGELOG.md)。

## 版本约定

采用语义化版本 `MAJOR.MINOR.PATCH`：

| 级别  | 含义                                                   | 示例              |
| ----- | ------------------------------------------------------ | ----------------- |
| MAJOR | 不兼容变更（目录约定、认证契约、路由/权限模型等）      | `0.x` → `1.0`     |
| MINOR | 向后兼容的能力增强（新组件、Swagger 脚本改进、示例页） | `0.1` → `0.2`     |
| PATCH | 缺陷修复、依赖安全补丁、文档修正                       | `0.1.0` → `0.1.1` |

`0.x` 阶段允许更积极的结构调整；升到 `1.0` 后，破坏性变更必须写进迁移日志并给出明确步骤。

## 升级原则

1. **业务与模板分层**：`src/pages/<业务>`、业务 API、业务 Store 属于项目；布局、路由守卫、Axios、通用组件、脚本属于模板核心。
2. **不做自动合并**：首版不提供 CLI / 自动同步。通用修复通过 diff 对照或手工 cherry-pick。
3. **先读再合**：每次升级先看目标版本及中间版本的 CHANGELOG「迁移」小节，再动手改文件。
4. **合完必验**：至少跑通 `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build`，并人工点一遍登录、动态路由刷新、CRUD 示例或等价业务页。

## 推荐升级流程

### 1. 确认当前基线

在业务仓库记录：

- 当初基于的模板版本（建议在 README 或 `docs/TEMPLATE_BASE.md` 写明，例如 `vue-admin-template@0.1.0`）
- 曾修改过的模板核心文件清单（Axios、auth、layouts、router 守卫等）

### 2. 取得目标模板

```bash
# 示例：拿到新版本模板源码（路径按实际仓库调整）
# git clone <template-repo> vue-admin-template
# cd vue-admin-template && git checkout v0.2.0
```

### 3. 对照变更

按 [CHANGELOG.md](../CHANGELOG.md) 从当前版本逐条看到目标版本，区分：

| 类型                         | 处理方式                                                  |
| ---------------------------- | --------------------------------------------------------- |
| 仅模板核心修复               | 把对应文件 diff 合入业务仓库                              |
| 新增可选能力（如脚本、示例） | 按需复制，不强制覆盖业务代码                              |
| 破坏性变更                   | 严格按该版本「迁移」步骤改业务代码                        |
| 依赖升级                     | 更新 `package.json` 后重新 `pnpm i`，关注 peer 与构建告警 |

### 4. 安全合并顺序（建议）

1. 依赖与工程配置：`package.json`、`vite.config.ts`、`tsconfig.json`、`uno.config.ts`、ESLint
2. 运行时核心：`src/http`、`src/router/guard.ts`、`src/pinia/stores/user.ts`、`src/common/apis/auth.ts`
3. 通用组件与工具：`src/common/components`、`composables`、`utils`
4. 布局与样式：`src/layouts`、`src/common/assets/styles`
5. 脚本与文档：`script/*`、`docs/*`、`AGENTS.md`

**不要覆盖**：业务页面、业务 API、业务路由表中的业务节点、环境专属 `.env.*` 真实地址。

### 5. 验收清单

- [ ] Mock / 真实登录均可按当前环境完成
- [ ] 刷新动态路由页面不出现 404
- [ ] 角色 / 按钮权限符合预期
- [ ] 深色模式、标签页、侧边栏正常
- [ ] 403 / 404 / 退出 / Token 失效流程正常
- [ ] 若使用 Swagger：`pnpm api:generate` 仍可用
- [ ] 全文无误把模板占位配置盖成生产密钥或内网地址提交进库

## 常见冲突与处理

### 认证适配层被改过

保留业务仓库的 `realAuthApi` 实现；只合入模板对 `AuthApi` 契约、Mock 开关、错误处理的增量。契约字段变更时，按 CHANGELOG 迁移映射表改 `setProfile` / 登录页。

### Axios 拦截器被改过

优先保留业务错误码与 Header 约定；合入模板的超时、FormData、401 登出等通用修复时，用三方合并，避免整文件覆盖。

### 路由表混有业务节点

只同步 `constantRoutes` 中的登录 / 错误 / redirect 等壳路由，以及守卫逻辑；业务 `dynamicRoutes` 节点留在业务仓库维护。

### Swagger 生成文件

`src/common/apis/types/*` 与生成区内的函数以重新 `pnpm api:generate` 为准。自定义逻辑放在生成区外，或独立手写模块（如 `auth.ts`）。

### `pnpm run init` 与升级

初始化脚本用于新项目命名，**不是**升级工具。已落地项目不要靠反复 `init` 追模板版本。

## 从 dataSafe 业务仓迁到本模板

若项目最初不是从本模板复制，而是从 `dataSafe` 等业务仓剥离：

1. 以本模板 `0.1.0` 为新壳，业务页面按域迁入 `src/pages`
2. 认证改为 `AuthApi` 适配层，去掉业务专属错误码硬编码（或收敛到适配层）
3. 环境变量去掉 MQTT / 图片内网地址等；代理目标改为 `DEV_PROXY_TARGET`
4. 用 Swagger 重新生成 API，手写接口与生成模块分离
5. 对照本模板 demo CRUD 校验 CustomTable / Form / Dialog 用法

详细差异以当时的抽取方案与本仓库 CHANGELOG `0.1.0` 条目为准。

## 维护者备注（发版时）

发布新模板版本时请同步：

1. 更新 `package.json` → `version`
2. 在 `CHANGELOG.md` 顶部追加版本节（Added / Changed / Fixed / Migration）
3. 若有破坏性变更，在「Migration」写清文件路径与替换示例
4. 打 Git tag：`vX.Y.Z`
5. 如有需要，更新本文件中的验收清单或冲突说明
