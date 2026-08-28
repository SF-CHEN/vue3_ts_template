import type { RouteRecordRaw } from "vue-router"
import type { UserPermissionInfo } from "./types"
import { constantRoutes, dynamicRoutes } from "@/router"

function hasPermission(userPermissionInfo: UserPermissionInfo, route: RouteRecordRaw) {
  const routeRoles = route.meta?.roles
  const routePermissions = route.meta?.permissions
  const roleAllowed = routeRoles === undefined || routeRoles.some(role => userPermissionInfo.roles.includes(role))
  const permissionAllowed = routePermissions === undefined || routePermissions.some(permission => userPermissionInfo.permissions.includes(permission))
  return roleAllowed && permissionAllowed
}

function filterDynamicRoutes(routes: RouteRecordRaw[], userPermissionInfo: UserPermissionInfo) {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    if (!hasPermission(userPermissionInfo, route)) return

    const accessibleRoute = { ...route }
    if (accessibleRoute.children) {
      accessibleRoute.children = filterDynamicRoutes(accessibleRoute.children, userPermissionInfo)
      if (accessibleRoute.children.length === 0) return
    }
    result.push(accessibleRoute)
  })

  return result
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])

  const applyRoutes = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = [...constantRoutes, ...accessedRoutes]
    addRoutes.value = accessedRoutes
  }

  const setRoutes = (userPermissionInfo: UserPermissionInfo) => {
    applyRoutes(filterDynamicRoutes(dynamicRoutes, userPermissionInfo))
  }

  const setAllRoutes = () => {
    applyRoutes(dynamicRoutes)
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})
