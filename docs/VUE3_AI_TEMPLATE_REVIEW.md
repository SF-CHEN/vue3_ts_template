# Vue3 + Vite + TypeScript AI 开发模板审查与改造建议

> 审查对象：`vue3_vite_ts.zip`  
> 目标：让 AI 生成的代码 **符合规范、容易看懂、容易维护、少消耗 Token、逻辑简单、避免过度设计**。

---

## 1. 结论先说

这个模板的基础是不错的：技术栈清晰、目录有约束、TypeScript 开了严格模式、API / Router / Pinia / Layout 都已经具备，而且已经有 `AGENTS.md` 和 `.agents/skills`，说明你已经在主动为 AI 编码做约束。

但如果你的核心目标是：

1. AI 快速生成业务代码；
2. 人能很快读懂；
3. 后期维护成本低；
4. 尽量少读上下文、少耗 Token；
5. 不做过度抽象；

那么当前模板还有一个比较明显的问题：**基础设施比普通业务页面需要的复杂度高了一档。**

尤其是下面几块：

- `CustomForm` 的 schema + field + wrapper + registry + fields；
- `CustomTable` 的 column + dispatcher + registry + cells；
- 路由三级降级逻辑；
- 自定义 Route Event Bus；
- Settings / RightPanel / Watermark / Grey / ColorWeakness / Screenfull 等默认基础设施；
- 7 个 Skill 共约 **1425 行 / 52 KB**，规则存在重复；
- Skill 中还有与真实项目不一致的引用和规则。

因此我建议你的模板从“功能完整型 Admin Framework”调整为：

> **轻量项目骨架 + 少量稳定约定 + 可选能力按需添加。**

最终目标不是让 AI 学会你造的所有框架，而是让 AI **几乎不用学习就知道应该怎么写**。

---

# 2. 当前模板值得保留的部分

## 2.1 技术栈本身可以保留

当前：

- Vue 3
- Vite
- TypeScript
- Element Plus
- Pinia
- Vue Router
- UnoCSS
- Sass
- Axios
- Vitest
- ESLint
- `unplugin-auto-import`
- `unplugin-vue-components`
- `unplugin-svg-component`

整体没有问题。

对于“AI 快速开发后台项目”来说，这套技术栈成熟、资料多、AI 熟悉度高。

---

## 2.2 `strict: true` 应继续保留

`tsconfig.json` 已开启：

```json
"strict": true
```

建议继续保持。

不要为了让 AI 代码更容易通过而关闭严格类型检查。

正确方向应该是：

> **让规则更简单，而不是让类型更宽松。**

---

## 2.3 Element Plus 自动组件导入可以保留

当前：

```ts
Components({
  resolvers: [ElementPlusResolver()]
})
```

这个非常适合 AI 开发。

业务代码可以直接写：

```vue
<el-button />
<el-table />
<el-form />
```

不用生成一堆 import。

既减少代码，又减少 Token。

---

## 2.4 常用 Vue API 自动导入可以保留

例如：

```ts
ref
reactive
computed
watch
onMounted
```

AI 对这些名字非常熟悉，不需要 import 也不会明显降低可读性。

这是少数真正同时满足：

- 减少 Token；
- 减少样板代码；
- 不明显损害可读性；

的自动导入。

---

## 2.5 API / 页面 / Store 分层思路是对的

你现在已经有：

```text
src/common/apis
src/pages
src/pinia/stores
src/router
```

这种职责区分值得保留。

但建议后面进一步把依赖方向收紧，避免 `common` 反向依赖 `pages`。

---

# 3. 优先级最高的修改

我建议先改下面 7 项。

| 优先级 | 修改项 | 原因 |
|---|---|---|
| P0 | 精简 `.agents/skills` | 直接降低 AI 上下文成本 |
| P0 | 修正规则与真实代码冲突 | 防止 AI 猜规则 |
| P0 | 降低 `CustomForm` 抽象 | 当前最容易产生“代码看不懂”的地方 |
| P0 | 降低 `CustomTable` 抽象 | 避免 registry / dispatcher 过度设计 |
| P0 | 修复 API → Page 的反向依赖 | 属于实际架构问题 |
| P1 | 简化 Router / Layout 默认能力 | 减少 AI 必须理解的基础设施 |
| P1 | 简化 Vite / TS 配置 | 删除“不需要时也存在”的优化项 |

---

# 4. P0：精简 AI Skill

当前 `.agents/skills` 有 7 个 Skill，总计大约：

```text
1425 行
52 KB
```

包括：

```text
v3-create-crud
v3-generate-page
v3-ts-conventions
v3-upsert-route
v3-upsert-store
v3-use-composables
v3-use-utils
```

这里最大的问题不是文件多，而是 **规则重复**。

例如：

