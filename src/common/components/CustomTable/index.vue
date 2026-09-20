<script setup lang="ts" generic="T extends object">
import type { TableColumn, TablePagination } from "./types"

defineOptions({
  name: "CustomTable",
  inheritAttrs: false
})

withDefaults(defineProps<{
  data?: T[]
  columns: TableColumn[]
  loading?: boolean
  rowKey?: string
}>(), {
  data: () => [],
  loading: false,
  rowKey: "id"
})

const emit = defineEmits<{
  pagination: []
}>()

defineSlots<{
  [name: string]: (props: {
    row: T
    column: TableColumn
    value: unknown
    index: number
  }) => unknown
}>()

const pagination = defineModel<TablePagination>("pagination", { required: true })

const currentPage = computed({
  get: () => pagination.value.pageCurrent,
  set: (pageCurrent: number) => {
    pagination.value = { ...pagination.value, pageCurrent }
    emit("pagination")
  }
})

const pageSize = computed({
  get: () => pagination.value.pageSize,
  set: (size: number) => {
    pagination.value = { ...pagination.value, pageSize: size }
    emit("pagination")
  }
})

function cellValue(row: unknown, prop?: string) {
  if (!prop || !row || typeof row !== "object") return undefined
  return (row as Record<string, unknown>)[prop]
}

function toRow(row: unknown) {
  return row as T
}
</script>

<template>
  <div class="custom-table">
    <el-table
      v-loading="loading"
      :data="data"
      :row-key="rowKey"
      v-bind="$attrs"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop || column.label"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
      >
        <template #default="{ row, $index }">
          <slot
            :name="column.slot || column.prop"
            :row="toRow(row)"
            :column="column"
            :value="cellValue(row, column.prop)"
            :index="$index"
          >
            {{ cellValue(row, column.prop) ?? "-" }}
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pagination.total > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="custom-table__pager"
      :total="pagination.total"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-table {
  width: 100%;
  overflow-x: auto;
}

.custom-table__pager {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
