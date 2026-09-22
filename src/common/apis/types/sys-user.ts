/**
 * [INPUT]: 由 OpenAPI 的 sys-user schemas / 请求参数生成
 * [OUTPUT]: 对外提供 sys-user 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 用户登录请求参数 */
export interface LoginSo {
  username: string /** 用户名 */
  password: string /** 密码 */
}

/** 用户登录结果Vo */
export interface LoginUserVo {
  token?: string /** jwt token */
  user?: SysUser /** 用户信息 */
}

/** 排序项 */
export interface OrderItem {
  column?: string /** 排序字段 */
  asc?: boolean /** 是否升序 */
}

/** 分页查询参数 */
export interface PageQuerySo {
  pageSize?: number /** 分页大小 */
  pageCurrent?: number /** 当前页 */
  orderColumn?: string /** 排序字段 */
  orderType?: string /** 排序方式 */
  entity?: SysUser /** 实体参数 */
}

/** SysUser 分页结果 */
export interface PageSysUser {
  records?: SysUser[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageSysUser
  searchCount?: PageSysUser
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 用户 */
export interface SysUser {
  id?: number /** 主键 ID */
  username?: string /** 用户名 */
  name?: string /** 名称 */
  password?: string /** 密码 */
  userRole?: "GENERAL_USER" | "SYSTEM_ADMIN" | "SECURITY_ADMIN" | "SECURITY_AUDITOR" /** 用户权限: GENERAL_USER(一般用户), SYSTEM_ADMIN(系统管理员), SECURITY_ADMIN(安全管理员), SECURITY_AUDITOR(安全审计员) */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
  isDeleted?: boolean /** 逻辑删除 */
}

/** 获取用户 - 请求参数 */
export interface GetDetailByIdSysUserParams {
  id: number /** 主键 ID */
}

/** 删除用户 - 请求参数 */
export interface DeleteOneSysUserParams {
  id: number /** 主键 ID */
}

/** 批量删除用户 - 请求参数 */
export interface BatchDelSysUserParams {
  ids: number[] /** ID 列表 */
}
