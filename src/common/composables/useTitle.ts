/** 项目标题 */
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "V3 Admin Vite"

/** 标题 Composable */
export function useTitle() {
  const setTitle = (title?: string) => {
    document.title = title ? `${VITE_APP_TITLE} | ${title}` : VITE_APP_TITLE
  }

  return { setTitle }
}
