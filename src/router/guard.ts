import type { Router } from "vue-router"
import { useTitle } from "@@/composables/useTitle"
import { getToken } from "@@/utils/local-storage"
import NProgress from "nprogress"
import { usePermissionStore } from "@/pinia/stores/permission"
import { useUserStore } from "@/pinia/stores/user"
import { routerConfig } from "@/router/config"

NProgress.configure({ showSpinner: false })

const LOGIN_PATH = "/login"
const PUBLIC_PATHS = new Set([LOGIN_PATH])
const { setTitle } = useTitle()

export function registerNavigationGuard(router: Router) {
  router.beforeEach(async (to) => {
    NProgress.start()

    if (!getToken()) {
      if (PUBLIC_PATHS.has(to.path)) return true
      return { path: LOGIN_PATH, query: { redirect: to.fullPath } }
    }

    if (to.path === LOGIN_PATH) return "/"

    const userStore = useUserStore()
    if (userStore.isGotUserInfo) return true

    try {
      await userStore.getInfo()

      const permissionStore = usePermissionStore()
      const { roles, permissions } = userStore
      if (routerConfig.dynamic) {
        permissionStore.setRoutes({ roles, permissions })
      } else {
        permissionStore.setAllRoutes()
      }
      permissionStore.addRoutes.forEach(route => router.addRoute(route))

      return { ...to, replace: true }
    } catch {
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
