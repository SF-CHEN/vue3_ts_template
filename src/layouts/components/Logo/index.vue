<script lang="ts" setup>
import type { LogoProps } from "../../types"

const { collapse = true } = defineProps<LogoProps>()
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse }">
    <transition name="layout-logo-fade">
      <router-link v-if="collapse" key="collapse" to="/">
        <span class="layout-logo-short">VA</span>
      </router-link>
      <router-link v-else key="expand" to="/">
        <h1 class="layout-logo-text">
          <span>Vue Admin</span>
          <span>Template</span>
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  min-height: 72px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  a {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    padding: 20px;
    text-decoration: none;

    .layout-logo-short {
      font-size: 1.4rem;
      font-weight: 700;
      color: #60a5fa;
      white-space: nowrap;
    }

    .layout-logo-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 0;
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1.35;
      text-align: left;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.5px;
    }
  }
}

.collapse a {
  padding: 0;
}
</style>
