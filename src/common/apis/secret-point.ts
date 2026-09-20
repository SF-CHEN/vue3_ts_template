/**
 * [INPUT]: 由 OpenAPI 的 secret-point paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 secret-point 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelSecretPointParams, DeleteOneSecretPointParams, GetDetailByIdSecretPointParams, PageQuerySo, PageSecretPoint, SecretPoint, StartTaskSecretPointSo } from "./types/secret-point"
import { request } from "@@/apis/request"

/* <generated> */
// 修改密点标注与复核表
export function updateSecretPoint(data: SecretPoint): Promise<boolean> {
  return request<boolean>({
    url: `/secret-point/update`,
    method: "PUT",
    data
  })
}

// 开始执行密点检测任务
export function startTaskSecretPoint(data: StartTaskSecretPointSo): Promise<void> {
  return request<void>({
    url: `/secret-point/startTask`,
    method: "POST",
    data
  })
}

// 分页查询密点标注与复核表
export function pageSecretPoint(data: PageQuerySo): Promise<PageSecretPoint> {
  return request<PageSecretPoint>({
    url: `/secret-point/page`,
    method: "POST",
    data
  })
}

// 新增密点标注与复核表
export function addSecretPoint(data: SecretPoint): Promise<SecretPoint> {
  return request<SecretPoint>({
    url: `/secret-point/add`,
    method: "POST",
    data
  })
}

// 获取密点标注与复核表
export function getDetailByIdSecretPoint(params: GetDetailByIdSecretPointParams): Promise<SecretPoint> {
  return request<SecretPoint>({
    url: `/secret-point/getDetailById`,
    method: "GET",
    params
  })
}

// 删除密点标注与复核表
export function deleteOneSecretPoint(params: DeleteOneSecretPointParams): Promise<boolean> {
  return request<boolean>({
    url: `/secret-point/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除密点标注与复核表
export function batchDelSecretPoint(params: BatchDelSecretPointParams): Promise<boolean> {
  return request<boolean>({
    url: `/secret-point/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
