# 内置工具函数速查 (Utils)

`src/common/utils` 只保留无业务状态、已有真实调用价值的工具。简单的一次性逻辑直接写在使用处，不提前沉淀为全局工具。

## 外链判断 `@@/utils/validate`

```ts
import { isExternal } from "@@/utils/validate"

isExternal("https://example.com") // true
isExternal("mailto:test@example.com") // true
isExternal("/dashboard") // false
```

数组、字符串等基础类型判断直接使用 JavaScript / TypeScript 原生能力，例如 `Array.isArray()` 和 `typeof`，不再额外包装工具函数。

## 权限判断 `@@/utils/permission`

```ts
import { checkPermission, checkRole } from "@@/utils/permission"

if (checkPermission(["demo:article:create"])) {
  // 拥有任一指定权限
}

if (checkRole(["admin", "manager"])) {
  // 拥有任一指定角色
}
```

页面按钮权限优先使用显式函数判断，不额外维护一套全局权限指令。

## 本地存储 `@@/utils/local-storage`

只封装模板当前确实需要持久化的状态，所有 key 由 `@@/constants/cache-key` 中的 `CacheKey` 管理：

- Token：`getToken` / `setToken` / `removeToken`
- 侧边栏：`getSidebarStatus` / `setSidebarStatus`
- 标签栏：`getVisitedViews` / `setVisitedViews` / `removeVisitedViews`
- KeepAlive：`getCachedViews` / `setCachedViews` / `removeCachedViews`

布局开关属于项目静态配置，直接修改 `src/layouts/config.ts`，不写入 localStorage。

## 图标工具 `@@/utils/icon`

将路由中的图标标识转换为 UnoCSS Iconify 类名：

```ts
import { toIconClass } from "@@/utils/icon"

toIconClass("fa-solid:tasks") // "i-fa-solid-tasks"
toIconClass("ep:plus") // "i-ep-plus"
```
