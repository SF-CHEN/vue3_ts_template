import type { Component } from "vue"

/** 操作列按钮 */
export interface TableOperationButton<T = Record<string, unknown>> {
  label: string
  type?: "primary" | "success" | "warning" | "danger" | "info" | "default"
  /** Element Plus：large / default / small（旧 Element UI 的 medium ≈ default） */
  size?: "large" | "default" | "small"
  plain?: boolean
  link?: boolean
  props?: Record<string, unknown>
  show?: boolean | ((row: T) => boolean)
  onClick?: (row: T, column: TableColumn<T>) => void
}

/** 表格列配置 */
export interface TableColumn<T = Record<string, unknown>> {
  prop?: string
  label?: string
  /** 列渲染类型：text / tag / operation / selection / index，或自定义注册类型 */
  type?: string
  /** 同 type，优先于 type */
  render?: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | "left" | "right"
  align?: "left" | "center" | "right"
  headerAlign?: "left" | "center" | "right"
  sortable?: boolean | string
  className?: string
  labelClassName?: string
  hidden?: boolean
  show?: () => boolean
  /** 自定义插槽名，默认取 prop */
  slot?: string
  /** 溢出省略提示；默认仅纯文本列开启，operation / tag 等自动关闭 */
  showTip?: boolean
  reserveSelection?: boolean
  formatter?: (value: unknown, row: T, column: TableColumn<T>) => string
  tagType?: string | ((value: unknown, row: T) => string)
  tagProps?: Record<string, unknown>
  buttons?: Array<TableOperationButton<T>>
}

/** 分页模型（默认对齐后端 pageCurrent / pageSize） */
export interface TablePagination {
  pageCurrent?: number
  pageSize?: number
  total?: number
  [key: string]: unknown
}

export interface TablePaginationKeys {
  page?: string
  size?: string
  total?: string
}

export interface ColumnTypeConfig {
  component: Component
}
