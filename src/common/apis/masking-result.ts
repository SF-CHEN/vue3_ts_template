/**
 * [INPUT]: 由 OpenAPI 的 masking-result paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 masking-result 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelMaskingResultParams, DeleteOneMaskingResultParams, GetDetailByIdMaskingResultParams, MaskingResult, PageMaskingResult, PageQuerySo, StartMaskingSo } from "./types/masking-result"
import { request } from "@@/apis/request"

/* <generated> */
// 修改脱敏结果记录表
export function updateMaskingResult(data: MaskingResult): Promise<boolean> {
  return request<boolean>({
    url: `/masking-result/update`,
    method: "PUT",
    data
  })
}

// 开始执行脱敏任务
export function startTaskMaskingResult(data: StartMaskingSo): Promise<void> {
  return request<void>({
    url: `/masking-result/startTask`,
    method: "POST",
    data
  })
}

// 分页查询脱敏结果记录表
export function pageMaskingResult(data: PageQuerySo): Promise<PageMaskingResult> {
  return request<PageMaskingResult>({
    url: `/masking-result/page`,
    method: "POST",
    data
  })
}

// 新增脱敏结果记录表
export function addMaskingResult(data: MaskingResult): Promise<MaskingResult> {
  return request<MaskingResult>({
    url: `/masking-result/add`,
    method: "POST",
    data
  })
}

// 获取脱敏结果记录表
export function getDetailByIdMaskingResult(params: GetDetailByIdMaskingResultParams): Promise<MaskingResult> {
  return request<MaskingResult>({
    url: `/masking-result/getDetailById`,
    method: "GET",
    params
  })
}

// 删除脱敏结果记录表
export function deleteOneMaskingResult(params: DeleteOneMaskingResultParams): Promise<boolean> {
  return request<boolean>({
    url: `/masking-result/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除脱敏结果记录表
export function batchDelMaskingResult(params: BatchDelMaskingResultParams): Promise<boolean> {
  return request<boolean>({
    url: `/masking-result/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
