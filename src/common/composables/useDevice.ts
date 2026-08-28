import { DeviceEnum } from "@@/constants/app-key"
import { useAppStore } from "@/pinia/stores/app"

/** 设备类型 Composable */
export function useDevice() {
  const appStore = useAppStore()
  const isMobile = computed(() => appStore.device === DeviceEnum.Mobile)
  const isDesktop = computed(() => appStore.device === DeviceEnum.Desktop)

  return { isMobile, isDesktop }
}
