<script lang="ts" setup>
import { useDevice } from "@@/composables/useDevice"
import { useAppStore } from "@/pinia/stores/app"
import { layoutsConfig } from "../config"
import { AppMain, NavigationBar, Sidebar, TagsView } from "../components"

const { isMobile } = useDevice()
const appStore = useAppStore()

const layoutClasses = computed(() => ({
  "hide-sidebar": !appStore.sidebar.opened,
  "open-sidebar": appStore.sidebar.opened,
  "without-animation": appStore.sidebar.withoutAnimation,
  "mobile": isMobile.value
}))

function handleClickOutside() {
  appStore.closeSidebar(false)
}
</script>

<template>
  <div :class="layoutClasses" class="app-wrapper">
    <div v-if="layoutClasses.mobile && layoutClasses['open-sidebar']" class="drawer-bg" @click="handleClickOutside" />
    <Sidebar class="sidebar-container" />
    <div :class="{ 'has-tags-view': layoutsConfig.showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': layoutsConfig.fixedHeader }" class="layout-header">
        <NavigationBar />
        <TagsView v-if="layoutsConfig.showTagsView" />
      </div>
      <AppMain class="app-main" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@@/assets/styles/mixins.scss";
$transition-time: 0.24s;

.app-wrapper {
  @extend %clearfix;
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--app-page-bg);
}

.drawer-bg {
  position: fixed;
  inset: 0;
  z-index: 2001;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(2px);
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 2002;
  width: var(--v3-sidebar-width);
  height: 100%;
  overflow: hidden;
  border-right: var(--v3-sidebar-border-right);
  box-shadow: 4px 0 24px rgba(15, 23, 42, 0.08);
  transition: width $transition-time ease;
}

.main-container {
  position: relative;
  height: 100%;
  margin-left: var(--v3-sidebar-width);
  display: flex;
  flex-direction: column;
  background: var(--app-page-bg);
  transition: margin-left $transition-time ease;
}

.fixed-header {
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--v3-sidebar-width));
  transition: width $transition-time ease;
}

.layout-header {
  position: relative;
  z-index: 9;
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: var(--v3-header-border-bottom);
  background: var(--v3-header-bg-color);
  box-shadow: var(--v3-header-box-shadow);
}

.app-main {
  @extend %scrollbar;
  position: relative;
  min-width: 0;
  min-height: 0;
  flex: 1;
  overflow: auto;
  padding: 24px;
}

.fixed-header + .app-main {
  padding-top: calc(var(--v3-navigationbar-height) + 24px);
}

.has-tags-view {
  .fixed-header + .app-main {
    padding-top: calc(var(--v3-header-height) + 24px);
  }
}

.hide-sidebar {
  .sidebar-container {
    width: var(--v3-sidebar-hide-width);
  }

  .main-container {
    margin-left: var(--v3-sidebar-hide-width);
  }

  .fixed-header {
    width: calc(100% - var(--v3-sidebar-hide-width));
  }
}

.mobile {
  .sidebar-container {
    width: var(--v3-sidebar-width);
    transform: translateX(0);
    transition: transform $transition-time ease;
  }

  .main-container {
    margin-left: 0;
  }

  .fixed-header {
    width: 100%;
  }

  &.open-sidebar {
    position: fixed;
    inset: 0;
  }

  &.hide-sidebar .sidebar-container {
    pointer-events: none;
    transform: translateX(calc(0px - var(--v3-sidebar-width)));
  }

  .app-main {
    padding: 16px;
  }

  .fixed-header + .app-main {
    padding-top: calc(var(--v3-navigationbar-height) + 16px);
  }

  &.has-tags-view .fixed-header + .app-main {
    padding-top: calc(var(--v3-header-height) + 16px);
  }
}

.without-animation {
  .sidebar-container,
  .main-container,
  .fixed-header {
    transition: none;
  }
}
</style>
