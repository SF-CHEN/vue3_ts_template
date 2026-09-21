---
name: v3-upsert-store
description: Add or modify Pinia stores in this Vue 3 repository. Use only when state must be shared across pages, layouts, router logic, or other app-level consumers.
---

# Vue3 Pinia Store

## 先判断是否需要 Store

适合 Pinia：

- 多个页面共享同一状态。
- Layout / Router / 页面共同依赖。
- 登录用户、权限等应用级状态。
- 页面销毁后仍需保留，且业务明确要求。

通常不需要 Pinia：

- 单页查询条件、表格数据。
- 弹窗开关、表单数据。
- 单页 loading / options。

## 修改位置

```text
src/pinia/stores/<domain>.ts
```

使用 Setup Store，并保持状态和 action 直接可读。

Store 可以调用 `src/common/apis`，但如果只是把 API 函数原样转发一次，页面直接调用 API 更简单，不应创建 Store。

## setup 外访问

只有路由守卫、请求拦截器等确实在组件 setup 外使用时，才增加 `useXxxStoreOutside()` 一类 helper。

普通页面不要默认创建 outside helper。

## 持久化

只有业务明确要求时才持久化。localStorage 统一复用现有工具和 key，不在 Store 中散落字符串 key。

## 完成前检查

- 状态是否真的有多个调用方或跨生命周期需求？
- 删除这个 Store 后是否会更简单？
- 是否存在只做 API 转发的 action？
- 是否引入了没有明确需求的持久化或 outside helper？
