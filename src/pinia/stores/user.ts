import type { CurrentUser } from "@@/apis/types/auth"
import { authApi } from "@@/apis/auth"
import { getToken, removeToken, setToken as saveToken } from "@@/utils/local-storage"
import { resetRouter, router } from "@/router"
import { useTagsViewStore } from "./tags-view"

const LOGIN_PATH = "/login"

export const useUserStore = defineStore("user", () => {
  const token = ref(getToken() || "")
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const username = ref("")
  const userId = ref<number | null>(null)
  const isGotUserInfo = ref(false)

  const tagsViewStore = useTagsViewStore()

  const setToken = (value: string) => {
    // Token 同时写入持久化存储和响应式状态，刷新后仍能恢复登录态。
    saveToken(value)
    token.value = value
  }

  const setProfile = (profile: CurrentUser) => {
    username.value = profile.username
    userId.value = profile.id
    roles.value = profile.roles
    permissions.value = profile.permissions ?? []
  }

  const getInfo = async () => {
    const currentUser = await authApi.getCurrentUser()
    setProfile(currentUser)
    // 守卫用这个标记避免每次路由切换都重新请求当前用户。
    isGotUserInfo.value = true
  }

  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
    permissions.value = []
    username.value = ""
    userId.value = null
    isGotUserInfo.value = false
  }

  const clearSession = () => {
    resetToken()
    // 切换账号前同步移除动态路由和页面缓存，防止上一个用户的权限状态残留。
    resetRouter()
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // 登出接口失败也必须清理本地会话，避免用户被困在失效登录态中。
    }
    clearSession()
    await router.replace(LOGIN_PATH)
  }

  const expireSession = () => {
    // 401 属于被动过期，不再调用后端 logout，只清理本地会话并返回登录页。
    clearSession()
    if (router.currentRoute.value.path !== LOGIN_PATH) {
      router.replace(LOGIN_PATH)
    }
  }

  return { token, roles, permissions, username, userId, isGotUserInfo, setToken, setProfile, getInfo, logout, expireSession, resetToken }
})
