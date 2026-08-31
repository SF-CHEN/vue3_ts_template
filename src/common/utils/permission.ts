import { useUserStore } from "@/pinia/stores/user"

/** 判断当前用户是否拥有任一权限；角色判断请使用 checkRole。 */
export function checkPermission(permissions: string[]): boolean {
  if (permissions.length === 0) {
    console.error("权限列表不能为空，例如：checkPermission(['user:create'])")
    return false
  }
  return useUserStore().permissions.some(permission => permissions.includes(permission))
}

/** 判断当前用户是否拥有任一角色，仅用于少数整体身份场景。 */
export function checkRole(roles: string[]): boolean {
  if (roles.length === 0) {
    console.error("角色列表不能为空，例如：checkRole(['admin'])")
    return false
  }
  return useUserStore().roles.some(role => roles.includes(role))
}
