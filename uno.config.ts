import { defineConfig, presetIcons, presetWind3 } from "unocss"

const FA_SOLID_SAFELIST = [
  "flask",
  "file-alt"
].map(name => `i-fa-solid-${name}`)

const EP_SAFELIST = [
  "arrow-down",
  "arrow-left",
  "expand",
  "fold",
  "home-filled",
  "lock",
  "moon",
  "right",
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
  shortcuts: {
    "wh-full": "w-full h-full",
    "flex-center": "flex justify-center items-center",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center"
  },
  safelist: [...FA_SOLID_SAFELIST, ...EP_SAFELIST]
})
