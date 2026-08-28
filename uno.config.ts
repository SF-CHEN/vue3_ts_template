import { defineConfig, presetIcons, presetWind3 } from "unocss"

/** 侧栏等动态拼接的 FA 图标，需 safelist 避免生产构建丢失 */
const FA_SOLID_SAFELIST = [
  "flask",
  "file-alt"
].map(name => `i-fa-solid-${name}`)

/**
 * 模板中实际用到的 ep 图标（勿全量 safelist，会显著拖慢构建）
 */
const EP_SAFELIST = [
  "arrow-down",
  "arrow-left",
  "home-filled",
  "lock",
  "moon",
  "refresh",
  "right",
  "setting",
  "sunny",
  "user"
].map(name => `i-ep-${name}`)

export default defineConfig({
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetWind3({
      important: "#app"
    })
  ],
  rules: [],
  shortcuts: {
    "wh-full": "w-full h-full",
    "flex-center": "flex justify-center items-center",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center"
  },
  safelist: [...FA_SOLID_SAFELIST, ...EP_SAFELIST]
})
