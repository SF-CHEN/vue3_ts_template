<script lang="ts" setup>
const { collapse = true } = defineProps<{
  collapse?: boolean
}>()
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse }">
    <transition name="layout-logo-fade">
      <router-link v-if="collapse" key="collapse" class="brand-link collapsed" to="/">
        <span class="brand-mark">V</span>
      </router-link>
      <router-link v-else key="expand" class="brand-link" to="/">
        <span class="brand-mark">V</span>
        <span class="brand-copy">
          <strong>Vue Admin</strong>
          <small>Workspace</small>
        </span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.brand-link {
  width: 100%;
  min-width: 0;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: #ffffff;
  text-decoration: none;
}

.brand-link.collapsed {
  justify-content: center;
  padding: 0;
}

.brand-mark {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.28);
  font-size: 16px;
  font-weight: 800;
}

.brand-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  strong {
    overflow: hidden;
    color: #f8fafc;
    font-size: 14px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    margin-top: 3px;
    color: #64748b;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}
</style>
