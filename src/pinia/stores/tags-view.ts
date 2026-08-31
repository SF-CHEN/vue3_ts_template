import type { RouteLocationNormalizedGeneric } from "vue-router"
import {
  getCachedViews,
  getVisitedViews,
  removeCachedViews,
  removeVisitedViews,
  setCachedViews,
  setVisitedViews
} from "@@/utils/local-storage"
import { layoutsConfig } from "@/layouts/config"

export type TagView = Partial<RouteLocationNormalizedGeneric>

export const useTagsViewStore = defineStore("tags-view", () => {
  const visitedViews = ref<TagView[]>(layoutsConfig.cacheTagsView ? getVisitedViews() : [])
  const cachedViews = ref<string[]>(layoutsConfig.cacheTagsView ? getCachedViews() : [])

  if (layoutsConfig.cacheTagsView) {
    watch(
      [visitedViews, cachedViews],
      () => {
        setVisitedViews(visitedViews.value)
        setCachedViews(cachedViews.value)
      },
      { deep: true }
    )
  } else {
    removeVisitedViews()
    removeCachedViews()
  }

  const addVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex(item => item.path === view.path)
    if (index === -1) {
      visitedViews.value.push({ ...view })
      return
    }
    if (visitedViews.value[index].fullPath !== view.fullPath) {
      visitedViews.value[index] = { ...view }
    }
  }

  const addCachedView = (view: TagView) => {
    if (typeof view.name !== "string" || !view.meta?.keepAlive) return
    if (!cachedViews.value.includes(view.name)) cachedViews.value.push(view.name)
  }

  const delVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex(item => item.path === view.path)
    if (index !== -1) visitedViews.value.splice(index, 1)
  }

  const delCachedView = (view: TagView) => {
    if (typeof view.name !== "string") return
    const index = cachedViews.value.indexOf(view.name)
    if (index !== -1) cachedViews.value.splice(index, 1)
  }

  const delOthersVisitedViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter(item => item.meta?.affix || item.path === view.path)
  }

  const delOthersCachedViews = (view: TagView) => {
    if (typeof view.name !== "string") return
    cachedViews.value = cachedViews.value.includes(view.name) ? [view.name] : []
  }

  const delAllVisitedViews = () => {
    visitedViews.value = visitedViews.value.filter(item => item.meta?.affix)
  }

  const delAllCachedViews = () => {
    cachedViews.value = []
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllVisitedViews,
    delAllCachedViews
  }
})
