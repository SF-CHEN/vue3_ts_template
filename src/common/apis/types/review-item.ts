/**
 * [INPUT]: 由 OpenAPI 的 review-item schemas / 请求参数生成
 * [OUTPUT]: 对外提供 review-item 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** 确认复核请求参数 */
export interface ConfirmReviewSo {
  reviewItemId?: number /** 复合条目ID */
}

/** 手工标注请求参数 */
export interface ManualReviewSo {
  secertPointId?: number /** 关联的密点记录id */
  content?: string /** 密点内容 */
  type?: string /** 密点类型 */
  typeId?: number /** 密点类型id */
  evidence?: string /** 依据 */
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
  entity?: ReviewItem /** 实体参数 */
}

/** ReviewItem 分页结果 */
export interface PageReviewItem {
  records?: ReviewItem[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageReviewItem
  searchCount?: PageReviewItem
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 复合条目表 */
export interface ReviewItem {
  taskId?: number /** 关联主任务ID */
  secertPointId?: number /** 关联的密点记录id */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
  id?: number /** 主键 ID */
  content?: string /** 密点内容 */
  type?: string /** 密点类型 */
  typeId?: number /** 密点类型id */
  evidence?: string /** 依据 */
  confidence?: number /** 置信度 */
  reviewStatus?: "NEED_REVIEW" | "CONFIRMABLE" | "NEED_EVIDENCE" | "REJECTED" | "CONFIRMED" /** 复审状态 */
  reviewConclusion?: string /** 复合结论 */
  reviewConclusionId?: number /** 复合结论id */
  reviewOpinion?: string /** 复核意见 */
  supplementEvidence?: string /** 补充依据描述 */
}

/** 复核/驳回请求参数 */
export interface ReviewSo {
  reviewItemId?: number /** 复合条目ID */
  reviewConclusion?: string /** 复核结论 */
  reviewConclusionId?: number /** 复核结论id */
  reviewOpinion?: string /** 复核意见 */
  reviewStatus?: "NEED_REVIEW" | "CONFIRMABLE" | "NEED_EVIDENCE" | "REJECTED" | "CONFIRMED" /** 复审状态 */
}

/** 补充依据请求参数 */
export interface SupplementEvidenceSo {
  reviewItemId?: number /** 复合条目ID */
  evidence?: string /** 依据内容 */
}

/** 获取复合条目表 - 请求参数 */
export interface GetDetailByIdReviewItemParams {
  id: number /** 主键 ID */
}

/** 删除复合条目表 - 请求参数 */
export interface DeleteOneReviewItemParams {
  id: number /** 主键 ID */
}

/** 批量删除复合条目表 - 请求参数 */
export interface BatchDelReviewItemParams {
  ids: number[] /** ID 列表 */
}
