/**
 * [INPUT]: 由 OpenAPI 的 public paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 public 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { DataOverviewVo, NameNumberVo, UploadFile } from "./types/public"
import { request } from "@@/apis/request"

/* <generated> */
// @keep
export function uploadPublic(file: File, onProgress?: (percent: number) => void): Promise<UploadFile> {
  const data = new FormData()
  data.append("file", file)

  return request<UploadFile>({
    url: `/public/upload`,
    method: "POST",
    data,
    onUploadProgress(event) {
      if (!event.total) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    }
  })
}

// 本周运行概况
export function weeklyOverviewPublic(): Promise<NameNumberVo[]> {
  return request<NameNumberVo[]>({
    url: `/public/weekly-overview`,
    method: "GET"
  })
}

// 密点类型分布
export function secretPointTypeDistributionPublic(): Promise<NameNumberVo[]> {
  return request<NameNumberVo[]>({
    url: `/public/secret-point-type-distribution`,
    method: "GET"
  })
}

// 数据总览
export function overviewPublic(): Promise<DataOverviewVo> {
  return request<DataOverviewVo>({
    url: `/public/overview`,
    method: "GET"
  })
}
/* </generated> */
