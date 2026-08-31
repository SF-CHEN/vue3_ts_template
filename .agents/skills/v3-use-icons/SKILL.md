---
name: v3-use-icons
description: Add or change UI icons and route menu icons in this Vue 3 repository. Use UnoCSS Iconify classes for standard icons and the existing SvgIcon pipeline only for project-specific SVG assets.
---

# Vue3 图标使用

## 目标

统一图标来源，避免 Element Plus 图标组件、Iconify、SVG、图片图标混用。

## 优先级

### 1. 普通功能图标：UnoCSS Iconify

默认优先使用当前已安装集合：

- Element Plus：`ep:*`
- Font Awesome Solid：`fa-solid:*`

模板中直接写 UnoCSS class：

```vue
<span class="i-ep-plus" />
<span class="i-ep-search" />
<span class="i-fa-solid-file-alt" />
```

需要尺寸或颜色时用普通 UnoCSS class：

```vue
<span class="i-ep-delete text-lg text-red-500" />
```

不要为了一个图标 import Element Plus icon component。

### 2. 路由菜单图标

路由 `meta.icon` 使用 Iconify 标识，不写 `i-`：

```ts
meta: {
  title: "用户管理",
  icon: "ep:user"
}
```

Sidebar 会通过 `toIconClass()` 转成 UnoCSS class。

已有 Font Awesome 示例：

```ts
icon: "fa-solid:flask"
```

### 3. 项目专用 SVG

品牌图标、业务专用图形、Iconify 没有的自定义 SVG 放：

```text
src/common/assets/icons
```

通过全局 `SvgIcon` 使用：

```vue
<SvgIcon name="dashboard" />
```

路由使用：

```ts
meta: {
  svgIcon: "dashboard"
}
```

`svgIcon` 优先级高于 `icon`。

## 选择规则

优先问自己：

1. `ep` 是否已有合适图标？有就用。
2. `fa-solid` 是否已有合适图标？有就用。
3. 是否为品牌 / 业务专用 SVG？是才放本地 SVG。

不要因为图标名称不确定就新增第三个 Iconify 图标包。

## UnoCSS safelist

模板中静态出现的 `i-ep-*` / `i-fa-solid-*` class 通常可以自动扫描。

路由 `meta.icon` 是运行时字符串，构建器无法从 class 中直接扫描，因此新增路由菜单图标时必须检查 `uno.config.ts` safelist。

先检查目标图标是否已经存在；**已经存在就不要重复修改配置**。

例如新增：

```ts
icon: "ep:setting"
```

如果 `EP_SAFELIST` 还没有 `setting`，再增加：

```ts
"setting"
```

新增：

```ts
icon: "fa-solid:users"
```

如果 `FA_SOLID_SAFELIST` 还没有 `users`，再增加：

```ts
"users"
```

本地 `SvgIcon` 不需要加入 UnoCSS safelist。

## 禁止

- 不同时混用 `<el-icon>`、Element Plus icon import 和 UnoCSS 表示同类普通图标。
- 不为了一个图标新增图标库依赖。
- 不把网络图片当普通按钮图标。
- 不创建 Icon Manager / Registry。
- 不复制 SVG path 到 Vue 模板，优先放入现有 SVG 目录。
- 不为未来可能使用的图标提前扩充 safelist。
- 不重复添加已经存在的 safelist 项。

## 完成检查

- 普通图标是否优先使用 `ep` / `fa-solid`？
- 路由图标是否使用 `meta.icon` 的 `prefix:name` 格式？
- 动态路由图标是否检查 safelist，并只在缺失时补充？
- 自定义 SVG 是否确实属于业务专用图形？
- 是否避免新增无必要图标依赖？
