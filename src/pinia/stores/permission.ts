import type { RouteRecordRaw } from "vue-router"
import type { UserPermissionInfo } from "./types"
import { constantRoutes, dynamicRoutes } from "@/router"

function hasPermission(userPermissionInfo: UserPermissionInfo, route: RouteRecordRaw) {
  const routeRoles = route.meta?.roles
  const routePermissions = route.meta?.permissions

  // 路由未声明 roles / permissions 时默认可访问；声明后则要求当前用户至少命中一项。
  const roleAllowed = routeRoles === undefined || routeRoles.some(role => userPermissionInfo.roles.includes(role))
  const permissionAllowed = routePermissions === undefined || routePermissions.some(permission => userPermissionInfo.permissions.includes(permission))
  return roleAllowed && permissionAllowed
}

function filterDynamicRoutes(routes: RouteRecordRaw[], userPermissionInfo: UserPermissionInfo) {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    if (!hasPermission(userPermissionInfo, route)) return

    // 复制后再裁剪 children，避免直接修改全局 dynamicRoutes 原始配置。
    const accessibleRoute = { ...route }
    if (accessibleRoute.children) {
      accessibleRoute.children = filterDynamicRoutes(accessibleRoute.children, userPermissionInfo)

      // 父菜单没有任何可访问子页面时一并隐藏，避免出现点击后没有内容的空菜单。
      if (accessibleRoute.children.length === 0) return
    }
    result.push(accessibleRoute)
  })

  return result
}

export const usePermissionStore = defineStore("permission", () => {
  // routes 用于侧栏展示；addRoutes 只保存需要动态注册进 Vue Router 的权限路由。
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])

  const setRoutes = (userPermissionInfo: UserPermissionInfo) => {
    const accessibleRoutes = filterDynamicRoutes(dynamicRoutes, userPermissionInfo)
    routes.value = [...constantRoutes, ...accessibleRoutes]
    addRoutes.value = accessibleRoutes
  }

  return { routes, addRoutes, setRoutes }
})
