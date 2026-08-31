<script lang="ts" setup>
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { layoutsConfig } from "@/layouts/config"

const rootClasses = document.documentElement.classList
rootClasses.toggle("grey-mode", layoutsConfig.showGreyMode)
rootClasses.toggle("color-weakness", layoutsConfig.showColorWeakness)
</script>

<template>
  <el-config-provider :locale="zhCn" size="default">
    <router-view />
  </el-config-provider>
</template>
