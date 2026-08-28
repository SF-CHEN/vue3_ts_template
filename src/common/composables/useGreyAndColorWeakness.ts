import { useSettingsStore } from "@/pinia/stores/settings"

const GREY_MODE = "grey-mode"
const COLOR_WEAKNESS = "color-weakness"

/** 灰色模式和色弱模式 Composable */
export function useGreyAndColorWeakness() {
  const initGreyAndColorWeakness = () => {
    const settingsStore = useSettingsStore()

    watchEffect(() => {
      const classList = document.documentElement.classList
      classList.toggle(GREY_MODE, settingsStore.showGreyMode)
      classList.toggle(COLOR_WEAKNESS, settingsStore.showColorWeakness)
    })
  }

  return { initGreyAndColorWeakness }
}
