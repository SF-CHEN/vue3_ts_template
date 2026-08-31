<script lang="ts" setup>
const { isActive = false } = defineProps<{
  isActive?: boolean
}>()

const emit = defineEmits<{
  toggleClick: []
}>()
</script>

<template>
  <div @click="emit('toggleClick')">
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
