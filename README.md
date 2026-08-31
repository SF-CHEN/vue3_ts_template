# Vue Admin Template

可独立复制、初始化的 Vue 3 管理后台模板。

## 技术栈

- Vue 3 + Vite + TypeScript
- Element Plus + Pinia + Vue Router
- UnoCSS + Sass

## 快速开始

```bash
cd template
pnpm i
pnpm run init -- --title 示例后台
pnpm dev
```

`init` 使用 Node.js，可在 Windows、macOS、Linux 运行；默认根据项目文件夹名初始化包名，也兼容旧参数 `-ProjectTitle`。

常用命令：

```bash
pnpm lint               # ESLint 检查
pnpm lint:fix           # ESLint 自动修复
pnpm typecheck          # TypeScript 类型检查
pnpm check              # lint + typecheck
pnpm check:fix          # lint:fix + typecheck
pnpm test
pnpm build
pnpm build:staging
pnpm api:generate       # 从 Swagger 生成 API / 类型
pnpm api:doc            # 生成接口文档摘要
```

## AI 开发约定

项目根目录的 [AGENTS.md](./AGENTS.md) 是 AI 开发的主要规则入口。模板当前用法以 `AGENTS.md`、本 README、源码和 CI 为准，不保留优化前的历史审查文档，避免 AI 读到已经删除的旧架构。

核心原则：

- 先找已有相似实现，再新增代码。
- 普通需求优先控制在 1～3 个文件内完成。
- 普通 CRUD 表单优先直接使用 Element Plus；只有动态/schema 驱动表单再使用 `CustomForm`。
- `CustomForm` 只保留固定内置字段；额外字段使用 slot，不新增运行时字段 registry。
- `CustomTable` 只负责常规列、loading、selection/index 和 pagination；特殊单元格使用 Vue slot。
- 不为未来需求提前抽象，不默认新增 Service / Repository / Factory / Registry / Event Bus 等层。
- `eslint.config.js` 是代码风格的唯一事实来源，不在提示词里重复维护格式规则。
- 代码完成后先执行 ESLint 自动修复，再执行 TypeScript 检查；`pnpm check` 通过后再视为完成。
- 不允许通过关闭 ESLint、降低 TypeScript 严格度或滥用 `any` 来逃避检查。

## Mock 登录

默认开启本地 Mock API（`VITE_USE_MOCK=true`）：

- `admin`：密码任意，管理员权限，示例 CRUD 全部按钮可用。
- `user`：密码任意，普通用户权限，仅部分按钮可用。

## 目录约定

```text
src
├─ common
│  ├─ apis          # 接口（auth 适配层 + Swagger 生成 + 示例）
│  ├─ components    # CustomTable / CustomForm / CustomDialog 等
│  ├─ composables
│  ├─ constants     # 含 Swagger 生成的 enums / options / registry
│  └─ utils
├─ http             # Axios 请求层
├─ layouts          # 后台壳层与静态布局配置
├─ pages
│  ├─ demo          # CRUD 示例
│  ├─ error
│  ├─ home
│  ├─ login
│  └─ redirect
├─ pinia            # 跨页面共享状态
└─ router
script
├─ init-project.mjs
├─ load-swagger.cjs
├─ generate-api.cjs
└─ doc.cjs
```

页面私有逻辑优先留在页面目录；只有明确跨页面复用时才提升到 `common` 或 Pinia。

## 布局配置

布局功能统一在 `src/layouts/config.ts` 配置，例如 TagsView、Logo、固定 Header、Footer、全屏按钮、水印等。

这些选项是**静态项目配置**，模板默认不提供运行时 Settings Drawer，也不把布局选项写入 Pinia / localStorage。需要某项能力时直接修改配置文件，避免为简单模板维护一套额外的配置管理系统。

## 请求约定

`src/http/axios.ts` 统一处理 Token、通用错误和 `{ code, data, message }` 响应包。业务 API 的 `request<T>()` 直接返回 `data`：

```ts
return request<User>({
  url: "/users/1",
  method: "get"
})
```

