/**
 * [INPUT]: 由 OpenAPI 的 early-warning schemas / 请求参数生成
 * [OUTPUT]: 对外提供 early-warning 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 预警事件 */
export interface EarlyWarning {
  id?: number /** 主键 ID */
  taskId?: number /** mainTaskId */
  eventName?: string /** 事件描述 */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
  docClassificationLevel?: string /** 文件密级 */
  identifyClassificationLevel?: string /** 识别密级 */
  userClassificationLevel?: string /** 用户密级 */
  disposalSuggestions?: string /** 处置建议 */
  status?: "PENDING" | "HIGH_RISK" | "PENDING_CONFIRM" | "PROCESSING" | "HANDLED" /** 状态: PENDING(待处理), HIGH_RISK(高风险), PENDING_CONFIRM(待确认), PROCESSING(处理中), HANDLED(已处理) */
}

/** 处置预警事件请求参数 */
export interface HandleEarlyWarningSo {
  earlyWarningId: number /** 预警事件ID */
  status: "PENDING" | "HIGH_RISK" | "PENDING_CONFIRM" | "PROCESSING" | "HANDLED" /** 状态 */
}

/** 排序项 */
export interface OrderItem {
  column?: string /** 排序字段 */
  asc?: boolean /** 是否升序 */
}

/** EarlyWarning 分页结果 */
export interface PageEarlyWarning {
  records?: EarlyWarning[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageEarlyWarning
  searchCount?: PageEarlyWarning
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
  entity?: EarlyWarning /** 实体参数 */
}

/** 开始执行预警检测请求参数 */
export interface StartEarlyWarningSo {
  mainTaskId: number /** 主任务ID */
}

/** 获取预警事件 - 请求参数 */
export interface GetDetailByIdEarlyWarningParams {
  id: number /** 主键 ID */
}

/** 导出预警事件 - 请求参数 */
export interface ExportEarlyWarningParams {
  mainTaskId: number
}

/** 删除预警事件 - 请求参数 */
export interface DeleteOneEarlyWarningParams {
  id: number /** 主键 ID */
}

/** 批量删除预警事件 - 请求参数 */
export interface BatchDelEarlyWarningParams {
  ids: number[] /** ID 列表 */
}
