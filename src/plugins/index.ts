import type { App } from "vue"
import { installPermissionDirective } from "./permission-directive"
import { installSvgIcon } from "./svg-icon"

export function installPlugins(app: App) {
  installPermissionDirective(app)
  installSvgIcon(app)
}
