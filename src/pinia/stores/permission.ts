import type { RouteRecordRaw } from "vue-router"
import type { UserPermissionInfo } from "./types"
import { pinia } from "@/pinia"
import { constantRoutes, dynamicRoutes } from "@/router"

function hasPermission(userPermissionInfo: UserPermissionInfo, route: RouteRecordRaw) {
  const routeRoles = route.meta?.roles
  const routePermissions = route.meta?.permissions
  const roleAllowed = routeRoles === undefined || routeRoles.some(role => userPermissionInfo.roles.includes(role))
  const permissionAllowed = routePermissions === undefined || routePermissions.some(permission => userPermissionInfo.permissions.includes(permission))
  return roleAllowed && permissionAllowed
}

function filterDynamicRoutes(routes: RouteRecordRaw[], userPermissionInfo: UserPermissionInfo) {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(userPermissionInfo, tempRoute)) {
      if (tempRoute.children) tempRoute.children = filterDynamicRoutes(tempRoute.children, userPermissionInfo)
      // 父级本身没有页面组件时，过滤后没有子路由就不应继续出现在菜单中。
      if (tempRoute.children && tempRoute.children.length === 0) return
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  // 可访问的路由
  const routes = ref<RouteRecordRaw[]>([])

  // 有访问权限的动态路由
  const addRoutes = ref<RouteRecordRaw[]>([])

  // 根据角色和权限生成可访问的 Routes（可访问的路由 = 常驻路由 + 有访问权限的动态路由）
  const setRoutes = (userPermissionInfo: UserPermissionInfo) => {
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes, userPermissionInfo)
    set(accessedRoutes)
  }

  // 所有路由 = 所有常驻路由 + 所有动态路由
  const setAllRoutes = () => {
    set(dynamicRoutes)
  }

  // 统一设置
  const set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = accessedRoutes
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function usePermissionStoreOutside() {
  return usePermissionStore(pinia)
}
