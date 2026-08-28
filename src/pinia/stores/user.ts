import type { UserProfile } from "@@/utils/types"
import { authApi } from "@@/apis/auth"
import {
  setToken as _setToken,
  getToken,
  removeToken,
  removeUserProfile,
  setUserProfile
} from "@@/utils/local-storage"
import { pinia } from "@/pinia"
import { resetRouter, router } from "@/router"
import { useSettingsStore } from "./settings"
import { useTagsViewStore } from "./tags-view"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")

  const roles = ref<string[]>([])

  const permissions = ref<string[]>([])

  const username = ref<string>("")

  const userId = ref<number | null>(null)

  const isGotUserInfo = ref<boolean>(false)

  const tagsViewStore = useTagsViewStore()

  const settingsStore = useSettingsStore()

  const setToken = (value: string) => {
    _setToken(value)
    token.value = value
  }

  /** 登录成功后写入用户摘要 */
  const setProfile = (profile: UserProfile) => {
    setUserProfile(profile)
    username.value = profile.username
    userId.value = profile.id
    roles.value = profile.roles
    permissions.value = profile.permissions ?? []
  }

  /** 获取当前用户：认证失败时必须结束当前会话，不能使用旧缓存越权进入系统 */
  const getInfo = async () => {
    const current = await authApi.getCurrentUser()
    setProfile({
      id: current.id,
      username: current.username,
      roles: current.roles,
      permissions: current.permissions
    })
    isGotUserInfo.value = true
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // 忽略登出接口失败，仍清理本地态
    }
    resetToken()
    resetRouter()
    resetTagsView()
    router.replace("/login")
  }

  /** 会话失效时只清理本地状态，避免在 HTTP 401 拦截器中再次请求登出接口。 */
  const expireSession = () => {
    resetToken()
    resetRouter()
    resetTagsView()
    router.replace("/login")
  }

  const resetToken = () => {
    removeToken()
    removeUserProfile()
    token.value = ""
    roles.value = []
    permissions.value = []
    username.value = ""
    userId.value = null
    isGotUserInfo.value = false
  }

  const resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, permissions, username, userId, isGotUserInfo, setToken, setProfile, getInfo, logout, expireSession, resetToken }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useUserStoreOutside() {
  return useUserStore(pinia)
}
