/**
 * [INPUT]: 由 OpenAPI 的 upload-file schemas / 请求参数生成
 * [OUTPUT]: 对外提供 upload-file 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

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
  entity?: UploadFile /** 实体参数 */
}

/** UploadFile 分页结果 */
export interface PageUploadFile {
  records?: UploadFile[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageUploadFile
  searchCount?: PageUploadFile
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 上传的文件表 */
export interface UploadFile {
  id?: number /** 自增ID */
  oriFileName?: string /** 文件原始名称 */
  saveUri?: string /** 文件保存的uri */
  createTime?: string /** 创建时间 */
}

/** 获取上传的文件表 - 请求参数 */
export interface GetDetailByIdUploadFileParams {
  id: number /** 主键 ID */
}

/** 删除上传的文件表 - 请求参数 */
export interface DeleteOneUploadFileParams {
  id: number /** 主键 ID */
}

/** 批量删除上传的文件表 - 请求参数 */
export interface BatchDelUploadFileParams {
  ids: number[] /** ID 列表 */
}
