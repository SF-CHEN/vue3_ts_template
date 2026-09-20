/**
 * [INPUT]: 由 OpenAPI 的 algorithm-config paths 生成，并依赖 @@/apis/request 的 request
 * [OUTPUT]: 对外提供 algorithm-config 模块的类型安全 API 请求函数
 * [POS]: src/common/apis 的自动生成 API 模块，供页面直接调用；同文件 <generated> 外可手写适配
 */

import type { AlgorithmConfig, BaseDropAlgorithmConfig, BatchDelAlgorithmConfigParams, DeleteOneAlgorithmConfigParams, DropdownByStepAlgorithmConfigParams, GetDetailByIdAlgorithmConfigParams, PageAlgorithmConfig, PageQuerySo } from "./types/algorithm-config"
import { request } from "@@/apis/request"

/* <generated> */
// 修改算法配置表
export function updateAlgorithmConfig(data: AlgorithmConfig): Promise<boolean> {
  return request<boolean>({
    url: `/algorithm-config/update`,
    method: "PUT",
    data
  })
}

// 分页查询算法配置表
export function pageAlgorithmConfig(data: PageQuerySo): Promise<PageAlgorithmConfig> {
  return request<PageAlgorithmConfig>({
    url: `/algorithm-config/page`,
    method: "POST",
    data
  })
}

// 新增算法配置表
export function addAlgorithmConfig(data: AlgorithmConfig): Promise<AlgorithmConfig> {
  return request<AlgorithmConfig>({
    url: `/algorithm-config/add`,
    method: "POST",
    data
  })
}

// 获取算法配置表
export function getDetailByIdAlgorithmConfig(params: GetDetailByIdAlgorithmConfigParams): Promise<AlgorithmConfig> {
  return request<AlgorithmConfig>({
    url: `/algorithm-config/getDetailById`,
    method: "GET",
    params
  })
}

// 下拉接口-根据环节查询算法配置
export function dropdownByStepAlgorithmConfig(params: DropdownByStepAlgorithmConfigParams): Promise<BaseDropAlgorithmConfig[]> {
  return request<BaseDropAlgorithmConfig[]>({
    url: `/algorithm-config/dropdownByStep`,
    method: "GET",
    params
  })
}

// 删除算法配置表
export function deleteOneAlgorithmConfig(params: DeleteOneAlgorithmConfigParams): Promise<boolean> {
  return request<boolean>({
    url: `/algorithm-config/deleteOne`,
    method: "DELETE",
    params
  })
}

// 批量删除算法配置表
export function batchDelAlgorithmConfig(params: BatchDelAlgorithmConfigParams): Promise<boolean> {
  return request<boolean>({
    url: `/algorithm-config/batchDel`,
    method: "DELETE",
    params
  })
}
/* </generated> */
