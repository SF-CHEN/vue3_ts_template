<script lang="ts" setup>
import type { RouteRecordRaw } from "vue-router"
import { toIconClass } from "@@/utils/icon"
import { resolveRoutePath } from "@/router/helper"
import Link from "./Link.vue"

const { item, basePath = "" } = defineProps<Props>()

/** 路由菜单图标：svgIcon 优先，其次 icon / 兼容旧 elIcon */
function menuIconClass(meta?: RouteRecordRaw["meta"]) {
  const name = meta?.icon || meta?.elIcon
  return name ? toIconClass(name) : ""
}

interface Props {
  item: RouteRecordRaw
  basePath?: string
}

/** 是否始终显示根菜单 */
const alwaysShowRootMenu = computed(() => item.meta?.alwaysShow)

/** 显示的子菜单 */
const showingChildren = computed(() => item.children?.filter(child => !child.meta?.hidden) ?? [])

/** 显示的子菜单数量 */
const showingChildNumber = computed(() => showingChildren.value.length)

/** 唯一的子菜单项 */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren.value[0]
    default:
      return { ...item, path: "" }
  }
})

/** 多子项分组：用纯文字标题，不可收起（对齐旧站 nav-section h3） */
const isGroupLabel = computed(() => alwaysShowRootMenu.value || showingChildNumber.value > 1)

/** 解析路径 */
function resolvePath(routePath: string) {
  return resolveRoutePath(basePath, routePath)
}
</script>

<template>
  <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
    <Link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
      <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
        <SvgIcon v-if="theOnlyOneChild.meta.svgIcon" :name="theOnlyOneChild.meta.svgIcon" class="svg-icon" />
        <span
          v-else-if="theOnlyOneChild.meta.icon || theOnlyOneChild.meta.elIcon"
          class="el-icon"
          :class="[menuIconClass(theOnlyOneChild.meta)]"
        />
        <template v-if="theOnlyOneChild.meta.title" #title>
          <span class="title">{{ theOnlyOneChild.meta.title }}</span>
        </template>
      </el-menu-item>
    </Link>
  </template>
  <!-- 任务管理 / 资源管理 / 系统管理：纯文字分组，不可点击收起 -->
  <el-menu-item-group v-else-if="isGroupLabel">
    <template #title>
      <span class="group-title">{{ item.meta?.title }}</span>
    </template>
    <Item
      v-for="child in showingChildren"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(child.path)"
    />
  </el-menu-item-group>
  <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
    <template #title>
      <SvgIcon v-if="item.meta?.svgIcon" :name="item.meta.svgIcon" class="svg-icon" />
      <span
        v-else-if="item.meta?.icon || item.meta?.elIcon"
        class="el-icon"
        :class="[menuIconClass(item.meta)]"
      />
      <span v-if="item.meta?.title" class="title">{{ item.meta.title }}</span>
    </template>
    <template v-if="item.children">
      <Item
        v-for="child in showingChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </template>
  </el-sub-menu>
</template>

<style lang="scss" scoped>
@import "@@/assets/styles/mixins.scss";

.svg-icon {
  min-width: 12px;
  width: 12px;
  margin-right: 10px;
  font-size: 12px;
  text-align: center;
}

.el-icon {
  display: inline-block;
  width: 12px !important;
  height: 12px !important;
  margin-right: 10px !important;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
}

.title {
  @extend %ellipsis;
}

.group-title {
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}
</style>
