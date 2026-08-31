---
name: v3-upsert-route
description: Add or modify Vue Router routes, menu metadata, roles, permissions, keepAlive, redirects, and route names in this repository. Use when a page needs to be registered or route metadata changes.
---

# Vue3 路由新增与修改

## 目标

直接使用 Vue Router 当前结构，不引入 route flatten、额外路由模型或缓存管理器。

## 修改位置

普通业务路由统一修改：

```text
src/router/index.ts
```

- 公共壳路由放 `constantRoutes`。
- 需要角色 / 权限过滤的业务路由放 `dynamicRoutes`。

不要为了新增一个页面新建 route module，除非路由表已经因为真实业务规模明显过大。

## 基本规则

- 页面路由使用唯一 `name`。
- 页面组件使用懒加载：`() => import("@/pages/...")`。
- 子路由 path 使用相对路径。
- `meta.title` 只写展示标题。
- 只有需要缓存时才写 `keepAlive: true`。
- 只有真实需要固定标签时才写 `affix`。
- 权限使用现有 `roles` / `permissions`。
- 不添加未来预留 meta 字段。

## 权限语义

当前权限过滤规则：

- `roles` 数组命中任意一项即可。
- `permissions` 数组命中任意一项即可。
- 同一路由同时配置 `roles` 与 `permissions` 时，两组条件都必须满足。
- 多个子路由拥有不同权限时，父级分组不要绑定其中某一个子路由的权限；让子路由分别声明权限，过滤后没有可访问子项的父级会被移除。
- 只有所有子项确实共享同一权限门槛时，父级才配置该 `permissions`。

## 菜单图标

路由菜单需要图标时遵循 `../v3-use-icons/SKILL.md`。

优先：

```ts
meta: {
  title: "用户管理",
  icon: "ep:user"
}
```

项目自定义 SVG 才使用：

```ts
meta: {
  title: "首页",
  svgIcon: "dashboard"
}
```

## 示例

```ts
{
  path: "/users",
  component: Layouts,
  name: "Users",
  meta: {
    title: "用户管理",
    icon: "ep:user",
    permissions: ["user:list"]
  },
  children: [
    {
      path: "list",
      component: () => import("@/pages/users/index.vue"),
      name: "UserList",
      meta: {
        title: "用户列表",
        permissions: ["user:list"]
      }
    }
  ]
}
```

## 禁止

- 不新增路由扁平化。
- 不做多级路由提升。
- 不为三级路由创建独立缓存系统。
- 不使用 Event Bus 同步路由状态。
- 不复制一套路由配置到页面目录。

## 完成检查

- route name 是否唯一？
- component path 是否真实存在？
- 权限是否只配置业务需要的项？
- 父级分组是否错误绑定了某一个子模块的权限？
- 图标是否符合当前图标规则？
- 是否保持现有 Vue Router 原生层级？
