import { isExternal } from "@@/utils/validate"

/** 解析合并路径，替代对 path-browserify 的依赖 */
export function resolveRoutePath(basePath = "", routePath = "") {
  if (isExternal(routePath)) return routePath
  if (isExternal(basePath)) return basePath
  if (routePath.startsWith("/")) return routePath
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath
  const normalizedPath = routePath.startsWith("/") ? routePath.slice(1) : routePath
  const fullPath = `${normalizedBase}/${normalizedPath}`
  return fullPath.startsWith("/") ? fullPath : `/${fullPath}`
}
