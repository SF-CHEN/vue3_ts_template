<script lang="ts" setup>
import type { LinkProps } from "./types"
import { isExternal } from "@@/utils/validate"

const props = defineProps<LinkProps>()
</script>

<template>
  <a v-if="isExternal(props.to)" :href="props.to" target="_blank" rel="noopener">
    <slot />
  </a>
  <router-link v-else :to="props.to">
    <slot />
  </router-link>
</template>
