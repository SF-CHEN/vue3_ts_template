# Vue Admin Template

可独立复制、初始化的 Vue 3 管理后台模板。

## 技术栈

- Vue 3 + Vite + TypeScript
- Element Plus + Pinia + Vue Router
- UnoCSS + Sass

## 快速开始

```bash
# 进入模板目录（或将本目录复制为新项目）
cd template

# 安装依赖
pnpm i

# 按文件夹名初始化包名 / 标题 / 缓存 Key（可选）
pnpm run init -- -ProjectTitle 示例后台

# 启动
pnpm dev
```

其他命令：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm build:staging
pnpm api:generate          # 从 Swagger 生成 API / 类型
pnpm api:doc               # 生成接口文档摘要
```

## Mock 登录

默认开启本地 Mock API（`VITE_USE_MOCK=true`）：

| 账号    | 密码 | 角色     | 说明                   |
| ------- | ---- | -------- | ---------------------- |
| `admin` | 任意 | 管理员   | 示例 CRUD 全部按钮可用 |
| `user`  | 任意 | 普通用户 | 仅部分按钮权限         |

## 目录约定

```text
src
├─ common
│  ├─ apis          # 接口（auth 适配层 + Swagger 生成 + 示例）
│  ├─ components    # CustomTable / CustomForm / CustomDialog 等
│  ├─ composables
│  ├─ constants     # 含 Swagger 生成的 enums / options / registry
│  └─ utils
├─ http             # Axios 封装
├─ layouts          # 布局
├─ pages
│  ├─ demo          # CRUD 示例
│  ├─ error
│  ├─ home          # 首页
│  ├─ login
│  └─ redirect
├─ pinia
├─ plugins
└─ router
script
├─ init-project.ps1
├─ load-swagger.cjs
├─ generate-api.cjs
└─ doc.cjs
```

## Swagger API 生成

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
pnpm api:doc   # 输出 src/common/apis/docs/api.md
```

## 接入真实后端

1. `.env.development` 中设置 `VITE_PROXY_TARGET` 为后端地址。
2. `.env` / `.env.production` 中设置 `VITE_USE_MOCK=false`。
3. 按后端协议修改 `src/common/apis/auth.ts` 中的 `realAuthApi`（路径、字段、Token 头）。
4. 如需改响应约定（`code === 0`），调整 `src/http/axios.ts`。
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

按钮权限使用 `checkPermission` 或 `v-permission`，角色判断使用 `checkRole`。后端接口仍必须自行校验权限。

## 新增页面

1. 在 `src/pages/<domain>/` 新建页面。
2. 在 `src/router/index.ts` 的 `dynamicRoutes` 注册路由与 `roles` / `permissions`。
3. 接口优先用 Swagger 生成（`@@/apis/<module>`）；页面 UI 扩展类型放页面旁 `types/`。
4. 需要共享状态时新增 `src/pinia/stores/`。
5. CRUD 可参考 `src/pages/demo/article`。

## 版本与升级

- 当前版本见 `package.json` → `version`（首版 `0.1.0`）
- 变更与迁移要点：[CHANGELOG.md](./CHANGELOG.md)
- 升级流程与冲突处理：[docs/UPGRADE.md](./docs/UPGRADE.md)

## 说明

- 本模板已移除业务页面、MQTT、ECharts 等业务依赖；Swagger 生成脚本默认保留。
- `types/auto/*` 由开发/构建自动生成，可提交以便冷启动。
- 初始化脚本可重复执行，不会破坏项目结构。
