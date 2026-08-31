<script lang="ts" setup>
import { useFullscreen } from "@vueuse/core"

const { isFullscreen, isSupported, toggle } = useFullscreen()

async function handleClick() {
  if (!isSupported.value) {
    ElMessage.warning("您的浏览器不支持全屏功能")
    return
  }
  await toggle()
}
</script>

<template>
  <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
    <SvgIcon
      :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      class="screenfull-icon"
      @click="handleClick"
    />
  </el-tooltip>
</template>

<style lang="scss" scoped>
.screenfull-icon {
  font-size: 20px;
  cursor: pointer;
}
</style>
