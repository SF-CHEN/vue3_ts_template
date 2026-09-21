# Project Map

> 给 AI 和开发者的项目能力速查。先看这里，再决定是否需要搜索仓库。
> 详细编码原则以根目录 `AGENTS.md` 为准。

## 入口与基础设施

| 能力 | 位置 | 说明 |
|---|---|---|
| 应用入口 | `src/main.ts` | 注册 Router、Pinia、全局样式等入口能力 |
| 根组件 | `src/App.vue` | 应用根节点 |
| Vite 配置 | `vite.config.ts` | Alias、代理、UnoCSS、自动导入、组件自动注册、SVG |
| ESLint | `eslint.config.js` | 代码风格机器事实来源 |
| UnoCSS | `uno.config.ts` | 原子样式和动态菜单图标 safelist |
| 环境变量 | `.env*` | 浏览器配置使用 `VITE_*`；开发代理使用 `DEV_PROXY_TARGET` |

## 页面 Patterns

先查 `docs/PAGE_PATTERNS.md`，根据需求类型选择一个现有页面作为参考。

常用页面：

| 场景 | 参考 |
|---|---|
| CRUD / 权限按钮 / 弹窗编辑 | `src/pages/demo/user/index.vue` |
| 普通列表 / 分页 | `src/pages/demo/article/index.vue` |
| 上传 / 下载 / Blob / 进度 | `src/pages/demo/file/index.vue` |
| 登录 | `src/pages/login/index.vue` |
| 403 / 404 | `src/pages/error/` |

页面私有逻辑优先留在页面目录。只有出现真实复用需求时才提升到 `src/common`。

## 通用组件

完整边界见 `docs/COMPONENTS.md`。

| 组件 | 位置 | 适用 |
|---|---|---|
| `CustomTable` | `src/common/components/CustomTable` | 普通列表、分页、loading、简单 columns + slot |
| `CustomDialog` | `src/common/components/CustomDialog` | 普通新增/编辑弹窗 |
| `Screenfull` | `src/common/components/Screenfull` | 页面全屏切换 |

原则：通用组件保持薄封装。复杂需求允许直接使用 Element Plus 原生组件，不为了一个页面持续扩张通用组件 API。

## API

| 能力 | 位置 | 说明 |
|---|---|---|
| Axios 请求层 | `src/common/apis/request.ts` | Token 注入、响应解包、通用错误处理 |
| API 函数 | `src/common/apis/*.ts` | 页面只调用 API 函数，不直接创建 Axios 实例 |
| 后端契约类型 | `src/common/apis/types/*.ts` | Swagger / OpenAPI 生成类型 |
| API 文档 | `src/common/apis/docs/api.md` | 生成给开发者与 AI 阅读的接口说明 |
| API 生成脚本 | `script/generate-api.cjs` | 从 Swagger / OpenAPI 生成 API 与类型 |
| API 文档脚本 | `script/doc.cjs` | 生成接口文档 |

API 工作流细节见 `.agents/skills/v3-connect-api/SKILL.md` 和 `docs/API_GENERATE.md`。

### Request 约定

`request<T>()` 直接返回业务 `data`：

```ts
const data = await request<User[]>({ url: "/users" })
```

页面不要重复：

```ts
res.data
res.data.data
```

通用错误由 request 层提示，页面只处理业务特有提示和分支。

## Store

目录：`src/pinia/stores`

| Store | 职责 |
|---|---|
| `app.ts` | 布局、侧边栏、设备相关状态 |
| `user.ts` | 当前用户、Token、角色和权限 |
| `permission.ts` | 根据角色/权限生成动态路由 |
| `tags-view.ts` | 标签页与 KeepAlive 状态 |

只有跨页面共享的状态才进入 Pinia。页面局部查询、弹窗、表单、loading 不应创建 Store。

## Router

目录：`src/router`

| 文件 | 职责 |
|---|---|
| `index.ts` | 常驻路由、动态权限路由、Router 实例 |
| `guard.ts` | 登录、用户信息初始化、动态路由注册、标题和进度条 |
| `helper.ts` | 路径等纯辅助逻辑 |
| `config.ts` | Router 静态配置 |

