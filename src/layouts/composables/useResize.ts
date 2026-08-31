import { DeviceEnum } from "@@/constants/app-key"
import { useAppStore } from "@/pinia/stores/app"

const MAX_MOBILE_WIDTH = 992

/** 同步窗口宽度与侧栏状态。 */
export function useResize() {
  const route = useRoute()
  const appStore = useAppStore()

  const syncDevice = () => {
    const mobile = window.innerWidth < MAX_MOBILE_WIDTH
    appStore.toggleDevice(mobile ? DeviceEnum.Mobile : DeviceEnum.Desktop)
    mobile ? appStore.closeSidebar(true) : appStore.openSidebar(true)
  }

  watch(
    () => route.path,
    () => {
      if (appStore.device === DeviceEnum.Mobile && appStore.sidebar.opened) {
        appStore.closeSidebar(false)
      }
    }
  )

  onMounted(() => {
    syncDevice()
    window.addEventListener("resize", syncDevice)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", syncDevice)
  })
}
