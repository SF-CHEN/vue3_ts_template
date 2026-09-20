/**
 * [INPUT]: 由 OpenAPI 的 hello paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 hello 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import { request } from "@@/apis/request"

/* <generated> */
// 你好
export function hello(): Promise<string> {
  return request<string>({
    url: `/hello/`,
    method: "GET"
  })
}
/* </generated> */
