const SYSTEM_NAME = "vue-admin-template"

export const CacheKey = {
  TOKEN: `${SYSTEM_NAME}-token-key`,
  SIDEBAR_STATUS: `${SYSTEM_NAME}-sidebar-status-key`,
  VISITED_VIEWS: `${SYSTEM_NAME}-visited-views-key`,
  CACHED_VIEWS: `${SYSTEM_NAME}-cached-views-key`
} as const
