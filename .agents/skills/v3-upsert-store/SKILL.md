---
name: v3-upsert-store
description: Add or modify Pinia stores in this Vue 3 repository. Use only when state must be shared across pages or used outside a page component; avoid creating stores for local page state.
---

# Vue3 Pinia Store 新增与修改

## 目标

Store 只负责真正跨页面共享的状态，不把页面局部数据搬进全局状态。

## 先判断是否需要 Store

以下情况通常不需要 Pinia：

- 单页查询条件。
- 单页表格数据。
- 弹窗开关。
- 表单数据。
- 只在一个页面使用的 loading / options。

以下情况才考虑 Pinia：

- 多个页面共享同一状态。
- Layout / Router / 页面共同依赖同一状态。
- 登录用户、权限等应用级状态。
- 页面销毁后仍必须保留且业务明确要求。

## 修改位置

```text
src/pinia/stores/<domain>.ts
```

使用 Setup Store：

```ts
export const useExampleStore = defineStore("example", () => {
  const items = ref<Item[]>([])

  async function loadItems() {
    items.value = await fetchItems()
  }

  return { items, loadItems }
})
```

## 规则

- state 使用 `ref` / `reactive`，派生状态使用 `computed`。
- API 调用直接依赖 `src/common/apis`，不增加 service 层。
- 页面私有状态不要放进 Store。
- 不为了“以后可能共享”提前创建 Store。
- 持久化只有业务明确需要时才添加。
- localStorage 读写复用现有工具，不在 Store 中散落字符串 key。
- 不在持久化函数里修改原业务对象。

## setup 外访问

只有确实需要在组件 setup 外访问时，才增加 outside helper，例如路由守卫或请求拦截器。

普通页面不要为了方便默认创建：

```ts
useXxxStoreOutside()
```

## Store 与 API

Store 可以调用 API：

```text
Page → Store → API
```

也可以页面直接调用 API：

```text
Page → API
```

如果 Store 只是把 API 函数原样转发一次，则不要创建 Store。

## 禁止

- 不创建万能 App Store。
- 不把所有后端数据缓存到 Pinia。
- 不新增 Repository / Manager 包一层 Store。
- 不为了少写几个 props 创建全局 Store。
- 不默认添加持久化插件。

## 完成检查

- 这个状态是否确实有多个调用方？
- 删除 Store 后是否页面直接 API 就能更简单？
- 是否存在只做转发的 action？
- 是否引入了没有明确需求的持久化？
- 是否通过 ESLint / TypeScript？
