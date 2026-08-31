import type { Sidebar } from "./types"
import { DeviceEnum, SIDEBAR_CLOSED, SIDEBAR_OPENED } from "@@/constants/app-key"
import { getSidebarStatus, setSidebarStatus } from "@@/utils/local-storage"

export const useAppStore = defineStore("app", () => {
  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false
  })

  const device = ref<DeviceEnum>(DeviceEnum.Desktop)

  watch(
    () => sidebar.opened,
    opened => setSidebarStatus(opened ? SIDEBAR_OPENED : SIDEBAR_CLOSED)
  )

  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
  }

  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }

  const openSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = true
    sidebar.withoutAnimation = withoutAnimation
  }

  const toggleDevice = (value: DeviceEnum) => {
    device.value = value
  }

  return { device, sidebar, toggleSidebar, closeSidebar, openSidebar, toggleDevice }
})