- CRUD Skill 讲目录；
- Generate Page Skill 也讲目录；
- TS Skill 再讲类型目录；
- Store Skill 又重复 import / 类型 / 注释规范；
- Utils / Composables Skill 本质上更像文档，不像真正需要自动触发的 Skill。

AI 一旦同时读取几个 Skill，很容易发生：

> 同一个规则在三个文件里重复出现。

这不仅增加 Token，还增加冲突概率。

---

## 4.1 推荐最终只保留 3 个 Skill

```text
.agents/skills/
├─ page/SKILL.md
├─ route/SKILL.md
└─ store/SKILL.md
```

### page

合并：

```text
v3-create-crud
v3-generate-page
```

只描述：

- 页面生成步骤；
- 默认目录；
- CRUD 默认写法；
- 什么时候拆组件；
- 什么时候用 Store。

控制在约 **120～180 行**。

---

### route

只描述：

- 新增路由；
- meta 约定；
- 权限字段；
- 菜单显示规则。

控制在 **80～120 行**。

---

### store

只描述：

- 什么情况才允许建 Store；
- Store 基本模板；
- 持久化规则。

控制在 **80～120 行**。

---

## 4.2 以下两个 Skill 建议取消

```text
v3-use-utils
v3-use-composables
```

它们更适合放：

```text
docs/UTILS.md
docs/COMPOSABLES.md
```

原因：

AI 真正需要某个工具的时候，可以搜索代码。

没有必要每次提到：

```text
权限
localStorage
route
水印
```

就加载一整份使用教程。

---

## 4.3 TypeScript 规则直接放进 AGENTS.md

`v3-ts-conventions` 现在约 100 行。

实际上真正需要 AI 每次记住的只有十几条。

例如：

```md
- strict TypeScript
- 业务代码禁止 any
- 类型导入用 import type
- interface 表示对象结构
- type 表示联合类型 / 工具类型
- 页面私有类型就近放置
- API DTO 放 api/types
- 不为一个简单类型单独建文件
```

完全可以直接放进 `AGENTS.md`。

这样 AI 不需要额外打开一个 Skill。

---

# 5. P0：修正规则冲突

目前存在几个明显的不一致。

---

## 5.1 Skill 引用了不存在的目录

`v3-generate-page/SKILL.md` 中写了：

```text
.cursor/rules/vue.mdc
.cursor/rules/ts.mdc
.cursor/rules/project.mdc
```

但当前项目中没有这些文件。

这会给 AI 一个错误信号：

> “是不是还有规则我没有读？”

### 建议

直接改成：

```text
全局编码规范以根目录 AGENTS.md 为准。
```

只保留一个规则入口。

---

## 5.2 规则说禁止 `any`，基础组件里却有 `any`

当前可以看到：

```ts
:label-width="formLabelWidth as any"
```

以及：

```ts
data?: any[]
columns: TableColumn<any>[]
```

还有一些 Field 内部的 `as any`。

但 Skill 中又明确告诉 AI：

```text
不要 any
```

规则和源码冲突会造成 AI 模仿代码时不知道该听哪一个。

### 推荐规则

不要写绝对的：

```text
禁止 any
```

改成：

```text
业务代码禁止 any。
基础设施代码只有在第三方类型确实无法表达时允许局部 any，禁止扩散到业务层。
```

更符合真实工程。

---

# 6. P0：CustomForm 当前抽象偏重

当前一个 Form 字段的调用路径大致是：

```text
页面
 ↓
FormSchemaItem
 ↓
CustomForm
 ↓
FormItemWrapper
 ↓
FormField
 ↓
registry
 ↓
具体 XxxField.vue
 ↓
Element Plus
```

对一个普通后台输入框来说，这条调用链太长。

例如一个简单字段：

```text
用户名：el-input
```

开发者为了追踪它实际怎么渲染，可能需要打开 4～6 个文件。

这与“让我一眼看懂”的目标相冲突。

---

## 6.1 我建议的默认策略

### 普通页面

直接使用 Element Plus：

```vue
<el-form :model="form">
  <el-form-item label="名称" prop="name">
    <el-input v-model="form.name" />
  </el-form-item>

  <el-form-item label="状态" prop="status">
    <el-select v-model="form.status">
      ...
    </el-select>
  </el-form-item>
</el-form>
```

AI 非常熟悉，开发者也一眼能懂。

---

## 6.2 什么情况下才使用 Schema Form

只有满足下面之一再使用 Schema：

1. 一个项目中大量页面存在高度一致的动态表单；
2. 字段由后端动态返回；
3. 确实需要统一动态配置；
4. 同一 schema 需要同时驱动新增 / 编辑 / 查询等多个场景。

否则不要默认使用。

---

## 6.3 如果你坚持保留 CustomForm

建议砍掉 registry。

从：

```text
CustomForm
├─ components/FormField.vue
├─ components/FormItemWrapper.vue
├─ composables
├─ fields/*
└─ registry/*
```

简化成：

```text
CustomForm/
├─ index.vue
├─ types.ts
└─ fields.ts
```

