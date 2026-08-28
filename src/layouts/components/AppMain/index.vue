<script lang="ts" setup>
import { useSettingsStore } from "@/pinia/stores/settings"
import { useTagsViewStore } from "@/pinia/stores/tags-view"
import { Footer } from "../index"

const tagsViewStore = useTagsViewStore()

const settingsStore = useSettingsStore()
</script>

<template>
  <section class="app-main">
    <div class="app-scrollbar">
      <!-- key 采用 route.path 和 route.fullPath 有着不同的效果，大多数时候 path 更通用 -->
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" :key="route.path" class="app-container-grow" />
          </keep-alive>
        </transition>
      </router-view>
      <!-- 页脚 -->
      <Footer v-if="settingsStore.showFooter" />
    </div>
    <!-- 返回顶部：滚动容器为外层 .app-main -->
    <el-backtop target=".app-main" />
  </section>
</template>

<style lang="scss" scoped>
@import "@@/assets/styles/mixins.scss";

.app-main {
  width: 100%;
  /* 允许在 flex 列布局下被内容区宽度约束，避免宽表撑出整页横滚 */
  min-width: 0;
  display: flex;
}

.app-scrollbar {
  flex-grow: 1;
  min-width: 0;
  width: 100%;
  /* 滚动交给外层 .app-main，避免内容区内嵌滚动条 */
  overflow: visible;
  display: flex;
  flex-direction: column;

  :deep(.app-container-grow) {
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
  }

  // 白底卡片页：高度跟内容走，不撑满主内容区
  :deep(.app-container-grow.page-card) {
    flex-grow: 0;
  }
}
</style>
