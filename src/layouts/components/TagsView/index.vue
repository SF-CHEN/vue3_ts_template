<script lang="ts" setup>
import type { RouteLocationNormalizedGeneric, RouteRecordRaw, RouterLink } from "vue-router"
import type { TagView } from "@/pinia/stores/tags-view"
import { usePermissionStore } from "@/pinia/stores/permission"
import { useTagsViewStore } from "@/pinia/stores/tags-view"
import { DASHBOARD_PATH, REDIRECT_PATH } from "@/router/config"
import { resolveRoutePath } from "@/router/helper"
import ScrollPane from "./ScrollPane.vue"

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

const tagRefs = useTemplateRef<InstanceType<typeof RouterLink>[]>("tagRefs")
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({})
let affixTags: TagView[] = []

function isActive(tag: TagView) {
  return tag.path === route.path
}

function isAffix(tag: TagView) {
  return tag.meta?.affix
}

function filterAffixTags(routes: RouteRecordRaw[], basePath = "/") {
  const tags: TagView[] = []
  routes.forEach((route) => {
    if (isAffix(route)) {
      const tagPath = resolveRoutePath(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      tags.push(...childTags)
    }
  })
  return tags
}

function initTags() {
  // 固定标签来自当前用户已经过滤后的可访问路由，避免把无权限页面提前放进标签栏。
  affixTags = filterAffixTags(permissionStore.routes)
  for (const tag of affixTags) {
    tag.name && tagsViewStore.addVisitedView(tag)
  }
}

function addTags(targetRoute: RouteLocationNormalizedGeneric) {
  // 匿名路由无法可靠参与 keepAlive 和标签识别，因此只记录具名页面。
  if (targetRoute.name) {
    tagsViewStore.addVisitedView(targetRoute)
  }
}

function refreshSelectedTag(view: TagView) {
  // 先移除 keepAlive 缓存，再走 redirect 中转页，才能真正重新创建当前页面实例。
  tagsViewStore.delCachedView(view)
  router.replace({ path: `${REDIRECT_PATH}${view.path}`, query: view.query })
}

function closeSelectedTag(view: TagView) {
  // 关闭标签时同步清理缓存，避免页面虽然不可见但组件实例仍长期保留。
  tagsViewStore.delVisitedView(view)
  tagsViewStore.delCachedView(view)
  isActive(view) && toLastView(tagsViewStore.visitedViews, view)
}

function closeOthersTags() {
  const fullPath = selectedTag.value.fullPath
  if (fullPath !== route.path && fullPath !== undefined) {
    router.push(fullPath)
  }
  tagsViewStore.delOthersVisitedViews(selectedTag.value)
  tagsViewStore.delOthersCachedViews(selectedTag.value)
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllVisitedViews()
  tagsViewStore.delAllCachedViews()
  if (affixTags.some(tag => tag.path === route.path)) return
  toLastView(tagsViewStore.visitedViews, view)
}

function toLastView(visitedViews: TagView[], view: TagView) {
  const latestView = visitedViews.slice(-1)[0]
  const fullPath = latestView?.fullPath
  if (fullPath !== undefined) {
    router.push(fullPath)
  } else if (view.path === DASHBOARD_PATH) {
    // 首页没有可回退标签时仍通过 redirect 刷新，避免复用已关闭的页面实例。
    router.push({ path: `${REDIRECT_PATH}${view.path}`, query: view.query })
  } else {
    router.push("/")
  }
}

function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 100
  const maxLeft = document.body.offsetWidth - menuMinWidth
  const preferredLeft = e.clientX + 10

  // 限制右键菜单不超出视口，避免靠右的标签打开菜单后被裁切。
  left.value = preferredLeft > maxLeft ? maxLeft : preferredLeft
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

function closeMenu() {
  visible.value = false
}

watch(visible, (value) => {
  value ? document.body.addEventListener("click", closeMenu) : document.body.removeEventListener("click", closeMenu)
})

initTags()

watch(
  () => route.path,
  () => {
    addTags(route)
  },
  { immediate: true }
)
</script>

<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper" :tag-refs="tagRefs">
      <router-link
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        ref="tagRefs"
        :class="{ active: isActive(tag) }"
        class="tags-view-item"
        draggable="false"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) && closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.title }}
        <el-icon v-if="!isAffix(tag)" :size="12" @click.prevent.stop="closeSelectedTag(tag)">
          <span class="i-ep-close" />
        </el-icon>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" class="contextmenu" :style="{ left: `${left}px`, top: `${top}px` }">
      <li @click="refreshSelectedTag(selectedTag)">
        刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">
        关闭其它
      </li>
      <li @click="closeAllTags(selectedTag)">
        关闭所有
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--v3-tagsview-height);
  width: 100%;
  color: var(--v3-tagsview-text-color);
  overflow: hidden;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      border: 1px solid var(--v3-tagsview-tag-border-color);
      border-radius: var(--v3-tagsview-tag-border-radius);
      background-color: var(--v3-tagsview-tag-bg-color);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 5px;
      }
      &.active {
        background-color: var(--v3-tagsview-tag-active-bg-color);
        color: var(--v3-tagsview-tag-active-text-color);
        border-color: var(--v3-tagsview-tag-active-border-color);
      }
      .el-icon {
        margin-left: 5px;
        margin-right: 1px;
        border-radius: 50%;
        &:hover {
          background-color: var(--v3-tagsview-tag-icon-hover-bg-color);
          color: var(--v3-tagsview-tag-icon-hover-color);
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    color: var(--v3-tagsview-contextmenu-text-color);
    background-color: var(--v3-tagsview-contextmenu-bg-color);
    box-shadow: var(--v3-tagsview-contextmenu-box-shadow);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        color: var(--v3-tagsview-contextmenu-hover-text-color);
        background-color: var(--v3-tagsview-contextmenu-hover-bg-color);
      }
    }
  }
}
</style>
