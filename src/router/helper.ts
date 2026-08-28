import { isExternal } from "@@/utils/validate"

/** 合并菜单和标签页的父子路由路径。 */
export function resolveRoutePath(basePath = "", routePath = "") {
  if (isExternal(routePath)) return routePath
  if (isExternal(basePath)) return basePath
  if (routePath.startsWith("/")) return routePath

  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath
  const fullPath = `${normalizedBase}/${routePath}`
  return fullPath.startsWith("/") ? fullPath : `/${fullPath}`
}
