/**
 * [INPUT]: 由 OpenAPI 的 sys-user paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 sys-user 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import { md5 } from "js-md5"
import type { BatchDelSysUserParams, DeleteOneSysUserParams, GetDetailByIdSysUserParams, LoginSo, LoginUserVo, PageQuerySo, PageSysUser, SysUser } from "./types/sys-user"
import { request } from "@@/apis/request"

/** 后端按 MD5 存密码；空密码不提交，避免编辑时把原密码覆盖成空串的哈希。 */
function withMd5Password<T extends { password?: string }>(data: T): T {
  const password = data.password?.trim()
  if (!password) return { ...data, password: undefined }
  return { ...data, password: md5(password) }
}

/* <generated> */
// @keep
export function updateSysUser(data: SysUser): Promise<boolean> {
  return request<boolean>({
    url: `/sys-user/update`,
    method: "PUT",
    data: withMd5Password(data)
  })
}

// 分页查询用户
export function pageSysUser(data: PageQuerySo): Promise<PageSysUser> {
  return request<PageSysUser>({
    url: `/sys-user/page`,
    method: "POST",
    data
  })
}
// @keep
export function loginSysUser(data: LoginSo): Promise<LoginUserVo> {
  return request<LoginUserVo>({
    url: `/sys-user/login`,
    method: "POST",
    data: withMd5Password(data)
  })
}
// @keep
export function addSysUser(data: SysUser): Promise<SysUser> {
  return request<SysUser>({
    url: `/sys-user/add`,
    method: "POST",
    data: withMd5Password(data)
  })
}

// 获取当前登录用户信息
export function getInfoSysUser(): Promise<SysUser> {
  return request<SysUser>({
    url: `/sys-user/getInfo`,
    method: "GET"
  })
}

// 获取用户
export function getDetailByIdSysUser(params: GetDetailByIdSysUserParams): Promise<SysUser> {
  return request<SysUser>({
    url: `/sys-user/getDetailById`,
    method: "GET",
    params
  })
}

// 删除用户
export function deleteOneSysUser(params: DeleteOneSysUserParams): Promise<boolean> {
  return request<boolean>({
    url: `/sys-user/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除用户
export function batchDelSysUser(params: BatchDelSysUserParams): Promise<boolean> {
  return request<boolean>({
    url: `/sys-user/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
