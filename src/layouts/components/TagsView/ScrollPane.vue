<script lang="ts" setup>
import type { ScrollPaneProps } from "./types"

const props = defineProps<ScrollPaneProps>()
const route = useRoute()

const scrollbarRef = useTemplateRef("scrollbarRef")
const scrollbarContentRef = useTemplateRef("scrollbarContentRef")

let currentScrollLeft = 0
const translateDistance = 200

function scroll({ scrollLeft }: { scrollLeft: number }) {
  currentScrollLeft = scrollLeft
}

function wheelScroll({ deltaY }: WheelEvent) {
  scrollTo(deltaY < 0 ? "left" : "right")
}

function getWidth() {
  const contentWidth = scrollbarContentRef.value!.clientWidth
  const viewportWidth = scrollbarRef.value!.wrapRef!.clientWidth
  const remainingWidth = contentWidth - viewportWidth - currentScrollLeft
  return { contentWidth, viewportWidth, remainingWidth }
}

function scrollTo(direction: "left" | "right", distance = translateDistance) {
  const { contentWidth, viewportWidth, remainingWidth } = getWidth()
  if (viewportWidth >= contentWidth) return

  const scrollLeft = direction === "left"
    ? Math.max(0, currentScrollLeft - distance)
    : Math.min(currentScrollLeft + distance, currentScrollLeft + remainingWidth)

  scrollbarRef.value!.setScrollLeft(scrollLeft)
}

function moveTo() {
  const tagRefs = props.tagRefs ?? []

  for (const tagRef of tagRefs) {
    // RouterLink 的实例类型没有暴露渲染元素和 to.path，这里只在标签滚动定位时读取。
    // @ts-expect-error RouterLink public instance does not expose $props.to.path
    if (route.path !== tagRef.$props.to.path) continue

    // @ts-expect-error RouterLink public instance does not expose $el
    const el: HTMLElement = tagRef.$el
    const { viewportWidth } = getWidth()

    if (el.offsetLeft < currentScrollLeft) {
      scrollTo("left", currentScrollLeft - el.offsetLeft)
      return
    }

    const visibleRight = viewportWidth + currentScrollLeft - el.offsetWidth
    if (el.offsetLeft > visibleRight) {
      scrollTo("right", el.offsetLeft - visibleRight)
      return
    }
  }
}

watch(
  () => route.fullPath,
  () => nextTick(moveTo)
)
</script>

<template>
  <div class="scroll-container">
    <el-tooltip content="向左滚动标签（超出最大宽度可点击）">
      <el-icon class="arrow left" @click="scrollTo('left')">
        <span class="i-ep-arrow-left" />
      </el-icon>
    </el-tooltip>
    <el-scrollbar ref="scrollbarRef" wrap-class="scrollbar-wrap" @wheel.passive="wheelScroll" @scroll="scroll">
      <div ref="scrollbarContentRef" class="scrollbar-content">
        <slot />
      </div>
    </el-scrollbar>
    <el-tooltip content="向右滚动标签（超出最大宽度可点击）">
      <el-icon class="arrow right" @click="scrollTo('right')">
        <span class="i-ep-arrow-right" />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.scroll-container {
  height: 100%;
  user-select: none;
  display: flex;
  justify-content: space-between;

  .arrow {
    width: 40px;
    height: 100%;
    font-size: 18px;
    cursor: pointer;

    &.left {
      box-shadow: 5px 0 5px -6px var(--el-border-color-darker);
    }

    &.right {
      box-shadow: -5px 0 5px -6px var(--el-border-color-darker);
    }
  }

  .el-scrollbar {
    flex: 1;
    white-space: nowrap;

    :deep(.scrollbar-wrap) {
      display: flex;
      align-items: center;
    }

    .scrollbar-content {
      display: inline-block;
    }
  }
}
</style>
