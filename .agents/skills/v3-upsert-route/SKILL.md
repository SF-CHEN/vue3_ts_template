---
name: v3-upsert-route
description: Add or modify Vue Router routes, menu metadata, roles, permissions, keepAlive, redirects, and route names in this repository.
---

# Vue3 路由

## 执行顺序

1. 读 `AGENTS.md` 和 `docs/PROJECT_MAP.md`。
2. 业务路由默认修改 `src/router/index.ts`。
3. 判断应放入 `constantRoutes` 还是 `dynamicRoutes`。
4. 菜单需要图标时同时读取 `../v3-use-icons/SKILL.md`。
5. 修改后检查 name、路径、权限和菜单元数据。

## 放置规则

- 公共壳路由、登录、错误页等放 `constantRoutes`。
- 需要角色 / 权限过滤的业务路由放 `dynamicRoutes`。
- 页面路由使用唯一 `name`。
- 页面组件使用懒加载。
- 子路由 `path` 使用相对路径。
- `keepAlive`、`affix` 只在业务确实需要时配置。
- 不预留未使用的 meta 字段。

## 权限语义

当前过滤规则：

- `roles`：命中任意一项即可。
- `permissions`：命中任意一项即可。
- 同一路由同时配置两者时，两组条件都要满足。

父级菜单包含多个不同权限子项时，不要把其中某个子项权限绑定到父级；让子路由分别声明。只有所有子项确实共享同一门槛时，父级才配置对应权限。

## 菜单图标

Iconify：

```ts
meta: {
  title: "用户管理",
  icon: "ep:user"
}
```

项目自定义 SVG：

```ts
meta: {
  title: "首页",
  svgIcon: "dashboard"
}
```

动态菜单图标的 safelist 规则见图标 Skill。

## 完成前检查

- `name` 是否唯一？
- component 路径是否真实存在？
- 父子权限语义是否正确？
- 是否只配置真实需要的 `keepAlive` / `affix`？
- 图标是否符合现有图标规则？
