/**
 * 布局配置。
 *
 * 保持为静态配置：需要某项能力时直接修改这里，不为模板默认引入运行时配置面板和持久化状态。
 */
export const layoutsConfig = {
  showTagsView: false,
  fixedHeader: true,
  showFooter: false,
  showLogo: true,
  showScreenfull: false,
  cacheTagsView: false,
  showWatermark: false,
  showGreyMode: false,
  showColorWeakness: false
} as const
