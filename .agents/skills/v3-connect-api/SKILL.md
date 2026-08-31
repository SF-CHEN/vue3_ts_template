---
name: v3-connect-api
description: Connect, add, or modify backend APIs in this Vue 3 repository, including Swagger/OpenAPI generation, handwritten request modules, auth adapters, proxy settings, response envelopes, uploads, downloads, and API contract types.
---

# Vue3 接口对接

## 目标

让页面只面对清晰的业务数据和类型，不在页面里拼 Axios 配置、响应包或后端兼容逻辑。

## 先判断接口来源

### 有 Swagger / OpenAPI

普通 JSON 接口优先使用现有生成器：

```bash
pnpm api:generate
```

生成位置：

- `src/common/apis/<module>.ts`
- `src/common/apis/types/<module>.ts`
- `src/common/constants/enums.ts`
- `src/common/constants/options.ts`
- `src/common/constants/registry.ts`

生成器默认面向 JSON 请求与 `{ code, data, message }` 响应模型。生成后要检查 OpenAPI 中是否存在：

- `multipart/form-data` 上传。
- `application/octet-stream`、PDF、ZIP、图片等二进制下载。
- 单接口特殊响应协议。

这些接口不要机械照搬生成结果。若只需要修正少数生成函数，可以修改该函数并在函数上方加：

```ts
// @keep
```

后续再次执行 `pnpm api:generate` 时，该函数会被保留。

不要为了少数特殊接口把整个 Swagger 生成器扩成复杂客户端；只有大量接口都出现同一种稳定模式时才修改 `script/generate-api.cjs`。

### 没有 Swagger / 特殊适配接口

在 `src/common/apis/<module>.ts` 手写请求。契约类型优先放 `src/common/apis/types/<module>.ts`；不要让 API 层引用 `src/pages`。

## 项目请求约定

`src/http/axios.ts` 已统一处理：

- `VITE_BASE_URL`
- Bearer Token
- `{ code, data, message }` 解包
- `blob` / `arraybuffer` 原始响应
- 通用 HTTP / 业务错误提示
- 401 会话失效

因此 API 默认写法是：

```ts
export function fetchUser(id: number) {
  return request<User>({
    url: `/users/${id}`,
    method: "get"
  })
}
```

`request<T>()` 直接返回 `Promise<T>`。

## 禁止写法

不要：

```ts
request<ApiResponseData<User>>(...).then(res => res.data)
```

不要在页面：

```ts
axios.get(...)
```

不要为了上传 / 下载单独创建第二个 Axios 实例。
不要为了每个模块创建 `service / repository / adapter` 中间层。

## 参数约定

- GET 查询参数使用 `params`。
- POST / PUT / PATCH 请求体使用 `data`。
- 页面字段与后端 DTO 一致时直接传对象，不重复重新赋值。
- 只有字段名、格式或语义确实不同才创建 payload 转换。

## 文件上传

`FormData`、Axios 上传配置和进度事件都属于 API 层。

推荐：

```ts
export function uploadFile(file: File, onProgress?: (percent: number) => void) {
  const data = new FormData()
  data.append("file", file)

  return request<UploadedFile>({
    url: "/files",
    method: "post",
    data,
    onUploadProgress(event) {
      if (!event.total) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    }
  })
}
```

规则：

- 不在页面创建 `FormData` 后再拼 Axios 配置。
- 不把 `AxiosProgressEvent` 暴露给页面，API 映射成简单百分比或业务需要的数据。
- 不手动设置 `Content-Type: multipart/form-data`；让浏览器 / Axios 自动生成 boundary。
- 上传 loading / progress 展示属于页面状态，不需要 Pinia。
- Swagger 生成器不会替你完成 FormData 组装；生成到 multipart 接口时按真实字段修正该 API 函数，并用 `// @keep` 保留。

## 文件下载

API 层负责声明 Blob 响应：

```ts
export function downloadFile(id: number) {
  return request<Blob>({
    url: `/files/${id}/download`,
    method: "get",
    responseType: "blob"
  })
}
```

浏览器保存文件属于 UI 边界：

```ts
const blob = await downloadFile(id)
const url = URL.createObjectURL(blob)
```

- API 默认只返回 `Blob`，不要在 API 层操作 DOM、创建 `<a>` 或触发点击。
- 保存文件逻辑只出现一次时可以留在页面局部函数。
- 相同保存逻辑实际出现至少 3 次后，再考虑提取通用 util。
- `blob` / `arraybuffer` 继续使用现有 `request<T>()`，不要新建 Axios 客户端。
- Swagger 二进制接口要显式补 `responseType: "blob"` 或 `"arraybuffer"`，并用 `// @keep` 保留特殊实现。

## 错误处理

request 层已显示通用错误时，页面默认只需要：

```ts
try {
  await saveUser(form)
  ElMessage.success("保存成功")
} catch {
  return
}
```

只有业务明确需要识别某个错误码时，才增加特殊分支。

不要在 API 和页面重复 `ElMessage.error`。

对于 Blob / ArrayBuffer 下载，推荐后端在失败时返回非 2xx HTTP 状态；如果某个后端固定使用 HTTP 200 + JSON 错误包，则只对该下载接口做局部兼容，不默认增加全局二进制 JSON 解析逻辑。

## 真实后端接入

常见接入顺序：

1. `.env.development` 配置 `DEV_PROXY_TARGET`。
2. 设置 `VITE_USE_MOCK=false`。
3. 配置 `SWAGGER_URL` 并执行 `pnpm api:generate`。
4. 检查 multipart、二进制和特殊响应接口，必要时用 `// @keep` 修正生成函数。
5. 修改必要的手写适配接口，例如 `src/common/apis/auth.ts`。
6. 只有后端全局响应包不是 `{ code, data, message }` 时才修改 `src/http/axios.ts`。

`VITE_*` 只放浏览器可公开读取的信息。不要把密钥、内网凭证放入前端环境变量。

## 修改 Axios 的门槛

只有以下情况才修改 `src/http/axios.ts`：

- 全项目 Token 协议变化。
- 全项目响应 envelope 变化。
- 全项目业务成功码变化。
- 全项目错误处理策略变化。

单个接口的特殊格式在该 API 模块局部处理，不污染全局 request 层。

## 完成检查

- 页面是否只依赖 API 函数，而不是 Axios？
- API 是否没有反向依赖页面？
- 是否复用了 `request<T>()` 的 data 解包 / Blob 能力？
- 上传是否没有手动设置 multipart boundary？
- Axios 上传进度事件是否被转换成页面需要的简单数据？
- 下载 API 是否只返回 Blob，不操作 DOM？
- Swagger 的 multipart / 二进制接口是否已检查并用 `// @keep` 保留必要适配？
- 是否重复创建了 response wrapper 或 Axios 实例？
- 是否只修改了真正需要的接口层？
- 是否通过 ESLint / TypeScript；生成器有改动时是否执行相关生成验证？
