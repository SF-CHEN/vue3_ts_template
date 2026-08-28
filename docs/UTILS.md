# 内置工具函数速查 (Utils)

项目在 `src/common/utils` 目录下提供通用工具函数，通过路径别名 `@@/utils/` 导入。

## 验证工具 `@@/utils/validate`

```ts
import { isArray, isExternal, isString } from "@@/utils/validate"

// 判断是否为数组
isArray([1, 2, 3]) // true

// 判断是否为字符串
isString("hello") // true

// 判断是否为外链（以 http(s)://、mailto:、tel: 开头）
isExternal("https://example.com") // true
isExternal("/dashboard") // false
```

## CSS 变量 `@@/utils/css`

读取和设置 CSS 变量（变量名必须以 `--` 开头）。

```ts
import { getCssVar, setCssVar } from "@@/utils/css"

// 获取全局 CSS 变量
const color = getCssVar("--el-color-primary")

// 设置全局 CSS 变量
setCssVar("--el-color-primary", "#409eff")

// 操作指定元素上的 CSS 变量
const el = document.querySelector(".container") as HTMLElement
setCssVar("--bg-color", "#fff", el)
```

## 权限判断 `@@/utils/permission`

基于当前用户角色或权限判断是否拥有指定权限，内部读取 `useUserStore().roles` 和 `useUserStore().permissions`。

```ts
import { checkPermission } from "@@/utils/permission"

// 判断当前用户是否拥有 admin 或 user 角色
if (checkPermission(["admin", "user"])) {
  // 有权限
}

// 判断当前用户是否拥有指定权限标识
if (checkPermission(["demo:article:create"])) {
  // 有权限
}
```

## 本地存储 `@@/utils/local-storage`

对 localStorage 的类型安全封装，所有 key 统一由 `@@/constants/cache-key` 中的 `CacheKey` 管理。

```ts
import { getToken, removeToken, setToken } from "@@/utils/local-storage"

// Token 操作
setToken("mock-token-admin")
const token = getToken()
removeToken()
```

可用函数一览：

| 分组     | 函数                                                                        | 说明                |
| -------- | --------------------------------------------------------------------------- | ------------------- |
| Token    | `getToken` / `setToken` / `removeToken`                                     | 用户认证令牌        |
| 布局配置 | `getLayoutsConfig` / `setLayoutsConfig` / `removeLayoutsConfig`             | 系统布局设置        |
| 侧边栏   | `getSidebarStatus` / `setSidebarStatus`                                     | 侧边栏展开/收起状态 |
| 主题     | `getActiveThemeName` / `setActiveThemeName`                                 | 当前主题名称        |
| 标签栏   | `getVisitedViews` / `setVisitedViews` / `getCachedViews` / `setCachedViews` | 标签页缓存          |

## 图标工具 `@@/utils/icon`

将路由 / 业务中的图标标识转为 UnoCSS Iconify 类名：

```ts
import { toIconClass } from "@@/utils/icon"

toIconClass("fa-solid:tasks") // "i-fa-solid-tasks"
toIconClass("ep:plus") // "i-ep-plus"
```
