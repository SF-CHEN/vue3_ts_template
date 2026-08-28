import { isArray } from "@@/utils/validate"
import { useUserStore } from "@/pinia/stores/user"

/** 判断当前用户是否拥有任一权限；角色判断请使用 checkRole。 */
export function checkPermission(permissions: string[]): boolean {
  if (isArray(permissions) && permissions.length > 0) {
    return useUserStore().permissions.some(permission => permissions.includes(permission))
  }
  console.error("参数必须是一个非空权限数组，例如：checkPermission(['user:create'])")
  return false
}

/** 判断当前用户是否拥有任一角色，仅用于少数整体身份场景。 */
export function checkRole(roles: string[]): boolean {
  if (isArray(roles) && roles.length > 0) {
    return useUserStore().roles.some(role => roles.includes(role))
  }
  console.error("参数必须是一个非空角色数组，例如：checkRole(['admin'])")
  return false
}
