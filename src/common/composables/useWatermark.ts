import type { Ref } from "vue"
import { onBeforeUnmount } from "vue"

const DEFAULT_CONFIG = {
  defense: true,
  color: "#c0c4cc",
  opacity: 0.5,
  size: 16,
  family: "serif",
  angle: -20,
  width: 300,
  height: 200
}

type WatermarkConfig = typeof DEFAULT_CONFIG

/** 水印 Composable：支持 body 或指定容器，并可防止水印节点被删除或隐藏。 */
export function useWatermark(parentEl?: Ref<HTMLElement | null>) {
  let text = ""
  let config: WatermarkConfig = { ...DEFAULT_CONFIG }
  let currentParent: HTMLElement | null = null
  let watermarkEl: HTMLDivElement | null = null
  let mutationObserver: MutationObserver | null = null
  let originalParentPosition: string | null = null

  const createBase64 = () => {
    const canvas = document.createElement("canvas")
    canvas.width = config.width
    canvas.height = config.height

    const context = canvas.getContext("2d")
    if (!context) return ""

    context.fillStyle = config.color
    context.globalAlpha = config.opacity
    context.font = `${config.size}px ${config.family}`
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.translate(config.width / 2, config.height / 2)
    context.rotate((Math.PI / 180) * config.angle)
    context.fillText(text, 0, 0)

    return canvas.toDataURL()
  }

  const applyStyle = () => {
    if (!currentParent || !watermarkEl) return

    const isBody = currentParent === document.body
    Object.assign(watermarkEl.style, {
      position: isBody ? "fixed" : "absolute",
      inset: "0",
      zIndex: "99999",
      pointerEvents: "none",
      backgroundImage: `url(${createBase64()})`,
      backgroundRepeat: "repeat"
    })
  }

  const stopDefense = () => {
    mutationObserver?.disconnect()
    mutationObserver = null
  }

  const startDefense = () => {
    stopDefense()
    if (!config.defense || !currentParent || !watermarkEl) return

    mutationObserver = new MutationObserver((records) => {
      const shouldRepair = records.some((record) => {
        if (record.target === watermarkEl) return true
        return Array.from(record.removedNodes).includes(watermarkEl as Node)
      })
      if (!shouldRepair || !currentParent || !watermarkEl) return

      stopDefense()
      if (!currentParent.contains(watermarkEl)) {
        currentParent.appendChild(watermarkEl)
      }
      applyStyle()
      startDefense()
    })

    mutationObserver.observe(currentParent, { childList: true })
    mutationObserver.observe(watermarkEl, { attributes: true, attributeFilter: ["style"] })
  }

  const ensureParentPosition = () => {
    if (!currentParent || currentParent === document.body) return
    if (getComputedStyle(currentParent).position !== "static") return

    originalParentPosition = currentParent.style.position
    currentParent.style.position = "relative"
  }

  const clearWatermark = () => {
    stopDefense()
    watermarkEl?.remove()
    watermarkEl = null

    if (currentParent && originalParentPosition !== null) {
      currentParent.style.position = originalParentPosition
    }
    originalParentPosition = null
    currentParent = null
  }

  const setWatermark = (value: string, options: Partial<WatermarkConfig> = {}) => {
    const target = parentEl?.value ?? document.body
    if (!target) {
      console.warn("请在 DOM 挂载完成后再调用 setWatermark")
      return
    }

    if (currentParent && currentParent !== target) {
      clearWatermark()
    }

    text = value
    config = { ...DEFAULT_CONFIG, ...options }
    currentParent = target
    ensureParentPosition()

    if (!watermarkEl) {
      watermarkEl = document.createElement("div")
      currentParent.appendChild(watermarkEl)
    }

    stopDefense()
    applyStyle()
    startDefense()
  }

  onBeforeUnmount(clearWatermark)

  return { setWatermark, clearWatermark }
}
