/**
 * [INPUT]: 由 OpenAPI 的 sys-audit-log schemas / 请求参数生成
 * [OUTPUT]: 对外提供 sys-audit-log 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 日志审查概览 */
export interface LogReviewOverviewVo {
  userOperationLogCount?: number /** 用户操作日志数量 */
  interfaceCallLogCount?: number /** 接口调用日志数量 */
  interfaceCallFailCount?: number /** 接口调用失败数量 */
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
  entity?: SysAuditLog /** 实体参数 */
}

/** SysAuditLog 分页结果 */
export interface PageSysAuditLog {
  records?: SysAuditLog[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageSysAuditLog
  searchCount?: PageSysAuditLog
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 系统操作审计日志表 */
export interface SysAuditLog {
  id?: number /** 主键 ID */
  createTime?: string /** 创建时间 */
  username?: string /** 操作用户的username */
  ipAddress?: string /** 操作IP */
  module?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" | "GENERAL" /** 所属模块 */
  actionType?: "DISPOSE_WARNING" | "CONFIRM_SECRET" | "QUERY_RESULT" | "IGNORE_WARNING" | "TASK_PARSE" | "TASK_IDENTIFY" | "TASK_MASKING" | "TASK_EARLY_WARNING" | "LOGIN" /** 操作动作 */
  targetObject?: string /** 操作对象 (如任务号、用户名) */
  resultStatus?: "SUCCESS" | "FAILED" /** 执行结果 */
  actionDesc?: string /** 操作详情 */
}

/** 获取系统操作审计日志表 - 请求参数 */
export interface GetDetailByIdSysAuditLogParams {
  id: number /** 主键 ID */
}

/** 删除系统操作审计日志表 - 请求参数 */
export interface DeleteOneSysAuditLogParams {
  id: number /** 主键 ID */
}

/** 批量删除系统操作审计日志表 - 请求参数 */
export interface BatchDelSysAuditLogParams {
  ids: number[] /** ID 列表 */
}
