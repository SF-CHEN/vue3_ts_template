<script lang="ts" setup>
import Screenfull from "@@/components/Screenfull/index.vue"
import { useDevice } from "@@/composables/useDevice"
import { ROLE_ADMIN } from "@@/constants/roles"
import { useDark, useToggle } from "@vueuse/core"
import { useAppStore } from "@/pinia/stores/app"
import { useUserStore } from "@/pinia/stores/user"
import { layoutsConfig } from "../../config"
import { Hamburger } from "../index"

const route = useRoute()
const router = useRouter()
const { isMobile } = useDevice()
const appStore = useAppStore()
const userStore = useUserStore()

const isDark = useDark()
const toggleDark = useToggle(isDark)

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
  ElMessageBox.confirm("确定退出登录吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await userStore.logout()
    ElMessage.success("退出登录成功!")
  }).catch(() => undefined)
}
</script>

<template>
  <div class="navigation-bar">
    <div class="header-left">
      <Hamburger
        v-if="isMobile"
        :is-active="appStore.sidebar.opened"
        class="hamburger"
        @toggle-click="toggleSidebar"
      />
      <button
        v-if="isSubPage"
        type="button"
        class="nav-icon-btn back-btn"
        title="返回上一页"
        @click="goBack"
      >
        <span class="i-ep-arrow-left" />
      </button>
      <button
        v-else
        type="button"
        class="nav-icon-btn home-btn"
        title="返回首页"
        @click="goHome"
      >
        <span class="i-ep-home-filled" />
      </button>
      <h2 class="page-title">
        {{ pageTitle }}
      </h2>
    </div>
    <div class="right-menu">
      <div class="action-items">
        <el-tooltip effect="dark" :content="isDark ? '切换亮色主题' : '切换暗黑主题'" placement="bottom">
          <button type="button" class="nav-icon-btn" @click="toggleDark()">
            <span v-if="isDark" class="i-ep-sunny" />
            <span v-else class="i-ep-moon" />
          </button>
        </el-tooltip>
        <Screenfull v-if="layoutsConfig.showScreenfull" class="screenfull-btn" />
      </div>
      <el-dropdown>
        <div class="user-info">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-meta">
            <div class="user-name">
              {{ userStore.username }}
            </div>
            <div class="user-role">
              {{ isAdmin ? "管理员" : "普通用户" }}
            </div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation-bar {
  min-height: var(--v3-navigationbar-height);
  height: auto;
  padding: 18px 30px 12px;
  overflow: visible;
  color: var(--v3-navigationbar-text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--app-page-bg);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 0;
  flex: 1;
}

.hamburger {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--app-accent);
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
    border-color: rgba(64, 158, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.back-btn {
  font-size: 20px;
  color: var(--app-accent);
  background: rgba(0, 0, 0, 0.04);
  border-color: var(--app-border-light, rgba(0, 0, 0, 0.08));

  &:hover {
    color: #409eff;
  }
}

.home-btn {
  font-size: 26px;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.3;
  color: var(--app-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-menu {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
}

.action-items {
  display: flex;
  align-items: center;
  gap: 8px;
}

.screenfull-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 10px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  outline: none;
  font-size: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--app-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.user-meta {
  line-height: 1.35;
}

.user-name {
  font-weight: bold;
  font-size: 16px;
  color: var(--app-dark);
}

.user-role {
  font-size: 0.85rem;
  color: #777;
}

@media screen and (max-width: 576px) {
  .navigation-bar {
    padding: 12px;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .user-meta {
    display: none;
  }
}
</style>
