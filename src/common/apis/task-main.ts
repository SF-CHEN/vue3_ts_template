/**
 * [INPUT]: 由 OpenAPI 的 task-main paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 task-main 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BaseDropTaskMain, BatchDelTaskMainParams, CreateTaskSo, DeleteOneTaskMainParams, DropdownByStepTaskMainParams, GetDetailByIdTaskMainParams, PageQuerySo, PageTaskMainPageVo, TaskMain } from "./types/task-main"
import { request } from "@@/apis/request"

/* <generated> */
// 修改文件处理主任务表
export function updateTaskMain(data: TaskMain): Promise<boolean> {
  return request<boolean>({
    url: `/task-main/update`,
    method: "PUT",
    data
  })
}

// 分页查询文件处理主任务表
export function pageTaskMain(data: PageQuerySo): Promise<PageTaskMainPageVo> {
  return request<PageTaskMainPageVo>({
    url: `/task-main/page`,
    method: "POST",
    data
  })
}

// 批量新增文件处理主任务表(从zip包导入)
export function batchAddTaskMain(data: CreateTaskSo): Promise<number> {
  return request<number>({
    url: `/task-main/batchAdd`,
    method: "POST",
    data
  })
}

// 新增文件处理主任务表
export function addTaskMain(data: CreateTaskSo): Promise<TaskMain> {
  return request<TaskMain>({
    url: `/task-main/add`,
    method: "POST",
    data
  })
}

// 获取文件处理主任务表
export function getDetailByIdTaskMain(params: GetDetailByIdTaskMainParams): Promise<TaskMain> {
  return request<TaskMain>({
    url: `/task-main/getDetailById`,
    method: "GET",
    params
  })
}

// 下拉接口-根据环节查询主任务
export function dropdownByStepTaskMain(params: DropdownByStepTaskMainParams): Promise<BaseDropTaskMain[]> {
  return request<BaseDropTaskMain[]>({
    url: `/task-main/dropdownByStep`,
    method: "GET",
    params
  })
}

// 删除文件处理主任务表
export function deleteOneTaskMain(params: DeleteOneTaskMainParams): Promise<boolean> {
  return request<boolean>({
    url: `/task-main/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除文件处理主任务表
export function batchDelTaskMain(params: BatchDelTaskMainParams): Promise<boolean> {
  return request<boolean>({
    url: `/task-main/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
