/**
 * [INPUT]: 由 OpenAPI 的 interface-callback-log schemas / 请求参数生成
 * [OUTPUT]: 对外提供 interface-callback-log 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 算法详情Vo */
export interface AlgorithmDetailVo {
  callType?: string /** 调用方式 */
  name?: string /** 算法名称 */
  reqUri?: string /** 请求地址 */
  callCount?: number /** 调用次数 */
  successRate?: number /** 调用成功率 */
  averageTime?: number /** 平均耗时(s) */
}

/** 调用系统统计Vo */
export interface CallSystemStatVo {
  algorithmName?: string /** 算法名称 */
  step?: string /** 所属阶段 */
  callCount?: number /** 调用次数 */
  lastCallTime?: string /** 最近一次调用时间 */
}

/** 接口回传日志表 */
export interface InterfaceCallbackLog {
  id?: number /** 主键 ID */
  taskId?: number /** 关联主任务ID */
  algorithmConfigId?: number /** 关联算法配置ID */
  step?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" /** 所属环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成) */
  userId?: number /** 用户ID */
  userName?: string /** 用户名 */
  deptName?: string /** 部门名称 */
  success?: boolean /** 是否成功 */
  averageTime?: number /** 平均耗时(s) */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
}

/** 接口回传日志总览请求参数 */
export interface InterfaceCallbackLogOverviewSo {
  startDate: string /** 开始日期 */
  endDate: string /** 结束日期 */
  step?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" /** 所属环节 */
}

/** 接口回传日志总览Vo */
export interface InterfaceCallbackLogOverviewVo {
  totalCount?: number /** 接口调用总次数 */
  stepCount?: number /** 调用的环节数量 */
  failCount?: number /** 调用失败次数 */
  averageTime?: number /** 平均响应时间(s) */
}

/** 名称-数量Vo */
export interface NameNumberVo {
  name?: string /** 名称 */
  number?: number /** 数量 */
}

/** 排序项 */
export interface OrderItem {
  column?: string /** 排序字段 */
  asc?: boolean /** 是否升序 */
}

/** InterfaceCallbackLog 分页结果 */
export interface PageInterfaceCallbackLog {
  records?: InterfaceCallbackLog[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageInterfaceCallbackLog
  searchCount?: PageInterfaceCallbackLog
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
  entity?: InterfaceCallbackLog /** 实体参数 */
}

/** 用户调用统计Vo */
export interface UserCallDetailVo {
  userName?: string /** 用户名称 */
  deptName?: string /** 部门名称 */
  callCount?: number /** 调用次数 */
  successRate?: number /** 调用成功率 */
}

/** 获取接口回传日志表 - 请求参数 */
export interface GetDetailByIdInterfaceCallbackLogParams {
  id: number /** 主键 ID */
}

/** 删除接口回传日志表 - 请求参数 */
export interface DeleteOneInterfaceCallbackLogParams {
  id: number /** 主键 ID */
}

/** 批量删除接口回传日志表 - 请求参数 */
export interface BatchDelInterfaceCallbackLogParams {
  ids: number[] /** ID 列表 */
}
