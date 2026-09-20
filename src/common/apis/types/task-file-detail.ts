/**
 * [INPUT]: 由 OpenAPI 的 task-file-detail schemas / 请求参数生成
 * [OUTPUT]: 对外提供 task-file-detail 模块的请求与响应契约类型
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
  entity?: TaskFileDetail /** 实体参数 */
}

/** TaskFileDetail 分页结果 */
export interface PageTaskFileDetail {
  records?: TaskFileDetail[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageTaskFileDetail
  searchCount?: PageTaskFileDetail
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 开始执行文件解析请求参数 */
export interface StartTaskFileDetailSo {
  taskFileDetailId: number /** 文件解析详情ID */
}

/** 文件解析详情表 (支持一对多) */
export interface TaskFileDetail {
  id?: number /** 主键 ID */
  taskId?: number /** 关联主任务ID */
  fileName?: string /** 文件名 (如果是压缩包内的文件) */
  fileType?: string /** 文件后缀: PDF, WORD, EXCEL, TXT, IMG */
  parseAbility?: string /** 解析能力 */
  securityAttribute?: string /** 安全属性 */
  parseStatus?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAIL" /** 解析状态: PENDING, SUCCESS, FAIL */
  parseResult?: string /** 解析结果 */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
}

/** 获取文件解析详情表 (支持一对多) - 请求参数 */
export interface GetDetailByIdTaskFileDetailParams {
  id: number /** 主键 ID */
}

/** 删除文件解析详情表 (支持一对多) - 请求参数 */
export interface DeleteOneTaskFileDetailParams {
  id: number /** 主键 ID */
}

/** 批量删除文件解析详情表 (支持一对多) - 请求参数 */
export interface BatchDelTaskFileDetailParams {
  ids: number[] /** ID 列表 */
}
