/** 水印 MutationObserver / ResizeObserver 句柄 */
export interface Observer {
  watermarkElMutationObserver?: MutationObserver
  parentElMutationObserver?: MutationObserver
  parentElResizeObserver?: ResizeObserver
}
