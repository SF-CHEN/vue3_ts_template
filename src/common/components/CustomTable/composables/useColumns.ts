import type { MaybeRefOrGetter } from "vue"
import type { TableColumn } from "../types"
import { computed, toValue } from "vue"

const COLUMN_PROP_KEYS = [
  "prop",
  "label",
  "width",
  "minWidth",
  "fixed",
  "align",
  "headerAlign",
  "sortable",
  "className",
  "labelClassName"
] as const

/** 提取可透传给 el-table-column 的属性 */
export function pickColumnProps(column: TableColumn) {
  const result: Record<string, unknown> = {}
  COLUMN_PROP_KEYS.forEach((key) => {
    if (column[key] !== undefined) {
      result[key] = column[key]
    }
  })
  return result
}

/** 过滤隐藏列；selection / index 由 normalizeColumns 统一插入 */
export function useVisibleColumns(columns: MaybeRefOrGetter<TableColumn[]>) {
  return computed(() =>
    toValue(columns).filter((col) => {
      if (col.hidden) return false
      if (typeof col.show === "function") return col.show()
      return col.type !== "selection" && col.type !== "index"
    })
  )
}

interface NormalizeOptions {
  showIndex?: boolean
  showSelection?: boolean
  indexLabel?: string
}

/** 按需在列头插入 selection / index */
export function normalizeColumns(columns: TableColumn[], options: NormalizeOptions = {}) {
  const { showIndex = false, showSelection = false, indexLabel = "序号" } = options
  const result = [...columns]

  if (showSelection && !result.some(col => col.type === "selection")) {
    result.unshift({ type: "selection", width: 50, fixed: "left" })
  }
  if (showIndex && !result.some(col => col.type === "index")) {
    result.unshift({ type: "index", label: indexLabel, width: 80 })
  }
  return result
}