直接在一个映射里决定类型：

```ts
const fieldMap = {
  input: ElInput,
  select: ElSelect,
  switch: ElSwitch
}
```

甚至直接在模板 `v-if`。

你的目标不是做一个第三方 Form Engine，所以没有必要提供动态注册 API。

---

# 7. P0：CustomTable 可以保留，但不要做成渲染框架

`CustomTable` 比 `CustomForm` 更值得保留，因为：

- 表格分页样板代码很多；
- 后台项目表格高度重复；
- columns 配置通常比较直观。

但当前仍然有：

```text
TableCell
registry
builtInTypes
TextCell
TagCell
OperationCell
```

调用链仍然偏长。

---

## 7.1 推荐保留的能力

只保留：

```text
columns
pagination
loading
selection
slot
```

例如：

```ts
const columns = [
  { prop: "name", label: "名称" },
  { prop: "status", label: "状态", slot: "status" },
  { label: "操作", slot: "actions", width: 160 }
]
```

页面：

```vue
<AppTable :data="list" :columns="columns">
  <template #status="{ row }">
    <el-tag>{{ row.status }}</el-tag>
  </template>

  <template #actions="{ row }">
    <el-button link @click="handleEdit(row)">编辑</el-button>
  </template>
</AppTable>
```

这比：

```text
operation registry → OperationCell → buttons config → callback
```

更直观。

---

## 7.2 建议删除

```text
CustomTable/registry
CustomTable/cells/OperationCell.vue
动态 registerColumnType
```

### 原则

> 表格的特殊内容优先使用 Vue slot，不重新发明一套 renderer/plugin system。

Vue slot 是 AI 和开发者都熟悉的原生概念。

---

# 8. P0：修复 API 层反向依赖页面

当前：

```ts
src/common/apis/demo-article.ts
```

里面引用：

```ts
import type {
  ArticleFormData,
  ArticleItem,
  ArticleQuery
} from "@/pages/demo/article/types"
```

这是不推荐的依赖方向。

现在实际上变成：

```text
common/apis
   ↓
pages
```

而页面同时又依赖 API：

```text
pages
 ↓
common/apis
```

形成架构上的循环关系。

---

## 8.1 推荐依赖方向

```text
Page
 ↓
API
 ↓
API Types
```

例如：

```text
src/common/apis/
├─ article.ts
└─ types/
   └─ article.ts
```

```ts
// api/types/article.ts
export interface ArticleItem {
  id: number
  title: string
  status: "draft" | "published"
  author: string
  createdAt: string
}

export interface ArticleQuery {
  title?: string
  status?: "" | "draft" | "published"
}
```

页面只有 UI 特有类型时才创建：

```text
pages/demo/article/types.ts
```

---

# 9. 请求层建议进一步简化

当前 API 使用方式：

```ts
request<ApiResponseData<ArticleItem>>(...)
  .then(res => res.data)
```

每个 API 都需要知道：

```text
code
data
message
```

其实响应协议属于 HTTP 层内部实现。

业务 API 更关心：

```ts
ArticleItem
```

---

## 9.1 推荐 request 直接返回 data

例如：

```ts
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config)
}
```

response interceptor 成功时：

```ts
return apiData.data
```

于是 API 可以写成：

```ts
export function getArticleList(params: ArticleQuery) {
  return request<ArticlePage>({
    url: "/articles",
    method: "get",
    params
  })
}
```

新增：

```ts
export function createArticle(data: ArticleSaveInput) {
  return request<ArticleItem>({
    url: "/articles",
    method: "post",
    data
  })
}
```

比现在更短，也更容易理解。

如果极少数接口确实需要完整响应，再单独提供：

```ts
requestRaw()
```

不要让所有业务代码为少数特殊情况付出复杂度。

---

## 9.2 GET 请求不要默认塞 `data: {}`

当前请求层存在：

```ts
if (config.data === undefined) {
  mergeConfig.data = {}
}
```

没有明显必要。

建议删除。

请求参数不存在就让它不存在。

越少“自动魔法”，越方便 AI 和人理解。

---

## 9.3 错误提示只保留一个层级

目前 Axios interceptor 会：

```ts
ElMessage.error(...)
```

页面某些方法 catch 后又：

```ts
ElMessage.error(...)
```

真实 API 出错时可能产生重复提示。

建议确定唯一策略。

我更推荐：

> **通用 HTTP 错误由 request 层统一提示，页面默认不 catch；只有业务需要特殊处理时才 catch。**

这样 AI 生成页面时可以少写大量重复：

```ts
catch (error) {
  ElMessage.error(...)
}
```

---

# 10. Demo CRUD 本身也可以明显简化

当前 `src/pages/demo/article/index.vue` 大约 314 行。

对于只有几个字段的 CRUD 示例来说略重。

---

## 10.1 schema 没有依赖响应式状态时不要 computed

