import type { Router } from "vue-router"
import { useTitle } from "@@/composables/useTitle"
import { getToken } from "@@/utils/local-storage"
import NProgress from "nprogress"
import { usePermissionStore } from "@/pinia/stores/permission"
import { useUserStore } from "@/pinia/stores/user"

NProgress.configure({ showSpinner: false })

const LOGIN_PATH = "/login"
const PUBLIC_PATHS = new Set([LOGIN_PATH])
const { setTitle } = useTitle()

export function registerNavigationGuard(router: Router) {
  router.beforeEach(async (to) => {
    NProgress.start()

    // 未登录时保留原目标地址，登录成功后可以回到用户最初访问的页面。
    if (!getToken()) {
      if (PUBLIC_PATHS.has(to.path)) return true
      return { path: LOGIN_PATH, query: { redirect: to.fullPath } }
    }

    if (to.path === LOGIN_PATH) return "/"

    const userStore = useUserStore()

    // 用户信息和动态路由只需要在刷新后的首次导航中初始化一次。
    if (userStore.isGotUserInfo) return true

    try {
      await userStore.getInfo()

      const permissionStore = usePermissionStore()
      permissionStore.setRoutes({
        roles: userStore.roles,
        permissions: userStore.permissions
      })
      permissionStore.addRoutes.forEach(route => router.addRoute(route))

      // 动态路由刚注册时替换当前导航，让 Vue Router 用新路由表重新匹配目标页面。
      return { ...to, replace: true }
    } catch {
      // Token 失效或用户信息加载失败时清理登录态，避免继续携带无效会话反复导航。
      userStore.resetToken()
      return { path: LOGIN_PATH, query: { redirect: to.fullPath } }
    }
  })

  router.afterEach((to) => {
    setTitle(to.meta.title)
    NProgress.done()
  })

  router.onError(() => NProgress.done())
}
