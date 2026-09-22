/**
 * [INPUT]: 由 OpenAPI 的 sys-audit-log paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 sys-audit-log 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelSysAuditLogParams, DeleteOneSysAuditLogParams, GetDetailByIdSysAuditLogParams, LogReviewOverviewVo, PageQuerySo, PageSysAuditLog, SysAuditLog } from "./types/sys-audit-log"
import { request } from "@@/apis/request"

/* <generated> */
// 修改系统操作审计日志表
export function updateSysAuditLog(data: SysAuditLog): Promise<boolean> {
  return request<boolean>({
    url: `/sys-audit-log/update`,
    method: "PUT",
    data
  })
}

// 分页查询系统操作审计日志表
export function pageSysAuditLog(data: PageQuerySo): Promise<PageSysAuditLog> {
  return request<PageSysAuditLog>({
    url: `/sys-audit-log/page`,
    method: "POST",
    data
  })
}

// 日志审查概览
export function overviewSysAuditLog(): Promise<LogReviewOverviewVo> {
  return request<LogReviewOverviewVo>({
    url: `/sys-audit-log/overview`,
    method: "POST"
  })
}

// 新增系统操作审计日志表
export function addSysAuditLog(data: SysAuditLog): Promise<SysAuditLog> {
  return request<SysAuditLog>({
    url: `/sys-audit-log/add`,
    method: "POST",
    data
  })
}

// 获取系统操作审计日志表
export function getDetailByIdSysAuditLog(params: GetDetailByIdSysAuditLogParams): Promise<SysAuditLog> {
  return request<SysAuditLog>({
    url: `/sys-audit-log/getDetailById`,
    method: "GET",
    params
  })
}

// 删除系统操作审计日志表
export function deleteOneSysAuditLog(params: DeleteOneSysAuditLogParams): Promise<boolean> {
  return request<boolean>({
    url: `/sys-audit-log/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除系统操作审计日志表
export function batchDelSysAuditLog(params: BatchDelSysAuditLogParams): Promise<boolean> {
  return request<boolean>({
    url: `/sys-audit-log/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
