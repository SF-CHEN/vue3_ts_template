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

function goHome() {
  router.push("/dashboard")
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

      <div class="page-heading">
        <button
          v-if="isSubPage"
          type="button"
          class="back-button"
          title="返回上一页"
          @click="goBack"
        >
          <span class="i-ep-arrow-left" />
        </button>
        <button
          v-else
          type="button"
          class="home-button"
          title="返回首页"
          @click="goHome"
        >
          <span class="i-ep-house" />
        </button>
        <div class="title-group">
          <span class="title-caption">WORKSPACE</span>
          <h2 class="page-title">
            {{ pageTitle }}
          </h2>
        </div>
      </div>
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
.page-heading,
.right-menu,
.user-trigger {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 0;
  flex: 1;
  gap: 14px;
}

.header-action,
.back-button,
.home-button {
  width: 36px;
  height: 36px;
  padding: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--app-border);
  border-radius: 9px;
  color: var(--app-secondary);
  background: #ffffff;
  cursor: pointer;
  transition: var(--app-transition);

  &:hover {
    color: var(--app-primary);
    border-color: #bfdbfe;
    background: var(--app-primary-light);
  }
}

.page-heading {
  min-width: 0;
  gap: 10px;
}

.back-button,
.home-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 18px;
}

.title-group {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.title-caption {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: #94a3b8;
  letter-spacing: 0.12em;
}

.page-title {
  max-width: 46vw;
  margin: 0;
  overflow: hidden;
  color: var(--app-dark);
  font-size: 18px;
  font-weight: 650;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-menu {
  flex-shrink: 0;
  gap: 10px;
}

.screenfull-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--app-border);
  border-radius: 9px;
  background: #ffffff;
}

.user-trigger {
  gap: 10px;
  padding: 5px 8px 5px 6px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition: var(--app-transition);

  &:hover {
    border-color: var(--app-border);
    background: var(--app-bg-section);
  }
}

.user-avatar {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 9px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22);
  font-size: 12px;
  font-weight: 700;
}

.user-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.25;
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
  margin-top: 2px;
  color: var(--app-text-secondary);
  font-size: 11px;
}

.user-arrow {
  color: #94a3b8;
  font-size: 13px;
}

@media screen and (max-width: 768px) {
  .navigation-bar {
    padding: 0 14px;
  }

  .title-caption,
  .user-meta,
  .user-arrow {
    display: none;
  }

  .page-title {
    max-width: 42vw;
    font-size: 16px;
  }

  .user-trigger {
    padding: 4px;
  }
}
</style>
