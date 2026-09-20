/**
 * [INPUT]: 由 OpenAPI 的 interface-callback-log paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 interface-callback-log 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { AlgorithmDetailVo, BatchDelInterfaceCallbackLogParams, CallSystemStatVo, DeleteOneInterfaceCallbackLogParams, GetDetailByIdInterfaceCallbackLogParams, InterfaceCallbackLog, InterfaceCallbackLogOverviewSo, InterfaceCallbackLogOverviewVo, NameNumberVo, PageInterfaceCallbackLog, PageQuerySo, UserCallDetailVo } from "./types/interface-callback-log"
import { request } from "@@/apis/request"

/* <generated> */
// 修改接口回传日志表
export function updateInterfaceCallbackLog(data: InterfaceCallbackLog): Promise<boolean> {
  return request<boolean>({
    url: `/interface-callback-log/update`,
    method: "PUT",
    data
  })
}

// 用户调用统计
export function userCallDetailsInterfaceCallbackLog(data: InterfaceCallbackLogOverviewSo): Promise<UserCallDetailVo[]> {
  return request<UserCallDetailVo[]>({
    url: `/interface-callback-log/userCallDetails`,
    method: "POST",
    data
  })
}

// 分页查询接口回传日志表
export function pageInterfaceCallbackLog(data: PageQuerySo): Promise<PageInterfaceCallbackLog> {
  return request<PageInterfaceCallbackLog>({
    url: `/interface-callback-log/page`,
    method: "POST",
    data
  })
}

// 接口回传总览
export function overviewInterfaceCallbackLog(data: InterfaceCallbackLogOverviewSo): Promise<InterfaceCallbackLogOverviewVo> {
  return request<InterfaceCallbackLogOverviewVo>({
    url: `/interface-callback-log/overview`,
    method: "POST",
    data
  })
}

// 每日调用趋势
export function dailyTrendInterfaceCallbackLog(data: InterfaceCallbackLogOverviewSo): Promise<NameNumberVo[]> {
  return request<NameNumberVo[]>({
    url: `/interface-callback-log/dailyTrend`,
    method: "POST",
    data
  })
}

// 调用系统统计
export function callSystemStatsInterfaceCallbackLog(data: InterfaceCallbackLogOverviewSo): Promise<CallSystemStatVo[]> {
  return request<CallSystemStatVo[]>({
    url: `/interface-callback-log/callSystemStats`,
    method: "POST",
    data
  })
}

// 算法接口详情
export function algorithmDetailsInterfaceCallbackLog(data: InterfaceCallbackLogOverviewSo): Promise<AlgorithmDetailVo[]> {
  return request<AlgorithmDetailVo[]>({
    url: `/interface-callback-log/algorithmDetails`,
    method: "POST",
    data
  })
}

// 新增接口回传日志表
export function addInterfaceCallbackLog(data: InterfaceCallbackLog): Promise<InterfaceCallbackLog> {
  return request<InterfaceCallbackLog>({
    url: `/interface-callback-log/add`,
    method: "POST",
    data
  })
}

// 获取接口回传日志表
export function getDetailByIdInterfaceCallbackLog(params: GetDetailByIdInterfaceCallbackLogParams): Promise<InterfaceCallbackLog> {
  return request<InterfaceCallbackLog>({
    url: `/interface-callback-log/getDetailById`,
    method: "GET",
    params
  })
}

// 删除接口回传日志表
export function deleteOneInterfaceCallbackLog(params: DeleteOneInterfaceCallbackLogParams): Promise<boolean> {
  return request<boolean>({
    url: `/interface-callback-log/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除接口回传日志表
export function batchDelInterfaceCallbackLog(params: BatchDelInterfaceCallbackLogParams): Promise<boolean> {
  return request<boolean>({
    url: `/interface-callback-log/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
