/**
 * [INPUT]: 由 OpenAPI 的 algorithm-config schemas / 请求参数生成
 * [OUTPUT]: 对外提供 algorithm-config 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 算法配置表 */
export interface AlgorithmConfig {
  id?: number /** 主键 ID */
  name?: string /** 算法名称 */
  envPath?: string /** 算法执行环境路径 */
  reqUri?: string /** 请求地址 */
  createTime?: string /** 创建时间 */
  scriptPath?: string /** 算法API文件路径 */
  keyword?: string /** 给与的额外查询关键字 */
  step?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" /** 算法所属环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成) */
  callType?: string /** 调用方式 */
  authType?: string /** 认证方式 */
}

/** AlgorithmConfig 下拉选项 */
export interface BaseDropAlgorithmConfig {
  id?: number /** 主键 ID */
  name?: string /** 名称 */
  data?: AlgorithmConfig /** 关联数据 */
}

/** 排序项 */
export interface OrderItem {
  column?: string /** 排序字段 */
  asc?: boolean /** 是否升序 */
}

/** AlgorithmConfig 分页结果 */
export interface PageAlgorithmConfig {
  records?: AlgorithmConfig[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageAlgorithmConfig
  searchCount?: PageAlgorithmConfig
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
  entity?: AlgorithmConfig /** 实体参数 */
}

/** 获取算法配置表 - 请求参数 */
export interface GetDetailByIdAlgorithmConfigParams {
  id: number /** 主键 ID */
}

/** 下拉接口-根据环节查询算法配置 - 请求参数 */
export interface DropdownByStepAlgorithmConfigParams {
  step: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED"
}

/** 删除算法配置表 - 请求参数 */
export interface DeleteOneAlgorithmConfigParams {
  id: number /** 主键 ID */
}

/** 批量删除算法配置表 - 请求参数 */
export interface BatchDelAlgorithmConfigParams {
  ids: number[] /** ID 列表 */
}
