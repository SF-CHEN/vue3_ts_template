import type { LayoutsConfig } from "@/layouts/config"
import { setLayoutsConfig } from "@@/utils/local-storage"
import { layoutsConfig } from "@/layouts/config"

export const useSettingsStore = defineStore("settings", () => {
  const settings = reactive<LayoutsConfig>({ ...layoutsConfig })

  watch(settings, () => {
    setLayoutsConfig({ ...settings })
  })

  return { ...toRefs(settings) }
})
