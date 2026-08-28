<script lang="ts" setup>
import type { FormRules } from "element-plus"
import type { LoginFormData } from "./types"
import { authApi } from "@@/apis/auth"
import { useUserStore } from "@/pinia/stores/user"

const route = useRoute()

const router = useRouter()

const userStore = useUserStore()

const loginFormRef = useTemplateRef("loginFormRef")

const loading = ref(false)

const isMock = import.meta.env.VITE_USE_MOCK === "true"

const loginFormData = reactive<LoginFormData>({
  username: "admin",
  password: "123456"
})

const loginFormRules: FormRules = {
  username: [
    { required: true, message: "请输入账号", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "change" }
  ]
}

function handleLogin() {
  loginFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    authApi.login({
      username: loginFormData.username,
      password: loginFormData.password
    }).then((data) => {
      userStore.setToken(data.token)
      userStore.setProfile({
        id: data.user.id,
        username: data.user.username,
        roles: data.user.roles,
        permissions: data.user.permissions
      })
      router.push(route.query.redirect ? decodeURIComponent(route.query.redirect as string) : "/")
    }).catch((error: Error) => {
      loginFormData.password = ""
      ElMessage.error(error.message || "登录失败")
    }).finally(() => {
      loading.value = false
    })
  })
}
</script>

<template>
  <section class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <svg class="logo-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
              />
            </svg>
            <h1>Vue Admin Template</h1>
          </div>
          <p class="login-subtitle">
            <template v-if="isMock">
              管理后台模板 · Mock 账号 admin / user，密码任意
            </template>
            <template v-else>
              管理后台模板 · 请使用企业账号登录
            </template>
          </p>
        </div>

        <div class="login-body">
          <el-form
            ref="loginFormRef"
            class="login-form"
            :model="loginFormData"
            :rules="loginFormRules"
            label-position="top"
            @keyup.enter="handleLogin"
          >
            <el-form-item class="form-group" label="用户名" prop="username">
              <el-input
                v-model.trim="loginFormData.username"
                placeholder="admin 或 user"
                size="large"
              >
                <template #prefix>
                  <el-icon><span class="i-ep-user" /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="form-group" label="密码" prop="password">
              <el-input
                v-model.trim="loginFormData.password"
                type="password"
                show-password
                placeholder="请输入密码"
                size="large"
              >
                <template #prefix>
                  <el-icon><span class="i-ep-lock" /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              size="large"
              :loading="loading"
              @click.prevent="handleLogin"
            >
              <el-icon v-if="!loading">
                <span class="i-ep-right" />
              </el-icon>
              立即登录
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.login-page {
  --login-primary: #2c6fbb;
  --login-secondary: #34495e;
  --login-accent: #3498db;
  --login-dark: #2c3e50;
  --login-radius: 6px;
  --login-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --login-transition: all 0.3s ease;

  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #f0f2f5;
}

.login-container {
  width: 100%;
  max-width: 500px;
  padding: 0 16px;
}

.login-card {
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: var(--login-radius);
  box-shadow: var(--login-shadow);
  transition: var(--login-transition);
  animation: login-fade-in 0.5s ease-out;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }
}

.login-header {
  position: relative;
  overflow: hidden;
  padding: 40px 30px 30px;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, var(--login-dark), var(--login-secondary));
}

.login-logo {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;

  .logo-icon {
    width: 2.8rem;
    height: 2.8rem;
    margin-right: 12px;
    color: var(--login-accent);
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 1.9rem;
    font-weight: bold;
    line-height: 1.3;
  }
}

.login-subtitle {
  position: relative;
  z-index: 1;
  margin: 5px 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.login-body {
  padding: 35px 30px 30px;
}

.form-group {
  margin-bottom: 24px;

  :deep(.el-form-item__label) {
    margin-bottom: 8px;
    padding: 0;
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--login-secondary);
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  margin-top: 6px;
  border: none;
  border-radius: var(--login-radius);
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(135deg, var(--login-primary), var(--login-accent));
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  transition: var(--login-transition);

  &:hover,
  &:focus {
    transform: translateY(-2px);
    background: linear-gradient(135deg, var(--login-primary), var(--login-accent));
    box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
  }
}

@keyframes login-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }

  .login-header {
    padding: 30px 20px 25px;
  }

  .login-logo {
    flex-direction: column;
    gap: 10px;

    .logo-icon {
      margin-right: 0;
    }

    h1 {
      font-size: 1.5rem;
    }
  }

  .login-body {
    padding: 25px 20px 20px;
  }
}
</style>
