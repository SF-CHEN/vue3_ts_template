# 内置组合式函数速查 (Composables)

`src/common/composables` 只保留确实跨页面复用、并且具有组合式状态或生命周期价值的能力。普通函数优先放页面本地或 `utils`，不要为了形式创建 composable。

## 设备检测 `useDevice`

读取布局的移动端 / 桌面端状态。

```ts
import { useDevice } from "@@/composables/useDevice"

const { isDesktop, isMobile } = useDevice()

if (isMobile.value) {
  // 移动端逻辑
}
```

## 动态标题 `useTitle`

设置浏览器标签页标题，格式为 `项目名 | 页面名`。

```ts
import { useTitle } from "@@/composables/useTitle"

const { setTitle } = useTitle()

setTitle("用户管理")
setTitle() // 恢复项目默认标题
```

## 水印 `useWatermark`

为 `body` 或指定容器添加水印，可选防删除 / 防样式篡改。

```ts
import { useWatermark } from "@@/composables/useWatermark"

const { clearWatermark, setWatermark } = useWatermark()

setWatermark("内部使用")
clearWatermark()
```

布局是否启用水印、灰色模式、色弱模式等项目级能力统一在 `src/layouts/config.ts` 静态配置，不为这些固定开关创建额外 Store 或 composable。
