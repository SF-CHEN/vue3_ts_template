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
$transition-time: 0.35s;

.app-wrapper {
  @extend %clearfix;
  position: relative;
  width: 100%;
  height: 100%;
}

.drawer-bg {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 2001;
}

.sidebar-container {
  background: linear-gradient(135deg, var(--app-dark), var(--app-secondary));
  transition: width $transition-time;
  width: var(--v3-sidebar-width);
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 2002;
  overflow: hidden;
  border-right: var(--v3-sidebar-border-right);
  box-shadow: var(--app-shadow);
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: margin-left $transition-time;
  margin-left: var(--v3-sidebar-width);
  position: relative;
  background-color: var(--app-page-bg);
}

.fixed-header {
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--v3-sidebar-width));
  transition: width $transition-time;
}

.layout-header {
  position: relative;
  z-index: 9;
  flex-shrink: 0;
  background-color: var(--v3-header-bg-color);
  box-shadow: var(--v3-header-box-shadow);
  border-bottom: var(--v3-header-border-bottom);
}

.app-main {
  flex: 1;
  min-height: 0;
  min-width: 0;
  position: relative;
  overflow: auto;
  @extend %scrollbar;
  padding: 16px 30px 30px;
}

.fixed-header + .app-main {
  padding-top: calc(var(--v3-navigationbar-height) + 16px);
}

.has-tags-view {
  .fixed-header + .app-main {
    padding-top: calc(var(--v3-header-height) + 16px);
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
    transition: transform $transition-time;
    width: var(--v3-sidebar-width);
  }
  .main-container {
    margin-left: 0px;
  }
  .fixed-header {
    width: 100%;
  }
  &.open-sidebar {
    position: fixed;
    top: 0;
  }
  &.hide-sidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(0px - var(--v3-sidebar-width)), 0, 0);
    }
  }
}

.without-animation {
  .sidebar-container,
  .main-container {
    transition: none;
  }
}
</style>
