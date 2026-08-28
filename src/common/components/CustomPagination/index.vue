<script lang="ts" setup>
defineOptions({ name: "CustomPagination" })

const props = withDefaults(defineProps<{
  page?: number
  size?: number
  total?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  disabled?: boolean
}>(), {
  page: 1,
  size: 10,
  total: 0,
  pageSizes: () => [10, 20, 30, 50],
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  disabled: false
})

const emit = defineEmits<{
  "pagination": []
  "update:page": [value: number]
  "update:size": [value: number]
}>()

const curPage = computed({
  get: () => props.page,
  set: (val: number) => emit("update:page", val)
})

const pageSize = computed({
  get: () => props.size,
  set: (val: number) => emit("update:size", val)
})

function handleSizeChange() {
  emit("pagination")
}

function handleCurrentChange() {
  emit("pagination")
}
</script>

<template>
  <div class="custom-pagination">
    <el-pagination
      v-model:current-page="curPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :disabled="disabled"
      :background="background"
      :total="total"
      :layout="layout"
      size="default"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
