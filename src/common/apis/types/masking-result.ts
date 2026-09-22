/**
 * [INPUT]: 由 OpenAPI 的 masking-result schemas / 请求参数生成
 * [OUTPUT]: 对外提供 masking-result 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 脱敏结果记录表 */
export interface MaskingResult {
  id?: number /** 主键 ID */
  taskId?: number /** 关联主任务ID */
  maskedFilePath?: string /** 脱敏后文件的存储路径 */
  originalResult?: string /** 脱敏算法返回的原始结果 */
  status?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAIL" /** 状态 */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
}

/** 排序项 */
export interface OrderItem {
  column?: string /** 排序字段 */
  asc?: boolean /** 是否升序 */
}

/** MaskingResult 分页结果 */
export interface PageMaskingResult {
  records?: MaskingResult[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageMaskingResult
  searchCount?: PageMaskingResult
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 分页查询参数 */
export interface PageQuerySo {
  pageSize?: number /** 分页大小 */
  pageCurrent?: number /** 当前页 */
  orderColumn?: string /** 排序字段 */
  orderType?: string /** 排序方式 */
  entity?: MaskingResult /** 实体参数 */
}

/** 开始执行脱敏任务请求参数 */
export interface StartMaskingSo {
  maskingResultId: number /** 脱敏结果记录ID */
}

/** 获取脱敏结果记录表 - 请求参数 */
export interface GetDetailByIdMaskingResultParams {
  id: number /** 主键 ID */
}

/** 删除脱敏结果记录表 - 请求参数 */
export interface DeleteOneMaskingResultParams {
  id: number /** 主键 ID */
}

/** 批量删除脱敏结果记录表 - 请求参数 */
export interface BatchDelMaskingResultParams {
  ids: number[] /** ID 列表 */
}