新增菜单/路由时按 `.agents/skills/v3-upsert-route/SKILL.md` 执行。

不要新增 route event bus、复杂 route flatten 或第二套路由注册体系。

## Composables

目录：`src/common/composables`

详细用法见 `docs/COMPOSABLES.md`。

| Composable | 用途 |
|---|---|
| `useDevice` | 移动端 / 桌面端判断 |
| `useTitle` | 浏览器页面标题 |
| `useWatermark` | 页面水印 |

新增前先判断是否真的需要响应式状态或生命周期。如果普通函数可以解决，优先留在页面或 `utils`。

## Utils

目录：`src/common/utils`

详细用法见 `docs/UTILS.md`。

| 文件 | 用途 |
|---|---|
| `validate.ts` | 外链等简单判断 |
| `permission.ts` | 角色 / 权限判断 |
| `local-storage.ts` | Token、Sidebar、TagsView、KeepAlive 持久化 |
| `icon.ts` | 路由图标标识转 UnoCSS Iconify class |

不要为 JavaScript / TypeScript 已经直接支持的简单操作新增工具包装。

## Constants

目录：`src/common/constants`

| 文件 | 说明 |
|---|---|
| `roles.ts` | 手写角色常量 |
| `app-key.ts` | 应用级 key |
| `cache-key.ts` | localStorage key |
| `enums.ts` | API Generator 生成枚举 |
| `options.ts` | API Generator 生成下拉选项 + 可保留自定义区 |
| `registry.ts` | API Generator 的 Enum / Options 聚合入口 |

注意：`registry.ts` 是生成器内部聚合文件，不是普通业务 Registry 模式范例。

## Layout

目录：`src/layouts`

| 位置 | 职责 |
|---|---|
| `index.vue` | 后台主布局 |
| `config.ts` | 固定 Header、TagsView、水印等静态开关 |
| `components/Sidebar` | 左侧菜单 |
| `components/NavigationBar` | 顶部导航 |
| `components/TagsView` | 标签页 |
| `components/AppMain` | 路由页面出口 |
| `composables/useResize.ts` | 响应式布局尺寸处理 |

模板只保留当前真实使用的左侧菜单布局，不为未来布局模式提前抽象。

## Icons

当前同时支持：

- UnoCSS + Iconify：适合路由和普通 UI 图标。
- 本地 SVG：适合项目自有图标或需要保留原色的资源。

详细规则见 `.agents/skills/v3-use-icons/SKILL.md`。

## 样式

- UnoCSS：布局、间距、尺寸、简单样式。
- SCSS：复杂选择器、伪元素、动画、Element Plus 覆盖。
- Element Plus：业务组件默认直接使用，不再包一层通用 Schema UI。

## 自动生成区域

以下内容主要由 API Generator 管理，普通业务修改不要把它们当作架构范例：

```text
src/common/apis/types/**
src/common/constants/enums.ts
src/common/constants/options.ts
src/common/constants/registry.ts
src/common/apis/docs/api.md
```

需要调整生成逻辑时修改 `script/generate-api.cjs` / `script/doc.cjs`，不要批量手改生成结果。

## 测试与质量

```bash
pnpm lint:fix
pnpm typecheck
pnpm test
pnpm build
```

优先给以下逻辑补测试：

- Utils / 纯函数。
- 路由 helper。
- 权限计算。
- 复杂数据转换。
- 反复出现 Bug 的核心逻辑。

普通 CRUD 页面不要求为了形式强制写单元测试。

## AI 任务入口

| 任务 | 首选 Skill / 文档 |
|---|---|
| 页面 / CRUD | `v3-generate-page` + `PAGE_PATTERNS.md` |
| API / Swagger | `v3-connect-api` |
| Router / Menu | `v3-upsert-route` |
| Pinia | `v3-upsert-store` |
| Icons | `v3-use-icons` |
| 找已有能力 | 本文件 |
| 找通用组件 | `COMPONENTS.md` |
| Composables | `COMPOSABLES.md` |
| Utils | `UTILS.md` |
