# AI Skills 设计

项目只保留高频、跨文件、容易出错的工作流 Skill，避免把所有规则都拆成 Skill。

## 当前 Skill

- `v3-generate-page`：页面、CRUD、列表、详情、编辑页的整体实现流程；不重复维护 API、路由、Store、图标细则。
- `v3-connect-api`：Swagger、手写 API、真实后端联调、Axios 协议边界；不负责页面 UI。
- `v3-upsert-route`：Vue Router、菜单、权限、keepAlive；不负责页面业务实现。
- `v3-upsert-store`：真正跨页面共享的 Pinia 状态；不负责页面局部状态。
- `v3-use-icons`：UnoCSS Iconify、本地 SVG、路由菜单图标 safelist；不负责页面布局设计。

## 为什么接口单独做 Skill

接口对接不只发生在“生成页面”时，还包括：

- 接入 Swagger / OpenAPI。
- 修改认证接口。
- 对接真实后端。
- 调整响应 envelope。
- 新增上传、下载等特殊接口。

这些操作可能影响 API 契约、环境变量和全局 request 层，因此不能只作为页面生成 Skill 的一个小章节。

## 为什么图标也单独做 Skill

图标规则本身很短，但有一个容易遗漏的构建问题：路由 `meta.icon` 是运行时字符串，新增动态菜单图标时需要检查 `uno.config.ts` safelist。

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

## 实战验收：用户管理模块

使用当前 Skill 实现一个包含查询、新增、编辑、删除、权限、路由菜单和 API 的用户管理模块，结果用于检查 Skill 是否会诱导过度设计。

实际实现保持为：

```text
src/pages/demo/user/index.vue
src/common/apis/demo-user.ts
src/common/apis/types/demo-user.ts
src/router/index.ts
src/common/apis/auth.ts
```

验收结果：

- 页面局部查询、表格、弹窗和表单状态没有创建 Pinia Store。
- 没有新增 Service、Repository、Composable、Manager 或 Registry。
- 页面只调用 API 函数，没有直接使用 Axios。
- API 使用 `request<T>()`，没有重复 response wrapper。
- 路由复用现有 `ep:user` 图标；该图标已经存在于 safelist，因此没有重复修改 `uno.config.ts`。
- 实战发现父级菜单不能绑定某一个子模块的权限，否则会错误限制其他子模块；该规则已补入路由 Skill。
- 实战确认图标 Skill 应要求“先检查 safelist，缺失才修改”，避免无意义配置变更。

## 实战验收：文件上传与下载

继续使用 `v3-connect-api` 实现 FormData 上传、上传进度、Blob 下载和页面 loading，用来检查特殊接口会不会诱导第二套 Axios 或 Service 层。

实际实现保持为：

```text
src/pages/demo/file/index.vue
src/common/apis/demo-file.ts
src/common/apis/types/demo-file.ts
src/router/index.ts
src/common/apis/auth.ts
```

验收结果：

- 没有新增 Axios 实例、Service、Repository 或上传管理器。
- FormData 和 `onUploadProgress` 留在 API 层，页面只接收普通百分比。
- 没有手动设置 `Content-Type: multipart/form-data`，避免破坏浏览器生成的 boundary。
- Blob 下载继续复用现有 `request<Blob>()` 和 `responseType: "blob"`。
- API 只返回 Blob，不操作 DOM；浏览器保存逻辑只出现一次，因此留在页面局部函数，没有提前抽 util。
- 上传 loading / progress 都是页面局部状态，没有创建 Pinia Store。
- 菜单复用已有 `fa-solid:file-alt` safelist，没有为了验收增加图标配置。
- 现有单一 request 层已覆盖 JSON、FormData、上传进度、Blob 四类常见请求场景。

这次实战后，`v3-connect-api` 增加了 FormData boundary、上传进度映射和 Blob/UI 边界规则。

验收的目的不是要求所有业务都固定为 5 个文件，而是确保每个新增文件都有真实职责，且页面主体仍能沿着 `页面 → API / 必要时 Store → 通用组件` 的路径理解。

Skill 负责“工作流”，`AGENTS.md` 负责“全局代码原则”，源码和 CI 负责“最终事实”。