当前类似：

```ts
const searchSchema = computed<FormSchemaItem[]>(() => [...])
```

如果配置本身不会变化：

```ts
const searchSchema: FormSchemaItem[] = [...]
```

即可。

同理，很多 `columns` 配置也不需要为了 callback 而变成 computed。

callback 本身可以读取响应式值。

---

## 10.2 简单对象不需要 cloneDeep

当前：

```ts
cloneDeep(DEFAULT_FORM)
```

但当前表单全是一级字段。

直接：

```ts
formData.value = { ...DEFAULT_FORM }
```

即可。

### 原则

> 只有对象真的存在嵌套可变数据时才使用 deep clone。

不要让 AI 看到 `cloneDeep` 后所有表单都机械复制。

---

## 10.3 表单与接口字段一致时直接提交

如果：

```ts
formData
```

和后端提交结构一致，就直接：

```ts
await createArticle(formData.value)
```

不要为了“看起来分层”再写：

```ts
const params = {
  name: form.name,
  status: form.status,
  ...
}
```

只有字段需要：

- 重命名；
- 类型转换；
- 删除 UI 专属字段；
- 合并 / 拆分；

时再建立 payload。

这条规则非常适合减少 AI 重复代码和 Token。

---

# 11. Router 建议删除默认不使用的高级能力

当前：

```ts
thirdLevelRouteCache: false
```

但是为了支持这个默认关闭的功能，还存在：

```text
flatMultiLevelRoutes
promoteRouteLevel
addToChildren
cloneDeep
createRouter 临时实例
```

这是典型的：

> **为了一个“未来可能使用”的功能，让所有项目都携带复杂代码。**

与你的模板目标冲突。

---

## 推荐

直接删除：

```text
thirdLevelRouteCache
flatMultiLevelRoutes
promoteRouteLevel
addToChildren
```

如果未来某个项目真的需要三级 keep-alive，再针对那个项目解决。

### AI 模板很重要的一条原则

> **不要提前解决还没发生的问题。**

---

# 12. 自定义 Route Event Bus 建议删除

当前：

```text
useRouteListener.ts
mitt
setRouteChange
listenerRouteChange
```

实际上 Vue Router 已经提供成熟的：

```ts
useRoute()
router.afterEach()
watch()
```

Skill 中还写了类似“比直接 watch 性能更好”的描述。

对普通业务项目而言，这种性能优化没有必要成为模板默认架构。

---

## 推荐

组件需要监听路由：

```ts
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    // ...
  }
)
```

全局操作：

```ts
router.afterEach(...)
```

然后删除：

```text
mitt
useRouteListener.ts
```

AI 更熟悉原生 Router 方式，也少一个项目私有概念。

---

# 13. Layout 建议分成“核心”和“可选”

当前 Layout 默认携带：

```text
TagsView
Settings
RightPanel
Screenfull
Watermark
Grey Mode
Color Weakness
主题配置
```

这些功能不是错。

问题是：它们未必是每一个新项目都需要。

---

## 13.1 基础模板建议只留

```text
Layout
├─ Sidebar
├─ NavigationBar
└─ AppMain
```

如果你经常需要 TagsView，可以保留：

```text
TagsView
```

---

## 13.2 以下建议变成可选 Recipe

```text
Settings
RightPanel
Screenfull
Watermark
Grey Mode
Color Weakness
三级路由 Cache
```

可以放：

```text
docs/recipes/
```

或者单独维护一个：

```text
admin-template-advanced
```

不要让所有项目默认背着这些逻辑。

---

# 14. 样式建议：减少“模板审美绑架”

当前 `element-plus.scss` 中对 Dialog 做了比较强的全局设计：

```text
16px 圆角
背景图片
白色标题
固定 header 设计
```

这更像某一个项目的 UI，而不是通用模板。

如果目标是：

> AI 根据不同项目原型快速开发

那么模板默认样式应该尽可能中性。

---

## 推荐

基础模板只统一：

```text
字体
基础背景
页面间距
表格间距
Dialog padding
常用 radius
主题色变量
```

不要默认加入：

```text
Dialog 头图
明显品牌视觉
复杂阴影
过强颜色覆盖
```

否则 AI 每做一个新项目都需要先覆盖模板样式。

---

# 15. UnoCSS 建议只使用 class 模式

当前启用了：

```ts
presetAttributify()
```

Attributify 很省字符，例如：

```vue
<div flex items-center justify-between />
```

但它的问题是：

- 新人不一定认识；
- HTML attribute 和组件 props 容易混在一起；
- AI 有时会生成不同风格；
- 同一个项目容易同时出现 class / attributify 两种写法。

你的目标更偏“好理解、好维护”。

### 建议关闭 Attributify

统一：

```vue
<div class="flex items-center justify-between" />
```

Token 多几个，但长期维护明显更稳定。

---

# 16. UnoCSS 与 SCSS 的职责要写死

