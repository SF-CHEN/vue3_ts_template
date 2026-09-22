# Page Patterns

> 页面实现优先参考一个最相似、当前仍在使用的现有页面。
> 不要同时模仿多个页面风格；找不到合适范式时再搜索仓库。

## 选择顺序

1. 先看本文件，按任务类型选择一个标准参考页面。
2. 再阅读目标页面及其直接依赖。
3. 只有本文件没有对应范式时，才搜索仓库寻找相似实现。
4. 最终仍以根目录 `AGENTS.md` 和对应 Skill 为准。

## 范式索引

| 需求类型 | 首选参考 | 重点学习 |
|---|---|---|
| 标准 CRUD | `src/pages/demo/user/index.vue` | 查询、分页、新增、编辑、删除、权限按钮 |
| 简单 CRUD / 列表 | `src/pages/demo/article/index.vue` | CustomTable、CustomDialog、表单校验、slot 单元格 |
| 普通分页列表 | `src/pages/demo/article/index.vue` | query + pagination + loading 的最小结构 |
| 权限按钮 | `src/pages/demo/user/index.vue` | `checkRole` / `checkPermission` 后显式控制 UI |
| 新增/编辑共用弹窗 | `src/pages/demo/user/index.vue` | 用 `id === undefined` 区分新增/编辑，不额外维护 mode |
| 上传 | `src/pages/demo/file/index.vue` | File 留在页面、FormData 和 Axios 细节留在 API 层 |
| 上传进度 | `src/pages/demo/file/index.vue` | API 层把 Axios progress 转成普通百分比 |
| Blob 下载 | API 规则见 `v3-connect-api` | API 返回 Blob，DOM 保存行为留在页面 |
| 登录 | `src/pages/login/index.vue` | Form 校验、Token、redirect 回跳 |
| 403 / 404 | `src/pages/error/` | 错误页结构 |

## 标准 CRUD 范式

优先参考：

```text
src/pages/demo/user/index.vue
```

适用场景：

- 查询条件 1～数个。
- 普通分页表格。
- 新增 / 编辑弹窗。
- 删除确认。
- 按钮权限。
- 后端 DTO 与页面字段基本一致。

推荐结构：

```text
script
├─ imports
├─ refs / reactive
├─ DEFAULT_FORM
├─ rules
├─ columns
├─ 查询
├─ 搜索 / 重置
├─ 新增 / 编辑
├─ 提交
├─ 删除
└─ mounted

template
├─ 查询表单
├─ 工具栏
├─ CustomTable
└─ CustomDialog
```

不要因为普通 CRUD 默认创建：

```text
components/
composables/
services/
repository/
manager/
schema/
renderer/
```

只有出现真实独立职责或复用需求时再拆。

## 普通列表范式

参考：

```text
src/pages/demo/article/index.vue
```

核心状态通常只有：

```ts
const loading = ref(false)
const tableData = ref<Item[]>([])
const query = reactive<Query>({...})
const pagination = ref<TablePagination>({
  pageCurrent: 1,
  pageSize: 10,
  total: 0
})
```

搜索时：

```ts
function handleSearch() {
  // 查询条件变化后回到第一页，避免旧页码超出新结果。
  pagination.value.pageCurrent = 1
  getTableData()
}
```

不要为了分页默认新增通用 composable；现有页面结构足够清晰时保持直接。

## 表格范式

普通表格优先：

```vue
<CustomTable
  v-model:pagination="pagination"
  :loading="loading"
  :data="tableData"
  :columns="columns"
  @pagination="getTableData"
>
  <template #status="{ value }">
    <!-- 特殊单元格直接使用 Vue slot -->
  </template>
</CustomTable>
```

适合放进 `columns`：

- prop
- label
- width / minWidth
- fixed
- slot 名

不要放进 `columns`：

- 点击业务。
- API 调用。
- formatter registry。
- renderer component。
- 权限流程。
- 表单逻辑。

如果页面需要树表、复杂合并单元格、复杂 selection、编辑表格等明显特殊能力，可以直接使用 `el-table`，不要为了一个页面无限扩展 `CustomTable`。

## 弹窗表单范式

普通新增/编辑弹窗参考：

```text
src/pages/demo/user/index.vue
```

推荐：

```ts
const DEFAULT_FORM = {
  id: undefined,
  ...
}

const formData = reactive({ ...DEFAULT_FORM })

function resetForm() {
  formRef.value?.clearValidate()
  Object.assign(formData, DEFAULT_FORM)
}

async function handleSubmit() {
  // id 是新增/编辑的唯一分支条件，不额外维护 mode。
  if (formData.id === undefined) {
    ...
  } else {
    ...
  }
}
```

表单字段与后端 payload 一致时直接提交普通对象，不默认增加 Mapper / Adapter。

## 权限范式

参考：

```text
src/pages/demo/user/index.vue
```

推荐在页面逻辑里显式表达：

```ts
const canManage = computed(() => checkRole([ROLE_ADMIN]))
```

模板：

```vue
<el-button v-if="canManage">
  新增
</el-button>
```

不要为了少写一个 `v-if` 再维护第二套全局权限体系。

## 上传范式

参考：

```text
src/pages/demo/file/index.vue
```

职责边界：

```text
页面
├─ File 选择
├─ progress 展示
├─ loading
└─ 成功提示

API
├─ FormData
├─ onUploadProgress
└─ request<T>
```

不要在页面直接使用 Axios。

不要手动设置：

```http
Content-Type: multipart/form-data
```

浏览器需要自动生成 boundary。

## 登录范式

参考：

```text
src/pages/login/index.vue
```

保留这些职责：

- Element Plus 表单校验。
- 调用登录 API。
- Token 写入 User Store。
- 用户资料写入 Store。
- 按 `route.query.redirect` 回到登录前页面。

认证失败等通用错误由 request 层处理，页面只做当前业务需要的状态恢复。

## 页面样式

默认：

- UnoCSS：布局、间距、尺寸、简单样式。
- SCSS：复杂选择器、伪元素、动画、Element Plus 覆盖。
- Element Plus：直接用于普通业务 UI。

同一个简单样式不要同时写 UnoCSS 和 SCSS。

不要默认添加：

- 大量渐变。
- 复杂动画。
- 玻璃拟态。
- 无业务价值的装饰。
- 暗黑模式切换。

## 页面拆分判断

只有以下情况才建议拆子组件：

- 页面中有明显独立 UI 区域。
- 子区域有独立交互状态。
- 同一组件已经有多个真实调用方。
- 单文件已经明显混合多个职责，拆分后更容易理解。

不要因为文件达到某个行数就机械拆分。

## 完成检查

页面完成前检查：

- 是否只参考了一个主要页面范式？
- 是否优先复用了已有组件 / API / Utils？
- 页面局部状态是否错误放进 Pinia？
- 是否新增了没有真实价值的中间层？
- 特殊表格是否为了适配而污染了 `CustomTable`？
- 通用错误是否被页面重复提示？
- 关键业务意图是否有适量 Why 注释？
- 是否通过 ESLint 和 TypeScript 检查？
