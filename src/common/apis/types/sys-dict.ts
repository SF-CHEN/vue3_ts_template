/**
 * [INPUT]: 由 OpenAPI 的 sys-dict schemas / 请求参数生成
 * [OUTPUT]: 对外提供 sys-dict 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** SysDict 下拉选项 */
export interface BaseDropSysDict {
  id?: number /** 主键 ID */
  name?: string /** 名称 */
  data?: SysDict /** 关联数据 */
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
  entity?: SysDict /** 实体参数 */
}

/** SysDict 分页结果 */
export interface PageSysDict {
  records?: SysDict[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageSysDict
  searchCount?: PageSysDict
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 系统字典表 */
export interface SysDict {
  id?: number /** 主键 ID */
  dictType?: "SOURCE_TYPE" | "SCENE_TYPE" | "SECRET_POINT_TYPE" | "REVIEW_CONCLUSION" /** 字典类型：来源类型、场景类型 */
  userId?: number /** 所属用户ID，为空表示公共字典 */
  dictCode?: string /** 字典编码 */
  dictName?: string /** 字典名称 */
  sortOrder?: number /** 排序 */
  status?: number /** 状态: 1启用 0禁用 */
  isDeleted?: boolean /** 逻辑删除: true已删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
}

/** 获取系统字典表 - 请求参数 */
export interface GetDetailByIdSysDictParams {
  id: number /** 主键 ID */
}

/** 字典下拉接口 - 请求参数 */
export interface DropSysDictParams {
  dictType: "SOURCE_TYPE" | "SCENE_TYPE" | "SECRET_POINT_TYPE" | "REVIEW_CONCLUSION" /** 字典类型 */
}

/** 根据当前登录用户查询字典下拉接口 - 请求参数 */
export interface DropByUserSysDictParams {
  dictType: "SOURCE_TYPE" | "SCENE_TYPE" | "SECRET_POINT_TYPE" | "REVIEW_CONCLUSION" /** 字典类型 */
}

/** 删除系统字典表 - 请求参数 */
export interface DeleteOneSysDictParams {
  id: number /** 主键 ID */
}

/** 批量删除系统字典表 - 请求参数 */
export interface BatchDelSysDictParams {
  ids: number[] /** ID 列表 */
}
