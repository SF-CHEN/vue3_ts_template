/**
 * [INPUT]: 由 OpenAPI 的 secret-point schemas / 请求参数生成
 * [OUTPUT]: 对外提供 secret-point 模块的请求与响应契约类型
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
  entity?: SecretPoint /** 实体参数 */
}

/** SecretPoint 分页结果 */
export interface PageSecretPoint {
  records?: SecretPoint[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageSecretPoint
  searchCount?: PageSecretPoint
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 密点标注与复核表 */
export interface SecretPoint {
  id?: number /** 主键 ID */
  taskId?: number /** 关联主任务ID */
  fileName?: string /** 关联文件名称 */
  detectionResult?: string /** 密点检测结果 */
  status?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAIL" /** 状态 */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
}

/** 开始执行密点检查请求参数 */
export interface StartTaskSecretPointSo {
  secretPointId: number /** 密点ID */
  algorithmConfigId: number /** 算法配置ID */
}

/** 获取密点标注与复核表 - 请求参数 */
export interface GetDetailByIdSecretPointParams {
  id: number /** 主键 ID */
}

/** 删除密点标注与复核表 - 请求参数 */
export interface DeleteOneSecretPointParams {
  id: number /** 主键 ID */
}

/** 批量删除密点标注与复核表 - 请求参数 */
export interface BatchDelSecretPointParams {
  ids: number[] /** ID 列表 */
}
