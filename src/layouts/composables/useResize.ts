import { DeviceEnum } from "@@/constants/app-key"
import { useAppStore } from "@/pinia/stores/app"

/** 参考 Bootstrap 的响应式设计将最大移动端宽度设置为 992 */
const MAX_MOBILE_WIDTH = 992

/**
 * @name 浏览器宽度变化 Composable
 * @description 根据浏览器宽度变化，变换 Layout 布局
 */
export function useResize() {
  const route = useRoute()
  const appStore = useAppStore()

  // 用于判断当前设备是否为移动端
  const isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < MAX_MOBILE_WIDTH
  }

  // 用于处理窗口大小变化事件
  const resizeHandler = () => {
    if (!document.hidden) {
      const _isMobile = isMobile()
      appStore.toggleDevice(_isMobile ? DeviceEnum.Mobile : DeviceEnum.Desktop)
      // 移动端收起侧栏；切回桌面时展开（对齐旧项目常显侧栏）
      if (_isMobile) {
        appStore.closeSidebar(true)
      } else {
        appStore.openSidebar(true)
      }
    }
  }

  // 监听路由变化，根据设备类型调整布局
  watch(
    () => route.path,
    () => {
      if (appStore.device === DeviceEnum.Mobile && appStore.sidebar.opened) {
        appStore.closeSidebar(false)
      }
    }
  )

  // 在组件挂载前添加窗口大小变化事件监听器
  onBeforeMount(() => {
    window.addEventListener("resize", resizeHandler)
  })

  // 在组件挂载后根据窗口大小判断设备类型并调整布局
  onMounted(() => {
    if (isMobile()) {
      appStore.toggleDevice(DeviceEnum.Mobile)
      appStore.closeSidebar(true)
    } else {
      appStore.toggleDevice(DeviceEnum.Desktop)
      appStore.openSidebar(true)
    }
  })

  // 在组件卸载前移除窗口大小变化事件监听器
  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler)
  })
}
