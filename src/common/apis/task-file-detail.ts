/**
 * [INPUT]: 由 OpenAPI 的 task-file-detail paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 task-file-detail 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelTaskFileDetailParams, DeleteOneTaskFileDetailParams, GetDetailByIdTaskFileDetailParams, PageQuerySo, PageTaskFileDetail, StartTaskFileDetailSo, TaskFileDetail } from "./types/task-file-detail"
import { request } from "@@/apis/request"

/* <generated> */
// 修改文件解析详情表 (支持一对多)
export function updateTaskFileDetail(data: TaskFileDetail): Promise<boolean> {
  return request<boolean>({
    url: `/task-file-detail/update`,
    method: "PUT",
    data
  })
}

// ���始执行文件解析
export function startTaskTaskFileDetail(data: StartTaskFileDetailSo): Promise<void> {
  return request<void>({
    url: `/task-file-detail/startTask`,
    method: "POST",
    data
  })
}

// 分页查询文件解析详情表 (支持一对多)
export function pageTaskFileDetail(data: PageQuerySo): Promise<PageTaskFileDetail> {
  return request<PageTaskFileDetail>({
    url: `/task-file-detail/page`,
    method: "POST",
    data
  })
}

// 新增文件解析详情表 (支持一对多)
export function addTaskFileDetail(data: TaskFileDetail): Promise<TaskFileDetail> {
  return request<TaskFileDetail>({
    url: `/task-file-detail/add`,
    method: "POST",
    data
  })
}

// 获取文件解析详情表 (支持一对多)
export function getDetailByIdTaskFileDetail(params: GetDetailByIdTaskFileDetailParams): Promise<TaskFileDetail> {
  return request<TaskFileDetail>({
    url: `/task-file-detail/getDetailById`,
    method: "GET",
    params
  })
}

// 删除文件解析详情表 (支持一对多)
export function deleteOneTaskFileDetail(params: DeleteOneTaskFileDetailParams): Promise<boolean> {
  return request<boolean>({
    url: `/task-file-detail/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除文件解析详情表 (支持一对多)
export function batchDelTaskFileDetail(params: BatchDelTaskFileDetailParams): Promise<boolean> {
  return request<boolean>({
    url: `/task-file-detail/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
