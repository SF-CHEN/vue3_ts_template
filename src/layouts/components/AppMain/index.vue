<script lang="ts" setup>
import { useTagsViewStore } from "@/pinia/stores/tags-view"
import { layoutsConfig } from "../../config"
import { Footer } from "../index"

const route = useRoute()
const tagsViewStore = useTagsViewStore()

watch(
  () => route.fullPath,
  () => tagsViewStore.addCachedView(route),
  { immediate: true }
)
</script>

<template>
  <section class="app-main">
    <div class="app-scrollbar">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" :key="route.path" class="app-container-grow" />
          </keep-alive>
        </transition>
      </router-view>
      <Footer v-if="layoutsConfig.showFooter" />
    </div>
    <el-backtop target=".app-main" />
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  min-width: 0;
  display: flex;
}

.app-scrollbar {
  flex-grow: 1;
  min-width: 0;
  width: 100%;
  overflow: visible;
  display: flex;
  flex-direction: column;

  :deep(.app-container-grow) {
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
  }

  :deep(.app-container-grow.page-card) {
    flex-grow: 0;
  }
}
</style>
