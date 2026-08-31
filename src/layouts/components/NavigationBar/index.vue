<script lang="ts" setup>
import Screenfull from "@@/components/Screenfull/index.vue"
import { ROLE_ADMIN } from "@@/constants/roles"
import { useAppStore } from "@/pinia/stores/app"
import { useUserStore } from "@/pinia/stores/user"
import { layoutsConfig } from "../../config"
import { Hamburger } from "../index"

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const pageTitle = computed(() => String(route.meta.showTitle || route.meta.title || "首页"))
const isSubPage = computed(() => Boolean(route.meta.hidden))
const isAdmin = computed(() => userStore.roles.includes(ROLE_ADMIN))
const userInitials = computed(() => userStore.username.substring(0, 2).toUpperCase())

function toggleSidebar() {
  appStore.toggleSidebar(false)
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  const activeMenu = route.meta.activeMenu
  router.push(typeof activeMenu === "string" && activeMenu ? activeMenu : "/")
}

function handleLogout() {
  ElMessageBox.confirm("确定退出登录吗?", "退出登录", {
    confirmButtonText: "确定退出",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await userStore.logout()
    ElMessage.success("已退出登录")
  }).catch(() => undefined)
}
</script>

<template>
  <header class="navigation-bar">
    <div class="header-left">
      <button type="button" class="header-action" title="展开或收起菜单" @click="toggleSidebar">
        <Hamburger :is-active="appStore.sidebar.opened" />
      </button>

      <button
        v-if="isSubPage"
        type="button"
        class="back-action"
        title="返回上一页"
        @click="goBack"
      >
        <span class="i-ep-arrow-left" />
      </button>

      <h2 class="page-title">
        {{ pageTitle }}
      </h2>
    </div>

    <div class="right-menu">
      <Screenfull v-if="layoutsConfig.showScreenfull" class="screenfull-btn" />

      <el-dropdown trigger="click">
        <button type="button" class="user-trigger">
          <span class="user-avatar">{{ userInitials }}</span>
          <span class="user-meta">
            <strong class="user-name">{{ userStore.username }}</strong>
            <span class="user-role">{{ isAdmin ? "管理员" : "普通用户" }}</span>
          </span>
          <span class="i-ep-arrow-down user-arrow" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">
              <span class="i-ep-switch-button mr-2" />
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navigation-bar {
  height: var(--v3-navigationbar-height);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: var(--v3-navigationbar-text-color);
  background: var(--v3-header-bg-color);
  backdrop-filter: blur(14px);
}

.header-left,
.right-menu,
.user-trigger {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 0;
  flex: 1;
  gap: 10px;
}

.header-action,
.back-action {
  appearance: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  outline: none;
  color: var(--app-secondary);
  background: transparent;
  cursor: pointer;
  transition: var(--app-transition);
}

.header-action {
  width: 34px;
  height: 34px;
  border-radius: 8px;

  &:hover {
    color: var(--app-primary);
    background: var(--app-primary-light);
  }
}

.back-action {
  width: 30px;
  height: 30px;
  margin-left: 2px;
  border-radius: 8px;
  font-size: 17px;

  &:hover {
    color: var(--app-primary);
    background: var(--app-primary-light);
  }
}

.page-title {
  max-width: 52vw;
  margin: 0 0 0 4px;
  overflow: hidden;
  color: var(--app-dark);
  font-size: 20px;
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-menu {
  flex-shrink: 0;
  gap: 10px;
}

.screenfull-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: transparent;
}

.user-trigger {
  appearance: none;
  gap: 9px;
  padding: 4px 6px;
  border: none;
  outline: none;
  box-shadow: none;
  border-radius: 9px;
  color: inherit;
  font: inherit;
  background: transparent;
  cursor: pointer;
  transition: var(--app-transition);

  &:hover {
    background: var(--app-bg-section);
  }

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: none;
}

.user-avatar {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  color: #ffffff;
  background: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
}

.user-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  line-height: 1.2;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  color: var(--app-dark);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  margin-top: 3px;
  color: var(--app-text-secondary);
  font-size: 11px;
  font-weight: 400;
}

.user-arrow {
  margin-left: 1px;
  color: #94a3b8;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .navigation-bar {
    padding: 0 14px;
  }

  .user-meta,
  .user-arrow {
    display: none;
  }

  .page-title {
    max-width: 48vw;
    font-size: 17px;
  }

  .user-trigger {
    padding: 3px;
  }
}
</style>
