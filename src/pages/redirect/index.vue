<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

// redirect 页只做一次 replace，用于“刷新当前标签”时重新创建目标页面组件，同时保留原查询参数。
router.replace({ path: `/${route.params.path}`, query: route.query })
</script>

<template>
  <div />
</template>
