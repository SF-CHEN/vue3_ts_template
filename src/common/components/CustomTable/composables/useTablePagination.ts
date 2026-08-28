import type { TablePagination, TablePaginationKeys } from "../types"
import { computed, ref, watch } from "vue"

const DEFAULT_KEYS = {
  page: "pageCurrent",
  size: "pageSize",
  total: "total"
}

interface UseTablePaginationProps {
  pagination?: TablePagination
  paginationKeys?: TablePaginationKeys
}

/** 统一分页字段，默认使用后端常见的 pageCurrent/pageSize */
export function useTablePagination(
  props: UseTablePaginationProps,
  emit: (event: string, payload: TablePagination) => void
) {
  const keys = computed(() => ({
    ...DEFAULT_KEYS,
    ...props.paginationKeys
  }))

  const source = computed(() => props.pagination ?? {})

  const page = ref(1)
  const size = ref(10)

  // 外部 pagination 变化时同步内部页码
  watch(
    source,
    (val) => {
      page.value = Number(val[keys.value.page] ?? 1)
      size.value = Number(val[keys.value.size] ?? 10)
    },
    { immediate: true, deep: true }
  )

  const total = computed(() => Number(source.value[keys.value.total] ?? 0))

  /**
   * 页码变化写回父级。
   * 页面侧普遍用 reactive 传 pagination，v-model 整体替换对 const reactive 无效，
   * 必须就地改字段，再把同一引用 emit 出去，保证 getTableData 读到新页码。
   */
  function emitChange() {
    const pageKey = keys.value.page
    const sizeKey = keys.value.size
    const target = props.pagination

    if (target) {
      target[pageKey] = page.value
      target[sizeKey] = size.value
      emit("update:pagination", target)
      emit("pagination", target)
      return
    }

    const next: TablePagination = {
      [pageKey]: page.value,
      [sizeKey]: size.value
    }
    emit("update:pagination", next)
    emit("pagination", next)
  }

  function onPagination() {
    emitChange()
  }

  return {
    page,
    size,
    total,
    onPagination
  }
}
