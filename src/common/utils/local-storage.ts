import type { SidebarClosed, SidebarOpened } from "@@/constants/app-key"
import type { TagView } from "@/pinia/stores/tags-view"
import { CacheKey } from "@@/constants/cache-key"

function readJson<T>(key: string, fallback: T): T {
  const json = localStorage.getItem(key)
  if (!json) return fallback

  try {
    return JSON.parse(json) as T
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function getToken() {
  return localStorage.getItem(CacheKey.TOKEN)
}

export function setToken(token: string) {
  localStorage.setItem(CacheKey.TOKEN, token)
}

export function removeToken() {
  localStorage.removeItem(CacheKey.TOKEN)
}

export function getSidebarStatus() {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS)
}

export function setSidebarStatus(sidebarStatus: SidebarOpened | SidebarClosed) {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus)
}

export function getVisitedViews() {
  return readJson<TagView[]>(CacheKey.VISITED_VIEWS, [])
}

export function setVisitedViews(views: TagView[]) {
  const serializableViews = views.map(view => ({
    name: view.name,
    path: view.path,
    fullPath: view.fullPath,
    hash: view.hash,
    query: view.query,
    params: view.params,
    meta: view.meta
  }))
  localStorage.setItem(CacheKey.VISITED_VIEWS, JSON.stringify(serializableViews))
}

export function removeVisitedViews() {
  localStorage.removeItem(CacheKey.VISITED_VIEWS)
}

export function getCachedViews() {
  return readJson<string[]>(CacheKey.CACHED_VIEWS, [])
}

export function setCachedViews(views: string[]) {
  localStorage.setItem(CacheKey.CACHED_VIEWS, JSON.stringify(views))
}

export function removeCachedViews() {
  localStorage.removeItem(CacheKey.CACHED_VIEWS)
}
