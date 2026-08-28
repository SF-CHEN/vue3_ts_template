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
    resetRouter()
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // 登出接口失败也必须清理本地会话
    }
    clearSession()
    await router.replace(LOGIN_PATH)
  }

  const expireSession = () => {
    clearSession()
    if (router.currentRoute.value.path !== LOGIN_PATH) {
      router.replace(LOGIN_PATH)
    }
  }

  return { token, roles, permissions, username, userId, isGotUserInfo, setToken, setProfile, getInfo, logout, expireSession, resetToken }
})
