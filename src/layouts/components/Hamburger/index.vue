<script lang="ts" setup>
import type { HamburgerProps } from "../../types"

const { isActive = false } = defineProps<HamburgerProps>()

const emit = defineEmits<{
  toggleClick: []
}>()

function toggleClick() {
  emit("toggleClick")
}
</script>

<template>
  <div @click="toggleClick">
    <el-icon :size="20" class="icon">
      <span :class="isActive ? 'i-ep-fold' : 'i-ep-expand'" />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  color: var(--v3-hamburger-text-color);
}
</style>
