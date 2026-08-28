<script lang="ts" setup>
import { ROLE_ADMIN } from "@@/constants/roles"
import { useUserStore } from "@/pinia/stores/user"

defineOptions({ name: "Dashboard" })

const userStore = useUserStore()

const isAdmin = computed(() => userStore.roles.includes(ROLE_ADMIN))

const tips = [
  { title: "路由", desc: "在 src/router/index.ts 的 dynamicRoutes 中注册新页面" },
  { title: "API", desc: "在 src/common/apis 下新增接口，认证请改 auth.ts 适配层" },
  { title: "Store", desc: "在 src/pinia/stores 按模块新增状态" },
  { title: "CRUD", desc: "参考「示例 → 文章管理」使用 CustomTable / Form / Dialog" }
]
</script>

<template>
  <div class="dashboard">
    <el-card shadow="never" class="welcome-card">
      <h2>欢迎使用 Vue Admin Template</h2>
      <p>
        当前用户：<strong>{{ userStore.username || "-" }}</strong>
        · 角色：{{ isAdmin ? "管理员" : "普通用户" }}
      </p>
      <p class="hint">
        这是模板首页。左侧「示例」菜单中有完整 CRUD 演示页面。
      </p>
    </el-card>

    <div class="tips-grid">
      <el-card v-for="item in tips" :key="item.title" shadow="hover" class="tip-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card {
  h2 {
    margin: 0 0 12px;
    font-size: 1.5rem;
    color: var(--app-dark, #2c3e50);
  }

  p {
    margin: 0 0 8px;
    color: #606266;
    line-height: 1.6;
  }

  .hint {
    margin-top: 12px;
    color: #909399;
  }
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.tip-card {
  h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: var(--app-dark, #2c3e50);
  }

  p {
    margin: 0;
    color: #606266;
    line-height: 1.5;
    font-size: 0.95rem;
  }
}
</style>
