<script lang="ts" setup>
import Screenfull from "@@/components/Screenfull/index.vue"
import { useDevice } from "@@/composables/useDevice"
import { useDark, useToggle } from "@vueuse/core"
import { ROLE_ADMIN } from "@@/constants/roles"
import { useAppStore } from "@/pinia/stores/app"
import { useSettingsStore } from "@/pinia/stores/settings"
import { useUserStore } from "@/pinia/stores/user"
import { Hamburger } from "../index"

const route = useRoute()

const router = useRouter()

const { isMobile } = useDevice()

const appStore = useAppStore()

const userStore = useUserStore()

const settingsStore = useSettingsStore()

/** 暗黑模式控制 */
const isDark = useDark()
const toggleDark = useToggle(isDark)

/** 当前页标题（对齐旧顶栏：优先 showTitle） */
const pageTitle = computed(() => String(route.meta.showTitle || route.meta.title || "首页"))

/**
 * 子页（侧栏 hidden）：显示返回；菜单页：显示首页
 * 与路由 meta.hidden 约定一致，避免两个按钮同时出现
 */
const isSubPage = computed(() => Boolean(route.meta.hidden))

/** 是否管理员 */
const isAdmin = computed(() => userStore.roles.includes(ROLE_ADMIN))

/** 用户头像缩写 */
const userInitials = computed(() => {
  const name = userStore.username
  if (!name) return ""
  return name.substring(0, 2).toUpperCase()
})

/** 切换侧边栏（仅移动端展示） */
function toggleSidebar() {
  appStore.toggleSidebar(false)
}

/**
 * 全局返回：优先浏览器历史；无历史时回落到侧栏高亮路径或首页
 */
function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  const activeMenu = route.meta.activeMenu
  if (typeof activeMenu === "string" && activeMenu) {
    router.push(activeMenu)
    return
  }
  router.push("/")
}

/** 返回首页 */
function goHome() {
  router.push("/dashboard")
}

/** 退出登录 */
function handleLogout() {
  ElMessageBox.confirm("确定退出登录吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    userStore.logout()
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
        <!-- 暗黑模式切换 -->
        <el-tooltip effect="dark" :content="isDark ? '切换亮色主题' : '切换暗黑主题'" placement="bottom">
          <button type="button" class="nav-icon-btn" @click="() => toggleDark()">
            <span v-if="isDark" class="i-ep-sunny" />
            <span v-else class="i-ep-moon" />
          </button>
        </el-tooltip>
        <!-- 全屏按钮 -->
        <Screenfull v-if="settingsStore.showScreenfull" class="screenfull-btn" />
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
  /* 对齐旧 .header：不锁死过高，左右随内容区 30px */
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
