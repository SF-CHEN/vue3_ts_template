import type { SysUser } from "@@/apis/types/sys-user"
import { getInfoSysUser } from "@@/apis/sys-user"
import { getToken, removeToken, setToken as saveToken } from "@@/utils/local-storage"
import { resetRouter, router } from "@/router"
import { useTagsViewStore } from "./tags-view"

const LOGIN_PATH = "/login"

export const useUserStore = defineStore("user", () => {
  const token = ref(getToken() || "")
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const username = ref("")
  const userRole = ref<SysUser["userRole"]>()
  const userId = ref<number | null>(null)
  const isGotUserInfo = ref(false)

  const tagsViewStore = useTagsViewStore()

  const setToken = (value: string) => {
    // Token 同时写入持久化存储和响应式状态，刷新后仍能恢复登录态。
    saveToken(value)
    token.value = value
  }

  const setProfile = (profile: SysUser) => {
    username.value = profile.username ?? ""
    userId.value = profile.id ?? null
    userRole.value = profile.userRole
    // 路由过滤仍按角色数组判断，这里把后端单一 userRole 收成现有 roles 结构。
    roles.value = profile.userRole ? [profile.userRole] : []
    permissions.value = []
  }

  const getInfo = async () => {
    const currentUser = await getInfoSysUser()
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
    userRole.value = undefined
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
    // 后端未提供登出接口，只清理本地会话。
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

  return { token, roles, permissions, username, userRole, userId, isGotUserInfo, setToken, setProfile, getInfo, logout, expireSession, resetToken }
})
