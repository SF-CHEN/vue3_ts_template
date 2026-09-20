/**
 * [INPUT]: 由 OpenAPI 的 early-warning paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 early-warning 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelEarlyWarningParams, DeleteOneEarlyWarningParams, EarlyWarning, ExportEarlyWarningParams, GetDetailByIdEarlyWarningParams, HandleEarlyWarningSo, PageEarlyWarning, PageQuerySo, StartEarlyWarningSo } from "./types/early-warning"
import { request } from "@@/apis/request"

/* <generated> */
// 修改预警事件
export function updateEarlyWarning(data: EarlyWarning): Promise<boolean> {
  return request<boolean>({
    url: `/early-warning/update`,
    method: "PUT",
    data
  })
}

// 开始执行预警检测任务
export function startTaskEarlyWarning(data: StartEarlyWarningSo): Promise<void> {
  return request<void>({
    url: `/early-warning/startTask`,
    method: "POST",
    data
  })
}

// 分页查询预警事件
export function pageEarlyWarning(data: PageQuerySo): Promise<PageEarlyWarning> {
  return request<PageEarlyWarning>({
    url: `/early-warning/page`,
    method: "POST",
    data
  })
}

// 处置预警事件
export function handleEarlyWarning(data: HandleEarlyWarningSo): Promise<void> {
  return request<void>({
    url: `/early-warning/handle`,
    method: "POST",
    data
  })
}

// 新增预警事件
export function addEarlyWarning(data: EarlyWarning): Promise<EarlyWarning> {
  return request<EarlyWarning>({
    url: `/early-warning/add`,
    method: "POST",
    data
  })
}

// 获取预警事件
export function getDetailByIdEarlyWarning(params: GetDetailByIdEarlyWarningParams): Promise<EarlyWarning> {
  return request<EarlyWarning>({
    url: `/early-warning/getDetailById`,
    method: "GET",
    params
  })
}

// 导出预警事件
export function exportEarlyWarning(params: ExportEarlyWarningParams): Promise<string> {
  return request<string>({
    url: `/early-warning/export`,
    method: "GET",
    params
  })
}

// 删除预警事件
export function deleteOneEarlyWarning(params: DeleteOneEarlyWarningParams): Promise<boolean> {
  return request<boolean>({
    url: `/early-warning/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除预警事件
export function batchDelEarlyWarning(params: BatchDelEarlyWarningParams): Promise<boolean> {
  return request<boolean>({
    url: `/early-warning/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
