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
  // Token 在请求层统一注入，页面和各 API 函数不重复关心认证头。
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (response) => {
    const responseType = response.config.responseType

    // Blob / ArrayBuffer 不使用 JSON 业务包协议，必须保留原始二进制数据给调用方处理。
    if (responseType === "blob" || responseType === "arraybuffer") return response.data
    if (response.status === 204) return undefined

    const apiData = response.data as Partial<ApiResponse<unknown>>
    if (apiData.code === undefined) {
      const error = new Error("接口响应缺少 code 字段")
      ElMessage.error(error.message)
      return Promise.reject(error)
    }

    // 在这里统一解包后，业务 API 的 request<T>() 可以直接表示最终业务类型 T。
    if (apiData.code === 0) return apiData.data

    // 业务码 401 与 HTTP 401 都视为会话过期，统一清理登录态和动态路由。
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
