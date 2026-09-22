/**
 * [INPUT]: 由 OpenAPI 的 upload-file paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 upload-file 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { BatchDelUploadFileParams, DeleteOneUploadFileParams, GetDetailByIdUploadFileParams, PageQuerySo, PageUploadFile, UploadFile } from "./types/upload-file"
import { request } from "@@/apis/request"

/* <generated> */
// 修改上传的文件表
export function updateUploadFile(data: UploadFile): Promise<boolean> {
  return request<boolean>({
    url: `/upload-file/update`,
    method: "PUT",
    data
  })
}

// 分页查询上传的文件表
export function pageUploadFile(data: PageQuerySo): Promise<PageUploadFile> {
  return request<PageUploadFile>({
    url: `/upload-file/page`,
    method: "POST",
    data
  })
}

// 新增上传的文件表
export function addUploadFile(data: UploadFile): Promise<UploadFile> {
  return request<UploadFile>({
    url: `/upload-file/add`,
    method: "POST",
    data
  })
}

// 获取上传的文件表
export function getDetailByIdUploadFile(params: GetDetailByIdUploadFileParams): Promise<UploadFile> {
  return request<UploadFile>({
    url: `/upload-file/getDetailById`,
    method: "GET",
    params
  })
}

// 删除上传的文件表
export function deleteOneUploadFile(params: DeleteOneUploadFileParams): Promise<boolean> {
  return request<boolean>({
    url: `/upload-file/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除上传的文件表
export function batchDelUploadFile(params: BatchDelUploadFileParams): Promise<boolean> {
  return request<boolean>({
    url: `/upload-file/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
