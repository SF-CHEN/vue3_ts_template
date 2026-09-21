# Components

> 通用组件目录。目标是帮助 AI 判断“项目已经有什么”和“什么时候应该直接用 Element Plus”。
> 通用组件保持薄封装，不因为单个业务需求持续扩张 API。

## 使用原则

1. 先看本文件确认是否已有合适组件。
2. 只有多个页面确实共享同一交互时，才考虑扩展通用组件。
3. 单个页面的特殊需求优先留在页面内。
4. 复杂场景允许直接使用 Element Plus 原生组件，不要求所有页面强行套通用组件。
5. 不新增 Schema、Renderer Registry、动态组件注册表等二次框架。

## CustomTable

位置：

```text
src/common/components/CustomTable/
├─ index.vue
└─ types.ts
```

### 适用场景

- 普通后台数据列表。
- 简单分页。
- loading。
- 固定列 / 宽度。
- 普通文本列。
- 少量特殊单元格。

基础用法：

```vue
<CustomTable
  v-model:pagination="pagination"
  :loading="loading"
  :data="tableData"
  :columns="columns"
  @pagination="getTableData"
>
  <template #status="{ value }">
    <el-tag>{{ value }}</el-tag>
  </template>
</CustomTable>
```

列配置只描述普通表格属性：

```ts
interface TableColumn {
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | "left" | "right"
  slot?: string
}
```

### 推荐做法

普通列：

```ts
const columns: TableColumn[] = [
  { prop: "name", label: "名称", minWidth: 160 },
  { prop: "status", label: "状态", width: 120, slot: "status" },
  { prop: "actions", label: "操作", width: 180, fixed: "right", slot: "actions" }
]
```

特殊单元格：

```vue
<template #status="{ row }">
  <el-tag>{{ row.status }}</el-tag>
</template>
```

业务按钮：

```vue
<template #actions="{ row }">
  <el-button @click="handleEdit(row)">编辑</el-button>
</template>
```

### 不要做

不要往 `columns` 中继续增加这类能力：

```text
render
renderer
component
componentProps
event
handler
api
permission
editable
rules
mapper
formatter registry
```

这些会把一个轻量 Table 包装变成新的 UI 框架。

### 什么时候直接使用 el-table

以下需求明显超出当前 CustomTable 边界时，页面可以直接使用 `el-table`：

- 树形表格。
- 复杂 selection / 跨页选择。
- 合并单元格。
- 可编辑表格。
- 拖拽排序。
- 多级表头。
- 大量自定义事件。
- 某页面特有的复杂表格结构。

判断标准：

> 如果为了一个页面需要给 CustomTable 增加多个新概念，直接使用 Element Plus 通常更简单。

## CustomDialog

位置：

```text
src/common/components/CustomDialog/index.vue
```

### 适用场景

- 普通新增表单。
- 普通编辑表单。
- 确定 / 取消型弹窗。
- 简单内容展示。

基础用法：

```vue
<CustomDialog
  v-model="dialogVisible"
  title="编辑用户"
  width="520px"
  @confirm="handleSubmit"
  @closed="resetForm"
>
  <el-form>
    ...
  </el-form>
</CustomDialog>
```

当前组件只负责：

- visible。
- title。
- width。
- 取消。
- 保存。
- closed / confirm 事件。

### 不要做

不要为了单个页面给 CustomDialog 增加：

- 多步骤表单状态机。
- Drawer 模式。
- 动态 Footer Schema。
- 表单字段 Schema。
- API 自动提交。
- 权限判断。
- 全局 Modal Manager。

### 什么时候直接使用 el-dialog / el-drawer

如果页面需要：

- 特殊 footer。
- 多个操作按钮。
- Drawer。
- 全屏 Dialog。
- 特殊 before-close。
- 多层交互。
- 完全不同的确认流程。

直接使用 Element Plus 原生组件更清楚。

## Screenfull

位置：

```text
src/common/components/Screenfull/index.vue
```

用途：

- 顶部导航中的全屏 / 退出全屏按钮。
- 基于 VueUse `useFullscreen`。

组件已经处理：

- 浏览器能力检测。
- 全屏状态。
- toggle。
- 不支持时的提示。

业务页面通常无需复制一套全屏逻辑。

如果需求是“指定某个业务容器进入全屏”，先判断是否适合页面局部使用 VueUse，而不是修改全局 Screenfull 组件。

## 新增通用组件判断

只有满足以下条件之一才考虑放到 `src/common/components`：

- 已经有至少 2～3 个真实页面需要同一 UI + 同一交互。
- 组件具有清晰独立职责。
- 抽取后调用方明显更容易读。
- 组件不依赖具体业务 DTO / API。

不因为以下理由创建通用组件：

- “以后可能复用”。
- “这样目录更整齐”。
- “可以少写几行 Element Plus”。
- “为了做成低代码 / Schema”。

页面私有组件优先放在对应页面目录中。

## 修改通用组件前检查

修改 `src/common/components` 前先回答：

- 当前需求有几个真实调用方？
- 能否只在页面内解决？
- 是否会增加新的配置概念？
- 老页面是否会因此变难理解？
- 是否正在把业务逻辑塞进通用组件？

如果多数答案指向“只服务当前页面”，不要修改通用组件。