页面和 API 不再重复 `.then(res => res.data)`，也不需要全局 `ApiResponseData<T>`。

## 环境变量

- `VITE_*`：浏览器端可访问配置。
- `DEV_PROXY_TARGET`：仅 Vite 开发服务器读取的代理地址。
- `SWAGGER_URL`：仅 Node API 生成脚本读取。

不要把密钥、内网凭证等敏感信息放进 `VITE_*` 变量。

## Swagger API 生成

Swagger 脚本属于隔离的开发工具，不参与普通页面运行时链路。除非后端契约或生成规则明确需要变化，不需要为了业务页面修改生成器本身。

1. 在 `.env` 配置 `SWAGGER_URL`（OpenAPI / Swagger JSON 地址）。
2. 执行：

```bash
pnpm api:generate
# 或临时指定地址
pnpm api:generate -- --url=http://127.0.0.1:8080/v3/api-docs
```

3. 产物：
   - `src/common/apis/<module>.ts`：请求函数
   - `src/common/apis/types/<module>.ts`：契约类型（勿手改）
   - `src/common/constants/enums.ts` / `options.ts` / `registry.ts`：枚举与下拉选项
   - `script/api.json`：本地缓存（已 gitignore）

手写接口（如 `auth.ts`、`demo-article.ts`）请放在独立文件中；生成文件内可用 `/* <generated> */` … `/* </generated> */` 保护自定义代码不被覆盖。

```bash
pnpm api:doc
```

## 接入真实后端

1. `.env.development` 中设置 `DEV_PROXY_TARGET` 为后端地址。
2. `.env` / `.env.production` 中设置 `VITE_USE_MOCK=false`。
3. 按后端协议修改 `src/common/apis/auth.ts` 中的 `realAuthApi`（路径、字段、Token 头）。
4. 如需改响应约定（默认 `code === 0`），调整 `src/http/axios.ts`。
5. 配置 `SWAGGER_URL` 后执行 `pnpm api:generate` 生成业务接口。

认证契约：

```ts
interface AuthApi {
  login: (input: LoginInput) => Promise<LoginResult>
  getCurrentUser: () => Promise<CurrentUser>
  logout: () => Promise<void>
}
```

Mock 与真实 API 是两套完全独立的实现：`VITE_USE_MOCK=true` 时只使用本地 Mock，设为 `false` 时所有 API 只请求真实后端。真实接口获取用户失败不会回退到本地缓存用户信息。

## 权限约定

权限以 `permissions` 为主，`roles` 为辅。同一数组内任一项命中即可；当路由同时配置 `roles` 与 `permissions` 时，两者必须同时满足。

```ts
meta: {
  permissions: ["user:list"]
}
```

按钮权限使用显式的 `checkPermission()`，角色判断使用 `checkRole()`。后端接口仍必须自行校验权限。

## 新增页面

1. 在 `src/pages/<domain>/` 新建页面。
2. 在 `src/router/index.ts` 的 `dynamicRoutes` 注册路由与 `roles` / `permissions`。
3. 接口与后端契约类型优先直接使用 Swagger 生成的 `@@/apis/<module>` 和 `@@/apis/types/<module>`；不要为了转发类型额外创建 `types/index.ts`。
4. 页面确实有额外 UI 类型时，再在页面目录放 `types.ts`；简单类型直接写在页面中即可。
5. 只有跨页面共享状态时才新增 `src/pinia/stores/`。
6. CRUD 可参考 `src/pages/demo/article`，其默认写法是普通 Element Plus 表单 + `CustomTable` + slot。

## 版本与升级

- 当前版本见 `package.json` → `version`
- 变更与迁移要点：[CHANGELOG.md](./CHANGELOG.md)
- 升级流程与冲突处理：[docs/UPGRADE.md](./docs/UPGRADE.md)

## 说明

- 本模板已移除业务页面、MQTT、ECharts 等业务依赖；Swagger 生成脚本默认保留。
- `types/auto/*` 由开发/构建自动生成，可提交以便冷启动。
- 初始化脚本可重复执行，不会破坏项目结构。
