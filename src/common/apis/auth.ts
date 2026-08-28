import type { AuthApi, CurrentUser, LoginInput, LoginResult } from "./types/auth"
import { ROLE_ADMIN, ROLE_USER } from "@@/constants/roles"
import { getToken } from "@@/utils/local-storage"
import { request } from "@/http/axios"

/**
 * 是否启用本地 Mock。Mock 模式和真实 API 模式完全独立。
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"

/** Mock 账号：admin / 任意密码 → 管理员；user / 任意密码 → 普通用户 */
const MOCK_USERS: Record<string, CurrentUser> = {
  admin: {
    id: 1,
    username: "admin",
    roles: [ROLE_ADMIN],
    permissions: ["demo:article:list", "demo:article:create", "demo:article:edit", "demo:article:delete"]
  },
  user: {
    id: 2,
    username: "user",
    roles: [ROLE_USER],
    permissions: ["demo:article:list", "demo:article:create"]
  }
}

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms, data))
}

const mockAuthApi: AuthApi = {
  async login(input: LoginInput): Promise<LoginResult> {
    const profile = MOCK_USERS[input.username]
    if (!profile || !input.password) {
      throw new Error("账号或密码错误（演示：admin / user，密码任意）")
    }
    return delay({
      token: `mock-token-${profile.username}`,
      user: profile
    })
  },
  async getCurrentUser(): Promise<CurrentUser> {
    const token = getToken() || ""
    const username = token.replace(/^mock-token-/, "")
    const profile = MOCK_USERS[username]
    if (!profile) {
      throw new Error("登录已失效，请重新登录")
    }
    return delay(profile)
  },
  async logout(): Promise<void> {
    await delay(undefined)
  }
}

/** 真实后端适配示例：按项目协议改路径与字段映射即可 */
const realAuthApi: AuthApi = {
  async login(input: LoginInput): Promise<LoginResult> {
    const res = await request<ApiResponseData<LoginResult>>({
      url: "/auth/login",
      method: "post",
      data: input
    })
    return res.data
  },
  async getCurrentUser(): Promise<CurrentUser> {
    const res = await request<ApiResponseData<CurrentUser>>({
      url: "/auth/me",
      method: "get"
    })
    return res.data
  },
  async logout(): Promise<void> {
    await request<ApiResponseData<null>>({
      url: "/auth/logout",
      method: "post"
    })
  }
}

export const authApi: AuthApi = USE_MOCK ? mockAuthApi : realAuthApi
