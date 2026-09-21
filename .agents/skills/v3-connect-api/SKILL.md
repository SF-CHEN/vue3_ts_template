---
name: v3-connect-api
description: Connect, add, or modify backend APIs in this Vue 3 repository, including Swagger/OpenAPI generation, handwritten APIs, uploads, downloads, response envelopes, auth/proxy adaptation, and API contract types.
---

# Vue3 接口对接

## 执行顺序

1. 读 `AGENTS.md` 和 `docs/PROJECT_MAP.md`。
2. 判断接口来自 Swagger/OpenAPI、手写接口还是特殊协议。
3. 优先复用 `src/common/apis/request.ts`，不要创建第二个 Axios 实例。
4. 完成后检查生成区、特殊接口和页面调用边界。

## Swagger / OpenAPI

普通接口优先执行：

```bash
pnpm api:generate
```

生成位置和 `<generated>` / `@keep` 规则见 `docs/API_GENERATE.md`。

生成后重点检查：

- `multipart/form-data` 上传。
- Blob / ArrayBuffer / PDF / ZIP 等二进制下载。
- 与项目默认 `{ code, data, message }` 不一致的特殊响应。

少量特殊接口直接修正对应 API 函数，并按生成器约定使用 `// @keep` 保留；只有大量接口出现同一种稳定模式时才修改生成器。

没有 Swagger 或需要局部适配时：

```text
src/common/apis/<module>.ts
src/common/apis/types/<module>.ts
```

API 层不得反向引用页面。

## Request 约定

统一请求层：

```text
src/common/apis/request.ts
```

`request<T>()` 已负责 Token、响应解包、通用错误和二进制响应，直接返回 `Promise<T>`：

```ts
export function fetchUser(id: number) {
  return request<User>({
    url: `/users/${id}`,
    method: "get"
  })
}
```

约定：

- GET 查询参数用 `params`。
- POST / PUT / PATCH 请求体用 `data`。
- 页面不要直接调用 Axios，也不要再写 `res.data.data`。
- 单接口兼容逻辑留在该 API 模块，不污染全局 request。

## 上传

FormData、Axios 配置和上传进度转换放 API 层：

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

关键规则：

- 不手动设置 `Content-Type: multipart/form-data`，让浏览器生成 boundary。
- 不把 `AxiosProgressEvent` 暴露给页面。
- 页面只维护选择文件、loading、progress 等 UI 状态。

## 下载

API 只声明二进制响应：

```ts
export function downloadFile(id: number) {
  return request<Blob>({
    url: `/files/${id}/download`,
    method: "get",
    responseType: "blob"
  })
}
```

创建 Object URL、`<a>`、触发保存属于页面/UI 边界，不放进 API 层。

## 什么时候修改全局 request

只有全项目协议变化时才修改 `src/common/apis/request.ts`，例如：

- Token 协议变化。
- 全局响应 envelope / 成功码变化。
- 全局错误策略变化。

单个接口特殊格式只做局部适配。

## 完成前检查

- 页面是否只依赖 API 函数？
- 是否复用了现有 `request<T>()`？
- Swagger 特殊接口是否检查并按需 `@keep`？
- 上传是否没有手动 multipart boundary？
- 下载 API 是否只返回 Blob / ArrayBuffer？
- 是否错误修改了全局 request 来兼容单一接口？
