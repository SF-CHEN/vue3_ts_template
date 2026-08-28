<script lang="ts" setup>
import { useGreyAndColorWeakness } from "@@/composables/useGreyAndColorWeakness"
import zhCn from "element-plus/es/locale/lang/zh-cn" // Element Plus 中文包

const { initGreyAndColorWeakness } = useGreyAndColorWeakness()

// 初始化灰色模式和色弱模式
initGreyAndColorWeakness()
</script>

<template>
  <el-config-provider :locale="zhCn" size="default">
    <router-view />
  </el-config-provider>
</template>
