---
name: v3-use-icons
description: Add or change UI icons and route menu icons in this Vue 3 repository. Use UnoCSS Iconify for standard icons and the existing SvgIcon pipeline for project-specific SVG assets.
---

# Vue3 图标

## 选择顺序

1. 普通功能图标优先使用当前已安装的 Iconify 集合：
   - Element Plus：`ep:*`
   - Font Awesome Solid：`fa-solid:*`
2. 品牌或业务专用图形再使用本地 SVG。
3. 不因为一个图标新增第三个图标库。

模板中普通图标：

```vue
<span class="i-ep-plus" />
<span class="i-fa-solid-file-alt" />
```

## 路由菜单

`meta.icon` 写 Iconify 标识，不带 `i-`：

```ts
meta: {
  title: "用户管理",
  icon: "ep:user"
}
```

Sidebar 会通过现有 `toIconClass()` 转换。

业务专用 SVG：

```text
src/common/assets/icons
```

模板使用：

```vue
<SvgIcon name="dashboard" />
```

路由使用 `meta.svgIcon`。

## UnoCSS safelist

模板里的静态 `i-ep-*` / `i-fa-solid-*` 通常可直接扫描。

路由 `meta.icon` 是运行时字符串，因此新增菜单图标时检查 `uno.config.ts` safelist：

- 已存在：不要修改。
- 缺失：只补当前图标。
- 本地 `SvgIcon`：不需要加入 Iconify safelist。

## 完成前检查

- 普通图标是否优先复用 `ep` / `fa-solid`？
- 自定义 SVG 是否确实属于项目专用图形？
- 路由图标是否检查了 safelist？
- 是否避免了无必要的新图标依赖和重复 safelist？
