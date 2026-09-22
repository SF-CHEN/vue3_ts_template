<script lang="ts" setup>
const { isActive = false } = defineProps<{
  isActive?: boolean
}>()
</script>

<template>
  <el-icon :size="18" class="icon">
    <span :class="isActive ? 'i-ep-fold' : 'i-ep-expand'" />
  </el-icon>
</template>

<style lang="scss" scoped>
.icon {
  color: inherit;
}
</style>
