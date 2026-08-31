import type { AxiosRequestConfig } from "axios"
import { getToken } from "@@/utils/local-storage"
import axios from "axios"
import { useUserStore } from "@/pinia/stores/user"

const HTTP_ERROR_MESSAGES: Partial<Record<number, string>> = {
  400: "请求错误",
  401: "未授权",
  403: "拒绝访问",
  404: "请求地址出错",
  408: "请求超时",
  500: "服务器内部错误",
  501: "服务未实现",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
  505: "HTTP 版本不受支持"
}

interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30_000
})

instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (response) => {
    const responseType = response.config.responseType
    if (responseType === "blob" || responseType === "arraybuffer") return response.data
    if (response.status === 204) return undefined

    const apiData = response.data as Partial<ApiResponse<unknown>>
    if (apiData.code === undefined) {
      const error = new Error("接口响应缺少 code 字段")
      ElMessage.error(error.message)
      return Promise.reject(error)
    }

    if (apiData.code === 0) return apiData.data

    if (apiData.code === 401) useUserStore().expireSession()

    const error = new Error(apiData.message || "请求失败")
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
  (error: unknown) => {
    if (!axios.isAxiosError<{ message?: string }>(error)) {
      ElMessage.error("请求失败")
      return Promise.reject(error)
    }

    const status = error.response?.status
    const serverMessage = error.response?.data?.message
    error.message = serverMessage || (status ? HTTP_ERROR_MESSAGES[status] : undefined) || error.message || "请求失败"

    if (status === 401) useUserStore().expireSession()

    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

/** 返回业务 data；通用响应包在拦截器中统一解开。 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance.request<unknown, T>(config)
}
