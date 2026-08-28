<script lang="ts" setup>
import type { TableColumn, TablePagination, TablePaginationKeys } from "./types"
import type { TableInstance } from "element-plus"
import { computed, nextTick, useAttrs, useTemplateRef } from "vue"
import CustomPagination from "../CustomPagination/index.vue"
import { normalizeColumns, pickColumnProps, useVisibleColumns } from "./composables/useColumns"
import { useTablePagination } from "./composables/useTablePagination"

defineOptions({
  name: "CustomTable",
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  data?: any[]
  /** 列配置 */
  columns: TableColumn<any>[]
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

const { page, size, total, onPagination } = useTablePagination(props, emit as (event: string, payload: TablePagination) => void)
const tableRef = useTemplateRef<TableInstance>("tableRef")

function columnKey(column: TableColumn) {
  return column.prop || column.type || column.label || ""
}

function resolveColumnBind(column: TableColumn) {
  if (column.type === "selection") {
    return {
      type: "selection" as const,
      reserveSelection: column.reserveSelection ?? true,
      selectable: (row: Record<string, unknown>) => !props.disabledId.includes(row[props.rowKey] as string | number),
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

/** 非纯文本列默认关闭溢出省略（按钮 / 标签等） */
const NON_TEXT_COLUMN_TYPES = new Set(["operation", "tag", "selection", "index", "expand"])

function resolveShowTip(column: TableColumn) {
  if (column.showTip === true) return true
  if (column.showTip === false) return false
  const type = column.render || column.type || "text"
  if (NON_TEXT_COLUMN_TYPES.has(type)) return false
  if (column.buttons?.length) return false
  return props.showTip
}

function onSortChange(payload: unknown) {
  emit("sortChange", payload)
}

function toggleRowSelection(row: Record<string, unknown>, selected?: boolean) {
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
            :row="scope.row"
            :column="column"
            :value="column.prop ? scope.row[column.prop] : undefined"
            :index="scope.$index"
          >
            <!-- 操作按钮 -->
            <template v-if="column.buttons && column.buttons.length">
              <template v-for="(btn, btnIdx) in column.buttons" :key="btnIdx">
                <el-button
                  v-if="typeof btn.show === 'function' ? btn.show(scope.row) : (btn.show !== false)"
                  :type="btn.type || 'primary'"
                  :size="btn.size || 'small'"
                  :plain="btn.plain"
                  :link="btn.link"
                  v-bind="btn.props"
                  @click="btn.onClick?.(scope.row, column)"
                >
                  {{ btn.label }}
                </el-button>
              </template>
            </template>

            <!-- 标签列 -->
            <el-tag
              v-else-if="column.type === 'tag' || column.render === 'tag'"
              :type="(typeof column.tagType === 'function' ? column.tagType(scope.row[column.prop!], scope.row) : column.tagType) as any"
              v-bind="column.tagProps"
            >
              {{ column.formatter ? column.formatter(scope.row[column.prop!], scope.row, column) : (scope.row[column.prop!] ?? emptyText) }}
            </el-tag>

            <!-- 文本列 / Formatter -->
            <span v-else>
              {{ column.formatter ? column.formatter(column.prop ? scope.row[column.prop] : undefined, scope.row, column) : ((column.prop && (scope.row[column.prop] || scope.row[column.prop] === 0)) ? scope.row[column.prop] : emptyText) }}
            </span>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else :description="emptyDescription" />

    <slot name="pagination">
      <CustomPagination
        v-if="showPagination && total > 0"
        v-model:page="page"
        v-model:size="size"
        :total="total"
        v-bind="pageConfig"
        @pagination="onPagination"
      />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.custom-table {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  /* 列总宽超出时由表格区域横滚，而不是撑开整页 */
  overflow-x: auto;
}
</style>
