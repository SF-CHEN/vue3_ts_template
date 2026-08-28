# 内置组合式函数速查 (Composables)

项目在 `src/common/composables` 目录下提供通用组合式函数，通过路径别名 `@@/composables/` 导入。

## 设备检测 `useDevice`

判断当前设备类型（移动端 / 桌面端），基于 `appStore.device`。

```ts
import { useDevice } from "@@/composables/useDevice"

const { isDesktop, isMobile } = useDevice()

if (isMobile.value) {
  // 移动端逻辑
}
```

## 动态标题 `useTitle`

动态设置浏览器标签页标题，格式为 `项目名 | 页面名`。

```ts
import { useTitle } from "@@/composables/useTitle"

const { setTitle } = useTitle()

// 设置标题为 "项目名 | 用户管理"
setTitle("用户管理")

// 重置为项目默认标题
setTitle()
```

## 水印 `useWatermark`

为页面或指定容器添加水印，支持防御防篡改。

```ts
import { useWatermark } from "@@/composables/useWatermark"

const { clearWatermark, setWatermark } = useWatermark()

// 挂载到 body
setWatermark("内部使用")

// 清除水印
clearWatermark()
```

## 灰色模式与色弱模式 `useGreyAndColorWeakness`

初始化灰色模式和色弱模式，基于 `settingsStore` 的配置。

```ts
import { useGreyAndColorWeakness } from "@@/composables/useGreyAndColorWeakness"

const { initGreyAndColorWeakness } = useGreyAndColorWeakness()

initGreyAndColorWeakness()
```
