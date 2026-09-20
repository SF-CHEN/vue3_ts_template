/**
 * [INPUT]: 由 OpenAPI 的 public schemas / 请求参数生成
 * [OUTPUT]: 对外提供 public 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 数据总览Vo */
export interface DataOverviewVo {
  todayFileCount?: number /** 今日接入文件 */
  identifiedPointCount?: number /** 已识别密点 */
  pendingReviewCount?: number /** 待人工复合 */
  highRiskWarningCount?: number /** 密级预警 */
}

/** 名称-数量Vo */
export interface NameNumberVo {
  name?: string /** 名称 */
  number?: number /** 数量 */
}

/** 上传的文件表 */
export interface UploadFile {
  id?: number /** 自增ID */
  oriFileName?: string /** 文件原始名称 */
  saveUri?: string /** 文件保存的uri */
  createTime?: string /** 创建时间 */
}
