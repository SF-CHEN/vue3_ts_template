<script lang="ts" setup>
import { useAppStore } from "@/pinia/stores/app"
import { usePermissionStore } from "@/pinia/stores/permission"
import { layoutsConfig } from "../../config"
import { Logo } from "../index"
import Item from "./Item.vue"

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeMenu = computed(() => route.meta.activeMenu || route.path)
const noHiddenRoutes = computed(() => permissionStore.routes.filter(item => !item.meta?.hidden))
const isCollapse = computed(() => !appStore.sidebar.opened)

const sidebarMenuBgColor = "var(--v3-sidebar-menu-bg-color)"
const sidebarMenuTextColor = "var(--v3-sidebar-menu-text-color)"
const sidebarMenuActiveTextColor = "var(--v3-sidebar-menu-active-text-color)"
</script>

<template>
  <aside :class="{ 'has-logo': layoutsConfig.showLogo }" class="sidebar-shell">
    <Logo v-if="layoutsConfig.showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="sidebarMenuBgColor"
        :text-color="sidebarMenuTextColor"
        :active-text-color="sidebarMenuActiveTextColor"
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
  </aside>
</template>

<style lang="scss" scoped>
.has-logo .el-scrollbar {
  height: calc(100% - 72px);
}

.sidebar-shell {
  height: 100%;
  color: #cbd5e1;
  background: #0f172a;
}

.el-scrollbar {
  height: 100%;

  :deep(.scrollbar-wrapper) {
    overflow-x: hidden;
    padding: 10px 8px 18px;
  }

  :deep(.el-scrollbar__bar.is-horizontal) {
    display: none;
  }
}

.el-menu {
  width: 100%;
  border: none;
  background: transparent !important;
  user-select: none;
}

.sidebar-shell :deep(.el-menu-item),
.sidebar-shell :deep(.el-sub-menu__title),
.sidebar-shell :deep(.el-sub-menu .el-menu-item) {
  position: relative;
  height: var(--v3-sidebar-menu-item-height);
  min-width: 0;
  margin: 4px 4px;
  padding: 0 14px !important;
  display: flex;
  align-items: center;
  border-radius: 9px;
  color: #94a3b8 !important;
  font-size: 13px;
  line-height: var(--v3-sidebar-menu-item-height);
  transition: background-color 0.18s ease, color 0.18s ease;

  .el-icon,
  .svg-icon {
    width: 18px;
    height: 18px;
    margin-right: 11px !important;
    flex-shrink: 0;
    color: #64748b;
    font-size: 18px;
    transition: color 0.18s ease;
  }

  .title {
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: #f8fafc !important;
    background: rgba(255, 255, 255, 0.065) !important;

    .el-icon,
    .svg-icon {
      color: #cbd5e1;
    }
  }
}

.sidebar-shell :deep(.el-menu-item.is-active) {
  color: #ffffff !important;
  background: #2563eb !important;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);

  .el-icon,
  .svg-icon {
    color: #ffffff;
  }
}

.sidebar-shell :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #f8fafc !important;

  .el-icon,
  .svg-icon {
    color: #94a3b8;
  }
}

.sidebar-shell :deep(.el-menu-item-group) {
  margin: 12px 0;

  .el-menu-item-group__title {
    padding: 10px 18px 6px !important;
    color: #64748b !important;
    background: transparent !important;
    font-size: 10px !important;
    font-weight: 700;
    line-height: 1.4 !important;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
}

.el-menu--collapse {
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    width: 48px;
    margin: 4px auto;
    padding: 0 !important;
    justify-content: center;

    .el-icon,
    .svg-icon {
      margin-right: 0 !important;
    }
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: #ffffff !important;
    background: rgba(37, 99, 235, 0.22) !important;
  }
}
</style>