建议明确：

### UnoCSS

负责：

```text
布局
flex/grid
margin/padding
width/height
字体大小
简单颜色
简单响应式
```

### SCSS

只负责：

```text
复杂组件样式
伪元素
多层嵌套
Element Plus 深度覆盖
复杂动画
```

### 禁止

同一个简单样式同时写：

```vue
class="flex items-center"
```

又写：

```scss
.xxx {
  display: flex;
  align-items: center;
}
```

让 AI 始终只有一个选择。

---

# 17. Vite 配置建议明显减肥

当前包含：

```text
server.warmup
manualChunks
chunkSizeWarningLimit
optimizeDeps.include
preprocessorMaxWorkers
production pure console.log
```

这些不一定错，但不建议成为“开发模板默认配置”。

Vite 默认行为已经足够适合绝大多数后台项目。

---

## 推荐基础 vite.config.ts 只保留

```text
base
alias
server port
proxy
vue plugin
UnoCSS
AutoImport
Components
SvgComponent（如果确实需要）
Vitest config
```

只有出现实际性能问题时，再增加：

```text
manualChunks
warmup
optimizeDeps
```

### 原则

> 配置也属于需要 AI 理解和维护的代码。

越少越好。

---

# 18. tsconfig 也可以删掉几个不必要的选项

当前例如：

```json
"experimentalDecorators": true,
"allowJs": true,
"importHelpers": true,
"sourceMap": true
```

如果项目没有实际使用：

- decorator；
- src 下 JS；
- TS emit；

这些可以删除。

建议保留核心：

```json
{
  "strict": true,
  "noEmit": true,
  "moduleResolution": "bundler",
  "resolveJsonModule": true,
  "isolatedModules": true,
  "skipLibCheck": true
}
```

不要为“可能有一天用到”预先配置。

---

# 19. 自动导入建议收窄

当前 AutoImport 包含：

```text
vue
vue-router
pinia
@vueuse/core
element-plus message APIs
```

我建议：

### 保留自动导入

```text
vue
vue-router
pinia
ElMessage
ElMessageBox
ElNotification
```

### 不建议全量自动导入

```text
@vueuse/core
```

原因：

VueUse API 很多。

如果代码突然出现：

```ts
useDebounceFn()
useFullscreen()
useStorage()
```

开发者不一定知道它来自哪里。

第三方工具显式 import 更清楚：

```ts
import { useFullscreen } from "@vueuse/core"
```

多一行代码，但降低隐式依赖。

---

# 20. 依赖可以进一步缩减

当前实际代码里：

### `dayjs`

没有找到使用。

建议直接移除。

---

### `mitt`

只用于自定义 `useRouteListener`。

如果按前面的建议删除 Route Event Bus，则一起移除。

---

### `@vueuse/core`

目前主要用于 Screenfull。

如果 Screenfull 变成可选功能，可以从基础模板删除。

真正需要时再安装。

---

### `lodash-es`

当前用于：

```text
axios get / merge
watermark debounce
router cloneDeep / omit
CRUD cloneDeep
```

如果按本文建议简化：

- request 不 deep merge；
- 删除三级 route flatten；
- 简单 form 不 cloneDeep；
- watermark 变成可选；

那么基础模板甚至可能不再需要 `lodash-es`。

---

# 21. 图标系统建议只定义一条主路径

现在同时存在：

```text
UnoCSS Iconify
unplugin-svg-component
本地 SVG
```

可以共存，但一定要告诉 AI：

### 默认

普通 UI 图标：

```text
i-ep-*
i-fa-solid-*
```

### 只有项目专属图标

使用：

```text
src/assets/icons/*.svg
```

不要让 AI 同一个项目里随机选择：

```text
Element Plus Icon Component
Iconify
本地 SVG
图片 PNG
```

---

# 22. 建议调整目录结构

你现在的目录其实可以继续使用。

但如果这是一个面向 AI 的新模板，我会更推荐标准、扁平一点的结构：

```text
src/
├─ api/
│  ├─ request.ts
│  ├─ auth.ts
│  ├─ article.ts
│  └─ types/
│
├─ assets/
│  ├─ icons/
│  ├─ images/
│  └─ styles/
│
├─ components/
│  ├─ AppDialog/
│  ├─ AppPagination/
│  └─ AppTable/
│
├─ composables/
├─ constants/
├─ layouts/
├─ pages/
├─ router/
├─ stores/
├─ utils/
│
├─ App.vue
└─ main.ts
```

---

## 为什么我更推荐这个结构

因为 AI 对下面这些目录名的训练数据非常多：

```text
api
components
pages
router
stores
utils
```

不需要额外解释：

```text
@@ 是 common
pinia 目录其实是 stores
http 目录和 apis 又是什么关系
```

---

## `@@` alias 是否要保留？

现在：

```text
@  → src
@@ → src/common
```

它确实能少写几个字符。

