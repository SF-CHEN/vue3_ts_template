export interface TableColumn {
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | "left" | "right"
  slot?: string
}

export interface TablePagination {
  pageCurrent: number
  pageSize: number
  total: number
}
