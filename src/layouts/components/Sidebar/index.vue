<script lang="ts" setup>
import { getCssVar } from "@@/utils/css"
import { useAppStore } from "@/pinia/stores/app"
import { usePermissionStore } from "@/pinia/stores/permission"
import { useSettingsStore } from "@/pinia/stores/settings"
import { Logo } from "../index"
import Item from "./Item.vue"

const v3SidebarMenuBgColor = getCssVar("--v3-sidebar-menu-bg-color")

const v3SidebarMenuTextColor = getCssVar("--v3-sidebar-menu-text-color")

const v3SidebarMenuActiveTextColor = getCssVar("--v3-sidebar-menu-active-text-color")

const route = useRoute()

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const settingsStore = useSettingsStore()

const activeMenu = computed(() => route.meta.activeMenu || route.path)

const noHiddenRoutes = computed(() => permissionStore.routes.filter(item => !item.meta?.hidden))

const isCollapse = computed(() => !appStore.sidebar.opened)

const isLogo = computed(() => settingsStore.showLogo)

const sidebarMenuItemHeight = "var(--v3-sidebar-menu-item-height)"

const sidebarMenuHoverBgColor = "var(--v3-sidebar-menu-hover-bg-color)"

const tipLineWidth = "4px"
</script>

<template>
  <div :class="{ 'has-logo': isLogo }" class="is-left-mode">
    <Logo v-if="isLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="v3SidebarMenuBgColor"
        :text-color="v3SidebarMenuTextColor"
        :active-text-color="v3SidebarMenuActiveTextColor"
        :collapse-transition="false"
        :unique-opened="false"
        mode="vertical"
      >
        <Item
          v-for="noHiddenRoute in noHiddenRoutes"
          :key="noHiddenRoute.path"
          :item="noHiddenRoute"
          :base-path="noHiddenRoute.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
%tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--app-accent);
  }
}

.has-logo {
  .el-scrollbar {
    /* Logo 为 padding 撑开，预留约 72px+ */
    height: calc(100% - 80px);
  }
}

.is-left-mode {
  height: 100%;
  /* 与旧 sidebar.vue 一致：dark → secondary */
  background: linear-gradient(135deg, var(--app-dark), var(--app-secondary));
  box-shadow: var(--app-shadow);
  color: white;
}

.el-scrollbar {
  height: 100%;

  :deep(.scrollbar-wrapper) {
    overflow-x: hidden;
  }

  :deep(.el-scrollbar__bar.is-horizontal) {
    display: none;
  }
}

.el-menu {
  user-select: none;
  border: none;
  width: 100%;
  background: transparent !important;
}

.el-menu--horizontal {
  height: v-bind(sidebarMenuItemHeight);
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item),
:deep(.el-menu--horizontal .el-menu-item) {
  height: v-bind(sidebarMenuItemHeight);
  line-height: v-bind(sidebarMenuItemHeight);
  font-size: 14px;

  &.is-active,
  &:hover {
    background-color: v-bind(sidebarMenuHoverBgColor);
  }
}

/**
 * 以下数值直接来自旧项目 layouts/components/sidebar.vue
 * .nav-section { margin: 20px 0 }
 * .nav-section h3 { padding: 10px 20px; font-size: 0.9rem; ... }
 * .nav-links li { padding: 12px 20px; }
 */
.is-left-mode :deep(.el-menu-item-group) {
  margin: 20px 0;

  .el-menu-item-group__title {
    padding: 10px 20px !important;
    font-size: 0.9rem !important;
    font-weight: 500;
    line-height: 1.6 !important;
    color: rgb(255 255 255 / 70%) !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: default;
    background: transparent !important;
  }
}

.is-left-mode :deep(.el-menu-item) {
  padding: 12px 20px !important;
  height: auto !important;
  min-height: 0 !important;
  line-height: 1.6 !important;
  margin: 0 !important;
  border-left: 4px solid transparent;
  transition: var(--app-transition);
  display: flex;
  align-items: center;

  .el-icon,
  .svg-icon {
    margin-right: 10px !important;
    width: 12px;
    height: 12px;
    font-size: 12px;
    text-align: center;
    flex-shrink: 0;
  }

  .title {
    font-size: 14px;
  }

  &:hover {
    background-color: rgb(255 255 255 / 10%) !important;
  }

  &.is-active {
    background-color: rgb(52 152 219 / 20%) !important;
    border-left-color: var(--app-accent);
    color: #ffffff !important;

    &::before {
      display: none;
    }
  }
}

.el-menu--collapse {
  :deep(.el-sub-menu.is-active .el-sub-menu__title) {
    @extend %tip-line;
    background-color: v-bind(sidebarMenuHoverBgColor);
  }
}
</style>
