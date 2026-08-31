# Vue3 + Vite + TypeScript 管理后台模板

一个偏向 AI 协作开发的 Vue3 模板，目标是：简单、易读、易维护、修改范围小，不过度抽象。

## 技术栈

Vue 3 + Vite + TypeScript + Element Plus + Pinia + Vue Router + UnoCSS。

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm typecheck
pnpm check
pnpm check:fix
pnpm test
pnpm build
```

## AI 开发约定

开始编码前先阅读 `AGENTS.md`。

项目 Skill 设计与使用方式见 `docs/AI_SKILLS.md`，当前只保留页面、接口、路由、Store、图标 5 类高频工作流 Skill。

建议参考：

- `src/pages/demo/article/index.vue`：普通 CRUD 页面基础范本。
- `src/pages/demo/user/index.vue`：页面 + API + 权限 + 路由 + 图标的完整实战范本。
- `src/pages/demo/file/index.vue`：FormData 上传、进度、Blob 下载的特殊接口范本。

主要原则：

- 新增能力前先搜索已有相似实现，只参考 1 个最接近的当前实现。
- 普通需求尽量在 1～3 个主要文件内完成。
- 不为未来需求提前创建 Service、Repository、Factory、Registry、Manager 等中间层。
- ESLint 配置是代码风格唯一事实来源；写完先 lint，再做 TypeScript 检查。
- 不通过关闭规则、降低 TS 严格度或滥用 `any` 来让检查通过。

## 初始化项目

```bash
pnpm install
pnpm run init -- -ProjectTitle "项目名称"
pnpm dev
```

初始化脚本会更新包名、页面标题、缓存 key 与登录页标题，不扩展成复杂 CLI。

## 接口

- 浏览器端 API 基地址：`VITE_BASE_URL`
- 开发代理目标：`DEV_PROXY_TARGET`
- Swagger 地址：`SWAGGER_URL`
- Mock 开关：`VITE_USE_MOCK`

有 Swagger / OpenAPI 时：

```bash
pnpm api:generate
```

生成代码位于 `src/common/apis`、`src/common/apis/types` 和相关 constants 文件。

`request<T>()` 直接返回业务数据；FormData、Blob 等特殊请求也继续复用同一个 request 层。
