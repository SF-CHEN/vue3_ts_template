# AI Skills 设计

项目只保留高频、跨文件、容易出错的工作流 Skill，避免把所有规则都拆成 Skill。

## 当前 Skill

| Skill | 负责 | 不负责 |
| --- | --- | --- |
| `v3-generate-page` | 页面、CRUD、列表、详情、编辑页的整体实现流程 | 重复维护 API / 路由 / Store / 图标细则 |
| `v3-connect-api` | Swagger、手写 API、真实后端联调、Axios 协议边界 | 页面 UI |
| `v3-upsert-route` | Vue Router、菜单、权限、keepAlive | 页面业务实现 |
| `v3-upsert-store` | 真正跨页面共享的 Pinia 状态 | 页面局部状态 |
| `v3-use-icons` | UnoCSS Iconify、本地 SVG、路由菜单图标 safelist | 页面布局设计 |

## 为什么接口单独做 Skill

接口对接不只发生在“生成页面”时，还包括：

- 接入 Swagger / OpenAPI。
- 修改认证接口。
- 对接真实后端。
- 调整响应 envelope。
- 新增上传、下载等特殊接口。

这些操作可能影响 API 契约、环境变量和全局 request 层，因此不能只作为页面生成 Skill 的一个小章节。

## 为什么图标也单独做 Skill

图标规则本身很短，但有一个容易遗漏的构建问题：路由 `meta.icon` 是运行时字符串，新增动态菜单图标时需要同步 `uno.config.ts` safelist。

因此图标使用单独做轻量 Skill，页面和路由 Skill 只引用它，不重复维护图标规则。

## 为什么不继续增加更多 Skill

以下内容由 `AGENTS.md` 和现有文档约束即可：

- TypeScript 规范。
- ESLint 规范。
- Composable 使用。
- Utils 使用。
- 普通组件开发。

这些规则多数属于全局编码约定，不需要独立工作流。Skill 过多会增加 AI 选择成本、重复规则和上下文 Token。

## 使用原则

1. 普通页面任务先使用 `v3-generate-page`。
2. 页面涉及接口、路由、Store、图标时，再读取对应 Skill。
3. 单独接口联调直接使用 `v3-connect-api`，不需要先加载页面 Skill。
4. 不因为一个特殊需求创建新的永久 Skill；先看是否能写进现有 Skill。
5. 只有某类工作反复出现、跨多个文件且容易犯错时，才考虑新增 Skill。

Skill 负责“工作流”，`AGENTS.md` 负责“全局代码原则”，源码和 CI 负责“最终事实”。
