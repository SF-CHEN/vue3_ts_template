import type { LayoutsConfig } from "./types"
import { getLayoutsConfig } from "@@/utils/local-storage"

export type { LayoutsConfig } from "./types"

/** 默认配置 */
const DEFAULT_CONFIG: LayoutsConfig = {
  showSettings: false,
  showTagsView: false,
  fixedHeader: true,
  showFooter: false,
  showLogo: true,
  showScreenfull: false,
  cacheTagsView: false,
  showWatermark: false,
  showGreyMode: false,
  showColorWeakness: false
}

/** 项目配置 */
export const layoutsConfig: LayoutsConfig = {
  ...DEFAULT_CONFIG,
  ...getLayoutsConfig(),
  showSettings: DEFAULT_CONFIG.showSettings
}
