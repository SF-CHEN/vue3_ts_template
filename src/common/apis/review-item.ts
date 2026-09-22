/**
 * [INPUT]: 由 OpenAPI 的 review-item paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 review-item 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelReviewItemParams, ConfirmReviewSo, DeleteOneReviewItemParams, GetDetailByIdReviewItemParams, ManualReviewSo, PageQuerySo, PageReviewItem, ReviewItem, ReviewSo, SupplementEvidenceSo } from "./types/review-item"
import { request } from "@@/apis/request"

/* <generated> */
// 修改复合条目表
export function updateReviewItem(data: ReviewItem): Promise<boolean> {
  return request<boolean>({
    url: `/review-item/update`,
    method: "PUT",
    data
  })
}

// 补充依据
export function supplementEvidenceReviewItem(data: SupplementEvidenceSo): Promise<ReviewItem> {
  return request<ReviewItem>({
    url: `/review-item/supplement-evidence`,
    method: "POST",
    data
  })
}

// 复核/驳回
export function reviewReviewItem(data: ReviewSo): Promise<ReviewItem> {
  return request<ReviewItem>({
    url: `/review-item/review`,
    method: "POST",
    data
  })
}

// 分页查询复合条目表
export function pageReviewItem(data: PageQuerySo): Promise<PageReviewItem> {
  return request<PageReviewItem>({
    url: `/review-item/page`,
    method: "POST",
    data
  })
}

// 确认复核
export function confirmReviewReviewItem(data: ConfirmReviewSo): Promise<ReviewItem> {
  return request<ReviewItem>({
    url: `/review-item/confirm-review`,
    method: "POST",
    data
  })
}

// 手工标注
export function addReviewItem(data: ManualReviewSo): Promise<ReviewItem> {
  return request<ReviewItem>({
    url: `/review-item/add`,
    method: "POST",
    data
  })
}

// 获取复合条目表
export function getDetailByIdReviewItem(params: GetDetailByIdReviewItemParams): Promise<ReviewItem> {
  return request<ReviewItem>({
    url: `/review-item/getDetailById`,
    method: "GET",
    params
  })
}

// 删除复合条目表
export function deleteOneReviewItem(params: DeleteOneReviewItemParams): Promise<boolean> {
  return request<boolean>({
    url: `/review-item/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除复合条目表
export function batchDelReviewItem(params: BatchDelReviewItemParams): Promise<boolean> {
  return request<boolean>({
    url: `/review-item/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
