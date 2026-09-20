# OpenAPI 接口生成说明

用 `pnpm api:generate` 根据 Swagger / OpenAPI 生成请求函数、契约类型和枚举选项。生成结果给页面直接调用，不要再包一层 service。

```bash
pnpm api:generate
# 或临时指定文档地址
pnpm api:generate -- --url=http://localhost:8080/v3/api-docs
```

文档地址默认读 `.env` 的 `SWAGGER_URL`，拉取后缓存为 `script/api.json`。

## 生成位置

| 文件                                | 覆盖范围                                                       |
| ----------------------------------- | -------------------------------------------------------------- |
| `src/common/apis/<module>.ts`       | 请求函数。`<generated>` 内会被覆盖；`@keep` 和标记外代码会保留 |
| `src/common/apis/types/<module>.ts` | 契约类型。**整文件覆盖**，不要手改                             |
| `src/common/constants/enums.ts`     | 枚举常量和联合类型                                             |
| `src/common/constants/options.ts`   | 下拉选项。非空 `label` 会按 `value` 保留                       |
| `src/common/constants/registry.ts`  | `Enum` / `Options` 聚合入口                                    |

每个生成文件顶部有 `[INPUT]` / `[OUTPUT]` / `[POS]` 注释，说明来源、对外能力和存放位置。

## `<generated>` 标记

自动生成的函数写在这对标记之间：

```ts
/* <generated> */
export function pageSysUser(data: PageQuerySo): Promise<PageSysUser> {
  return request<PageSysUser>({ url: "/sys-user/page", method: "POST", data })
}
/* </generated> */
```

规则：

- 标记**里面**的内容下次生成会被替换。
- 标记**下面**可以手写扩展，不会被覆盖。
- 标记**上面**也可以保留自定义 import 和辅助函数（例如密码 MD5）。
- 文件里如果**没有** `<generated>` 标记，生成器会当成手写模块并跳过，避免覆盖 `demo-article` 这类文件。

`enums.ts` / `options.ts` / `registry.ts` 同样使用这对标记；自定义枚举或选项写在 `</generated>` 下方。

## `@keep`

某个生成函数需要改实现（上传 FormData、密码加密、特殊 `responseType`）时，在函数上方加：

```ts
// @keep
export function uploadPublic(file: File, onProgress?: (percent: number) => void): Promise<UploadFile> {
  const data = new FormData()
  data.append("file", file)
  return request<UploadFile>({ url: "/public/upload", method: "POST", data })
}
```

下次 `pnpm api:generate` 会保留这个函数，不再改回 Swagger 原文。

只对少数特殊接口用 `@keep`。同类问题大量出现时，再改 `script/generate-api.cjs`。

不要在 `@keep` 函数里写页面逻辑；页面仍然只调用 API 函数。

## options 的中文 label

`options.ts` 里每一项是 `{ label, value }`。

1. **首次生成**：从 OpenAPI 字段描述里解析 `VALUE(中文)`，例如 `PENDING(待处理)`，写入 `label`。
2. **以后再生成**：只要该 `value` 上已有**非空** `label`，一律保留，不会被文档里的新中文覆盖。
3. **想重新吃文档中文**：把该项 `label` 改回 `''`，再生成一次。
4. 描述里没有 `VALUE(中文)` 的枚举，`label` 保持空字符串，可手填；手填后同样会被保留。
5. 完全自定义的选项数组写在 `options.ts` 的 `</generated>` 下方，会自动合并进 `registry.ts` 的 `Options`。

页面使用示例：

```ts
import { SYS_USER_USER_ROLE_OPTIONS } from "@@/constants/options"
import { Options } from "@@/constants/registry"

SYS_USER_USER_ROLE_OPTIONS
Options.sysUserUserRole
```

## 页面怎么用

```ts
import { pageSysUser } from "@@/apis/sys-user"
import type { SysUser } from "@@/apis/types/sys-user"

const res = await pageSysUser({
  pageCurrent: 1,
  pageSize: 10,
  entity: { username }
})
```

`request<T>()` 已经解包 `{ code, data, message }`，页面拿到的就是业务数据。不要再 `.then(res => res.data)`。