但为了节省几个字符引入了一个项目私有概念。

我的建议是只保留：

```text
@ → src
```

然后：

```ts
import { request } from "@/api/request"
import AppTable from "@/components/AppTable/index.vue"
```

对 AI 和人都更标准。

这属于 **P2 优化**，不是必须马上改。

---

# 23. Pinia 的规则建议更简单

当前 Store Skill 有很多细节：

```text
每个 state 注释
箭头函数 action
outside function
region
watch / watchEffect 选择
缓存 key 规则
```

这些规则太细会导致 AI 把注意力花在“格式正确”而不是“业务正确”。

---

## 推荐 Store 只保留 5 条规则

1. **只有跨页面共享状态才建 Store。**
2. 页面内部状态留在页面，不进 Pinia。
3. 使用 Setup Store。
4. 持久化只有用户明确需要时才加。
5. Store 不负责 UI Message / Dialog。

---

## `useXxxStoreOutside()` 不要强制所有 Store 都生成

当前 Skill 要求：

```text
必须导出 useXxxStoreOutside
```

其实只有：

```text
router guard
axios interceptor
setup 外部模块
```

才需要。

普通业务 Store 没必要每个都生成一个未使用函数。

改成：

> 只有确实需要在 setup 外使用时才添加 `useXxxStoreOutside()`。

这样更符合“按需生成”。

---

# 24. 测试规则也不要过度设计

当前已经有 Vitest，可以保留。

但建议告诉 AI：

### 默认需要测试

```text
纯工具函数
复杂数据转换
核心业务计算
权限判断
容易产生边界问题的逻辑
```

### 默认不要求

```text
普通 CRUD 页面
纯展示组件
简单 Element Plus 包装
```

不要 AI 每生成一个列表页，就额外生成一堆低价值测试。

---

# 25. `dist` 不应该放进模板压缩包

项目 `.gitignore` 已经写了：

```text
dist
```

但这次模板 zip 里仍然带了 `dist`。

当前 `dist` 大约：

```text
1.8 MB
25 个文件
```

建议发布模板 zip 时自动排除：

```text
dist
node_modules
coverage
*.log
```

这些文件对 AI 理解源码没有价值，还容易被错误搜索到。

---

# 26. AI 最重要的“少 Token”规则

真正节省 Token，不只是代码少。

更重要的是：

> **让 AI 为完成一个任务需要阅读的文件更少。**

我建议加入下面这些规则。

---

## 26.1 最小上下文原则

AI 修改页面时默认只读取：

```text
AGENTS.md
目标页面
对应 API
对应类型
最多一个相似页面
```

不要为了新增一个字段去扫描整个项目。

---

## 26.2 最小修改范围

普通需求优先只修改：

```text
1～3 个文件
```

除非需求本身确实跨模块。

不要因为一个按钮新增：

```text
composable
utility
constant
store
component
index barrel
```

---

## 26.3 三次复用原则

一个逻辑满足下面之一才考虑抽象：

```text
已经重复 3 次
明显属于稳定公共能力
复杂到独立后反而更容易理解
```

否则留在当前文件。

---

## 26.4 一跳可读原则

业务页面最好最多：

```text
Page
 ↓
API / Store / Component
```

不要默认形成：

```text
Page
 ↓
Schema
 ↓
Dispatcher
 ↓
Registry
 ↓
Wrapper
 ↓
Component
```

---

## 26.5 不为未来需求设计

AI 禁止主动增加：

```text
插件系统
registry
factory
adapter
strategy
repository
service 层
event bus
抽象基类
复杂泛型
通用配置中心
```

除非当前需求明确需要。

---

# 27. 推荐 AI 代码复杂度规则

建议写进 `AGENTS.md`：

### 函数

- 一个函数只负责一件事；
- 普通函数尽量控制在约 30～50 行以内；
- 不为了达到行数限制机械拆函数。

### 页面

- 普通 CRUD 优先单文件；
- 一个页面 200～350 行并不可怕，只要逻辑清晰；
- 不因为“超过 200 行”就自动拆 5 个组件。

### 组件拆分

只有下面情况拆：

1. 会复用；
2. 有独立交互状态；
3. 是明显独立的 UI 区域；
4. 拆完能降低理解难度。

否则不要拆。

---

# 28. 推荐的代码风格

## Vue 文件顺序

统一：

```vue
<script setup lang="ts">
</script>

<template>
</template>

<style scoped lang="scss">
</style>
```

当前 ESLint 已经有类似约束，可以继续。

---

## Script 内部顺序

推荐：

```text
1. type imports
2. runtime imports
3. defineOptions / props / emits
4. store / router
5. constants
6. state
7. computed
8. functions
9. watch
10. lifecycle
```

不要做更多细粒度规定。

---

# 29. 推荐的新业务页面默认写法

对于普通 CRUD，我反而建议让 AI 生成非常普通的 Vue。

