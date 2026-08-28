<script setup lang="ts" generic="T extends object">
import type { TableInstance } from "element-plus"
import type { TableColumn, TablePagination, TablePaginationKeys } from "./types"
import { computed, nextTick, useAttrs, useTemplateRef } from "vue"
import CustomPagination from "../CustomPagination/index.vue"
import { normalizeColumns, pickColumnProps, useVisibleColumns } from "./composables/useColumns"
import { useTablePagination } from "./composables/useTablePagination"

defineOptions({
  name: "CustomTable",
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  data?: T[]
  columns: TableColumn<T>[]
  pagination?: TablePagination
  paginationKeys?: TablePaginationKeys
  pageConfig?: Record<string, unknown>
  showPagination?: boolean
  loading?: boolean
  showTip?: boolean
  emptyText?: string
  emptyDescription?: string
  rowKey?: string
  selection?: boolean
  showId?: boolean
  indexLabel?: string
  disabledId?: Array<string | number>
}>(), {
  data: () => [],
  showPagination: true,
  loading: false,
  showTip: true,
  emptyText: "-",
  emptyDescription: "暂无列配置",
  rowKey: "id",
  selection: false,
  showId: false,
  indexLabel: "序号",
  disabledId: () => [],
  pageConfig: () => ({})
})

const emit = defineEmits<{
  "pagination": [payload: TablePagination]
  "update:pagination": [payload: TablePagination]
  "sortChange": [payload: unknown]
}>()

defineSlots<{
  [name: string]: (props: {
    row: T
    column: TableColumn<T>
    value: unknown
    index: number
  }) => unknown
}>()

const attrs = useAttrs()
const tableAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "selection"))
)

const showSelection = computed(() => props.selection || Boolean(attrs.selection))
const dataColumns = useVisibleColumns(() => props.columns)
const normalizedColumns = computed(() =>
  normalizeColumns(dataColumns.value, {
    showIndex: props.showId,
    showSelection: showSelection.value,
    indexLabel: props.indexLabel
  })
)

const { page, size, total, onPagination } = useTablePagination(
  props,
  emit as (event: string, payload: TablePagination) => void
)
const tableRef = useTemplateRef<TableInstance>("tableRef")

function columnKey(column: TableColumn<T>) {
  return column.prop || column.type || column.label || ""
}

function toTableRow(row: unknown) {
  return row as T
}

function getCellValue(row: unknown, prop?: string) {
  if (!prop || !row || typeof row !== "object") return undefined
  return (row as Record<string, unknown>)[prop]
}

function getDisplayValue(row: unknown, column: TableColumn<T>) {
  const tableRow = toTableRow(row)
  const value = getCellValue(tableRow, column.prop)
  return column.formatter ? column.formatter(value, tableRow, column) : (value ?? props.emptyText)
}

function resolveColumnBind(column: TableColumn<T>) {
  if (column.type === "selection") {
    return {
      type: "selection" as const,
      reserveSelection: column.reserveSelection ?? true,
      selectable: (row: unknown) => {
        const id = getCellValue(row, props.rowKey)
        return !props.disabledId.includes(id as string | number)
      },
      fixed: column.fixed,
      width: column.width || 50
    }
  }

  if (column.type === "index") {
    return {
      label: column.label || props.indexLabel,
      width: column.width || 80,
      fixed: column.fixed
    }
  }

  return pickColumnProps(column)
}

function resolveShowTip(column: TableColumn<T>) {
  if (column.showTip !== undefined) return column.showTip
  if (column.type || column.slot) return false
  return props.showTip
}

function onSortChange(payload: unknown) {
  emit("sortChange", payload)
}

function toggleRowSelection(row: T, selected?: boolean) {
  nextTick(() => {
    tableRef.value?.toggleRowSelection(row, selected)
  })
}

function toggleAllSelection() {
  nextTick(() => {
    tableRef.value?.toggleAllSelection()
  })
}

function clearSelection() {
  nextTick(() => {
    tableRef.value?.clearSelection()
  })
}

defineExpose({
  tableRef,
  toggleRowSelection,
  toggleAllSelection,
  clearSelection
})
</script>

<template>
  <div class="custom-table">
    <el-table
      v-if="normalizedColumns.length"
      ref="tableRef"
      v-loading="loading"
      :data="data"
      :row-key="rowKey"
      :show-overflow-tooltip="showTip"
      v-bind="tableAttrs"
      @sort-change="onSortChange"
    >
      <el-table-column
        v-for="column in normalizedColumns"
        :key="columnKey(column)"
        v-bind="resolveColumnBind(column)"
        :show-overflow-tooltip="resolveShowTip(column)"
      >
        <template v-if="column.type === 'index'" #default="scope">
          {{ scope.$index + 1 + (page - 1) * size }}
        </template>

        <template v-else-if="column.type !== 'selection'" #default="scope">
          <slot
            :name="column.slot || column.prop"
            :row="toTableRow(scope.row)"
            :column="column"
            :value="getCellValue(scope.row, column.prop)"
            :index="scope.$index"
          >
            {{ getDisplayValue(scope.row, column) }}
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else :description="emptyDescription" />

    <CustomPagination
      v-if="showPagination && total > 0"
      v-model:page="page"
      v-model:size="size"
      :total="total"
      v-bind="pageConfig"
      @pagination="onPagination"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-table {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
}
</style>
