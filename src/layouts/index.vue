<script lang="ts" setup>
import { useWatermark } from "@@/composables/useWatermark"
import { layoutsConfig } from "./config"
import { useResize } from "./composables/useResize"
import LeftMode from "./modes/LeftMode.vue"

useResize()

const { setWatermark } = useWatermark()

onMounted(() => {
  if (layoutsConfig.showWatermark) {
    setWatermark(import.meta.env.VITE_APP_TITLE)
  }
})

const layoutStyle = layoutsConfig.showTagsView
  ? undefined
  : { "--v3-tagsview-height": "0px" }
</script>

<template>
  <div class="layout-root" :style="layoutStyle">
    <LeftMode />
  </div>
</template>

<style scoped lang="scss">
.layout-root {
  height: 100%;
}
</style>
