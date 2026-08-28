import type { App, Directive } from "vue"
import { isArray } from "@@/utils/validate"
import { useUserStore } from "@/pinia/stores/user"

/**
 * @name 权限指令
 * @description 和权限判断函数 checkPermission 功能类似
 */
const permission: Directive = {
  mounted(el, binding) {
    const { value: requiredPermissions } = binding
    const { permissions } = useUserStore()
    if (isArray(requiredPermissions) && requiredPermissions.length > 0) {
      const hasPermission = permissions.some(permission => requiredPermissions.includes(permission))
      hasPermission || el.parentNode?.removeChild(el)
    } else {
      throw new Error(`参数必须是一个非空权限数组，例如：v-permission="['user:create']"`)
    }
  }
}

export function installPermissionDirective(app: App) {
  app.directive("permission", permission)
}
