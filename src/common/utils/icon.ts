/**
 * 将路由 / 业务中的图标标识转为 UnoCSS Iconify 类名
 * - `fa-solid:tasks` → `i-fa-solid-tasks`
 * - `ep:plus` → `i-ep-plus`
 * - `User`（兼容旧 elIcon PascalCase）→ `i-ep-user`
 */
export function toIconClass(icon: string): string {
  if (!icon) return ""
  if (icon.includes(":")) {
    const [prefix, name] = icon.split(":")
    return `i-${prefix}-${name}`
  }
  return `i-ep-${icon.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`
}