例如：

```vue
<script setup lang="ts">
import type { ArticleItem, ArticleQuery, ArticleSaveInput } from "@/api/types/article"
import { createArticle, deleteArticle, getArticlePage, updateArticle } from "@/api/article"

const loading = ref(false)
const list = ref<ArticleItem[]>([])

const query = reactive<ArticleQuery>({
  title: "",
  status: ""
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const dialogVisible = ref(false)

const form = reactive<ArticleSaveInput>({
  title: "",
  status: "draft",
  author: ""
})

async function loadList() {
  loading.value = true
  try {
    const data = await getArticlePage({
      ...query,
      page: pagination.page,
      size: pagination.size
    })
    list.value = data.records
    pagination.total = data.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadList()
}

onMounted(loadList)
</script>
```

特点：

- 没有额外 composable；
- 没有 page service；
- 没有 repository；
- 没有 registry；
- 没有复杂 mapper；
- 打开页面就能知道数据从哪里来。

这才比较符合你的目标。

---

# 30. 推荐直接替换成下面这版 AGENTS.md

下面这版我更推荐作为“AI 每次必须读取”的核心规则。

```md
# AGENTS.md

## 目标

本项目优先保证：代码简单、容易阅读、容易维护、修改范围小。
不要为了复用、扩展性或未来需求增加当前不需要的抽象。

## 技术栈

Vue 3 + Vite + TypeScript + Element Plus + Pinia + Vue Router + UnoCSS。

## 基本原则

- 用最少的代码完成当前需求。
- 不添加用户未要求的功能。
- 不为未来可能出现的需求提前设计。
- 优先使用 Vue / Vue Router / Pinia / Element Plus 原生能力。
- 优先修改已有文件，不因为小需求创建大量新文件。
- 普通业务逻辑保持直接，不引入 Factory / Strategy / Registry / Repository / EventBus 等模式。
- 同一逻辑实际重复 3 次后再考虑抽象。

## AI 执行规则

- 开始编码前先阅读目标文件和直接依赖，不扫描整个仓库。
- 优先参考 1 个最相似页面，不同时模仿多个实现。
- 普通需求尽量控制在 1～3 个文件内完成。
- 信息足够时直接实现，不为了非关键细节反复提问。
- 需求存在小范围歧义时采用项目现有默认写法。
- 完成后至少检查 TypeScript 类型和明显的 lint 问题。

## 目录

- `src/pages`：业务页面。
- `src/components`：真正跨页面复用的组件。
- `src/api`：请求函数与 API 契约类型。
- `src/stores`：跨页面共享状态。
- `src/composables`：真正复用的组合逻辑。
- `src/utils`：无业务状态的纯工具函数。
- `src/router`：路由配置与守卫。
- `src/layouts`：后台壳层布局。

页面私有代码优先放在页面目录，不要提前提升为全局能力。

## Vue

- 统一使用 `<script setup lang="ts">`。
- 简单 CRUD 优先保持单文件，不机械拆组件。
- 只有可复用、独立交互或明显独立 UI 区域才拆组件。
- 派生状态使用 `computed`；静态配置不要为了形式写成 `computed`。
- 能用普通函数解决就不要创建 composable。
- 能用 Vue slot 解决就不要创建 renderer / registry 系统。

## TypeScript

- 保持 strict。
- 业务代码禁止 `any`；第三方类型确实无法表达时仅允许局部使用。
- 类型导入使用 `import type`。
- 对象结构优先 `interface`；联合类型和工具类型使用 `type`。
- 不使用无意义的复杂泛型。
- 不为一个简单类型单独创建文件。
- API DTO 放 `src/api/types`，页面类型不能被 API 层反向引用。

## 表单

- 普通表单优先直接使用 Element Plus。
- 表单字段与后端 payload 一致时直接提交表单对象。
- 只有需要字段转换时才额外创建 submit payload。
- 简单一级对象复制使用 `{ ...obj }`，不默认使用 deep clone。

## 表格

- 普通列表可以使用统一 Table 组件处理 columns / loading / pagination。
- 特殊单元格优先使用 slot。
- 不新增 column registry / renderer plugin，除非需求明确需要动态注册。

## API

- 页面只能依赖 API，API 禁止依赖页面。
- request 层负责 Token、响应解包和通用错误处理。
- API 函数尽量直接返回业务数据，不把 AxiosResponse 暴露给页面。
- 通用错误已由 request 层提示时，页面不要重复 catch + message。

## Pinia

- 只有跨页面共享的状态才进入 Pinia。
- 页面局部状态留在页面。
- 使用 Setup Store。
- 只有确实需要 setup 外访问时才创建 `useXxxStoreOutside()`。
- 持久化只有当前需求明确需要时才添加。

## 样式

- UnoCSS 负责布局、间距、尺寸和简单样式。
- SCSS 只处理复杂样式、伪元素、动画和 Element Plus 覆盖。
- 同一个简单样式不要同时用 UnoCSS 和 SCSS 实现。
- 不主动增加复杂动画、渐变、装饰和过度视觉设计。

## 禁止默认生成

除非需求明确需要，否则不要新增：

- Service 层
- Repository 层
- Factory
- Strategy
- Registry
- Event Bus
- 全局 Store
- 全局 Composable
- 通用 Base Component
- 复杂泛型工具类型
- 大型配置驱动框架
- 为未来功能预留的代码

## 验证

常用命令：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

普通页面修改优先保证 `typecheck` 和 `lint` 通过。
```

