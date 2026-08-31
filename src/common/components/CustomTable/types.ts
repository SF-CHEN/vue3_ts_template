/** 表格列配置 */
export interface TableColumn<T = Record<string, unknown>> {
  prop?: string
  label?: string
  /** 仅保留 CustomTable 自身需要处理的列类型 */
  type?: "selection" | "index"
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
  /** 特殊单元格统一使用 slot，默认插槽名取 prop */
  slot?: string
  showTip?: boolean
  reserveSelection?: boolean
  formatter?: (value: unknown, row: T, column: TableColumn<T>) => string | number
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
