---
name: v3-generate-page
description: Create or modify Vue 3 business pages, CRUD pages, list/detail/edit pages in this repository. Use this as the page-level workflow; delegate API, route, store, and icon details to the corresponding v3 skills.
---

# Vue3 页面

## 执行顺序

1. 读根目录 `AGENTS.md`。
2. 查 `docs/PROJECT_MAP.md`，确认已有能力。
3. 按 `docs/PAGE_PATTERNS.md` 选择 **1 个**主要参考页面；没有对应范式时再搜索仓库。
4. 读取目标页面及直接依赖，不默认扫描整个项目。
5. 判断是否涉及 API、Route、Store、Icon，并按需读取对应 Skill。
6. 实现最小改动，最后按 `AGENTS.md` 的验证规则检查。

## 默认结构

普通页面优先：

```text
src/pages/<domain>/index.vue
```

只有真实需要时再增加页面私有 `components/`、`types.ts` 等文件。

通用组件的适用边界见 `docs/COMPONENTS.md`。普通列表/弹窗可以复用现有薄封装；复杂需求允许直接使用 Element Plus，不为了单页需求扩大通用组件 API。

## 关联 Skill

- API / Swagger / 上传下载：`../v3-connect-api/SKILL.md`
- Router / Menu / 权限路由：`../v3-upsert-route/SKILL.md`
- 跨页面共享状态：`../v3-upsert-store/SKILL.md`
- UI / 菜单图标：`../v3-use-icons/SKILL.md`

## 页面任务完成前

- 页面是否只采用了一套主要参考写法？
- 新增文件是否都有真实职责？
- 是否复用了项目已有 API / Component / Util？
- 是否把本应局部的状态错误提升为全局能力？
- 本次 diff 是否只包含需求相关修改？
