/**
 * [INPUT]: 由 OpenAPI 的 sys-dict paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 sys-dict 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BaseDropSysDict, BatchDelSysDictParams, DeleteOneSysDictParams, DropByUserSysDictParams, DropSysDictParams, GetDetailByIdSysDictParams, PageQuerySo, PageSysDict, SysDict } from "./types/sys-dict"
import { request } from "@@/apis/request"

/* <generated> */
// 修改系统字典表
export function updateSysDict(data: SysDict): Promise<boolean> {
  return request<boolean>({
    url: `/sys-dict/update`,
    method: "PUT",
    data
  })
}

// 分页查询系统字典表
export function pageSysDict(data: PageQuerySo): Promise<PageSysDict> {
  return request<PageSysDict>({
    url: `/sys-dict/page`,
    method: "POST",
    data
  })
}

// 新增系统字典表
export function addSysDict(data: SysDict): Promise<SysDict> {
  return request<SysDict>({
    url: `/sys-dict/add`,
    method: "POST",
    data
  })
}

// 获取系统字典表
export function getDetailByIdSysDict(params: GetDetailByIdSysDictParams): Promise<SysDict> {
  return request<SysDict>({
    url: `/sys-dict/getDetailById`,
    method: "GET",
    params
  })
}

// 字典下拉接口
export function dropSysDict(params: DropSysDictParams): Promise<BaseDropSysDict[]> {
  return request<BaseDropSysDict[]>({
    url: `/sys-dict/drop`,
    method: "GET",
    params
  })
}

// 根据当前登录用户查询字典下拉接口
export function dropByUserSysDict(params: DropByUserSysDictParams): Promise<BaseDropSysDict[]> {
  return request<BaseDropSysDict[]>({
    url: `/sys-dict/dropByUser`,
    method: "GET",
    params
  })
}

// 删除系统字典表
export function deleteOneSysDict(params: DeleteOneSysDictParams): Promise<boolean> {
  return request<boolean>({
    url: `/sys-dict/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除系统字典表
export function batchDelSysDict(params: BatchDelSysDictParams): Promise<boolean> {
  return request<boolean>({
    url: `/sys-dict/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