---

# 31. 我建议最终保留的“AI 规则架构”

```text
AGENTS.md
│
├─ 负责所有项目通用规则
│  - 简单原则
│  - TS
│  - Vue
│  - API
│  - Store
│  - Style
│
└─ .agents/skills/
   ├─ page/SKILL.md
   ├─ route/SKILL.md
   └─ store/SKILL.md
```

不要再建立：

```text
AGENTS.md
.cursor/rules/*
.agents/skills/ts
.agents/skills/utils
.agents/skills/composables
.agents/skills/components
```

多套规则系统。

### 核心原则

> **全局规则只有一个真相来源：AGENTS.md。**

Skill 只描述“某个任务怎么执行”，不再重复编码规范。

---

# 32. 推荐的模板层级

如果是我来维护这个模板，我会分成两层。

## Core Template

默认包含：

```text
Vue
Vite
TypeScript
Element Plus
Router
Pinia
Axios
UnoCSS
基础 Layout
认证
权限
基础 Table
基础 Dialog
API 示例
一个简单 CRUD 示例
AGENTS.md
3 个短 Skill
```

---

## Optional Recipes

按需复制：

```text
TagsView
Screenfull
Watermark
Theme Settings
Grey Mode
Color Weakness
复杂动态表单
动态 Table Renderer
三级 Route Cache
复杂报告页
```

这能明显减少：

- 项目初始代码；
- AI 搜索范围；
- 默认依赖；
- 规则数量；
- 新人理解成本。

---

# 33. 实际修改顺序

不要一次把整个模板推翻。

推荐按下面顺序改。

## 第一阶段：马上改

- [ ] 删除 Skill 中不存在的 `.cursor/rules` 引用
- [ ] 把 TS 核心规则合并进 `AGENTS.md`
- [ ] 合并 `v3-create-crud` + `v3-generate-page`
- [ ] 把 `v3-use-utils` / `v3-use-composables` 移到 docs
- [ ] 修复 `common/apis/demo-article.ts` 依赖 Page types
- [ ] 删除 `dayjs` 未使用依赖
- [ ] 发布模板时排除 `dist`

---

## 第二阶段：降低抽象

- [ ] CustomForm 不再作为普通 CRUD 强制方案
- [ ] 普通 Form 默认直接 Element Plus
- [ ] CustomTable 删除 registry
- [ ] 特殊 Table cell 改 slot
- [ ] 普通 form 不使用 `cloneDeep`
- [ ] 静态 schema / columns 不滥用 computed

---

## 第三阶段：删除默认高级功能

- [ ] 删除 `thirdLevelRouteCache`
- [ ] 删除复杂 route flatten
- [ ] 删除 `mitt` Route Event Bus
- [ ] Settings / RightPanel 变成可选
- [ ] Watermark 变成可选
- [ ] Grey / ColorWeakness 变成可选
- [ ] Screenfull 变成可选

---

## 第四阶段：配置减肥

- [ ] 精简 `vite.config.ts`
- [ ] 精简 `tsconfig.json`
- [ ] 收窄 AutoImport
- [ ] 关闭 UnoCSS Attributify
- [ ] 统一 UnoCSS / SCSS 职责
- [ ] 将 Element Plus 全局样式改为中性样式

---

# 34. 最终评价

如果按“传统 Admin Template”评价，你现在这套模板功能是比较完整的。

但如果按你真正想要的：

> **“专门给 AI 生成项目代码，同时人很好维护的模板”**

我认为最需要改变的是思路：

### 现在更像

```text
AI → 学习你的框架 → 按框架生成代码
```

### 更推荐变成

```text
AI → 使用 Vue / Element Plus 原生写法 → 遵守少量项目规则
```

前者的优势是统一，但代价是：

- AI 必须先理解模板；
- Token 更多；
- 抽象层更多；
- 调试需要跳更多文件；
- 模板作者自己容易继续“造框架”。

后者更适合你现在描述的目标：

- 快；
- 简单；
- 好读；
- 好改；
- 少 Token；
- AI 不容易过度设计。

---

# 35. 一句话版原则

以后这个模板每增加一个公共能力，都先问一句：

> **“这个东西是让业务代码更简单，还是只是把复杂度藏到了模板里面？”**

如果只是把复杂度藏起来，就不要加。

