<script lang="ts" setup>
import type { ExportOptions, ExportProgress } from "dompdf.js"
import { downloadPDF, exportPDF } from "dompdf.js"

defineOptions({ name: "DemoPdf" })

const FONT_FAMILY = "SourceHanSansSC-Regular"
const FONT_URL = "https://cdn.jsdelivr.net/gh/lmn1919/dompdf.js@v2.0.6/examples/SourceHanSansSC-Regular.ttf"

const captureRef = useTemplateRef<HTMLElement>("captureRef")
const exporting = ref(false)
const progressText = ref("")
const previewUrl = shallowRef("")

const orderItems = [
  { name: "标准工位显示器", spec: "27 英寸 / 2K", qty: 4, price: 1899 },
  { name: "机械键盘", spec: "茶轴 / 有线", qty: 8, price: 329 },
  { name: "人体工学椅", spec: "网布 / 腰托", qty: 4, price: 1299 },
  { name: "桌面支架", spec: "双臂 / 气弹簧", qty: 4, price: 459 },
  { name: "USB 扩展坞", spec: "8 合 1 / HDMI", qty: 4, price: 269 },
  { name: "无线鼠标", spec: "静音 / 2.4G", qty: 8, price: 99 },
  { name: "台灯", spec: "护眼 / 可调色温", qty: 4, price: 189 },
  { name: "网线", spec: "Cat6 / 3 米", qty: 12, price: 29 }
]

const orderTotal = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0)
const pagePlaceholder = `\${currentPage} / \${totalPages}`

let fontBytesPromise: Promise<Uint8Array> | undefined
let previewObjectUrl = ""

async function loadChineseFont() {
  // 浏览器系统字体不会自动嵌入 PDF，中文必须显式传入 TTF 字节。
  fontBytesPromise ??= fetch(FONT_URL).then(async (response) => {
    if (!response.ok) throw new Error(`中文字体加载失败：${response.status}`)
    return new Uint8Array(await response.arrayBuffer())
  })
  return fontBytesPromise
}

function formatMoney(value: number) {
  return value.toLocaleString("zh-CN", { style: "currency", currency: "CNY" })
}

function describeProgress(progress: ExportProgress) {
  switch (progress.stage) {
    case "collecting":
      return "正在收集页面内容和资源"
    case "countingPages":
      return `正在计算页数：${progress.totalPages ?? "..."}`
    case "rendering":
      return `正在生成 PDF：${progress.currentPage ?? 0}/${progress.totalPages ?? "?"}`
    case "done":
      return `导出完成：${progress.totalPages ?? 1} 页`
    default:
      return "正在导出"
  }
}

async function buildExportOptions(): Promise<ExportOptions> {
  const fontBytes = await loadChineseFont()
  await document.fonts.ready

  return {
    format: "a4",
    pagination: true,
    compress: true,
    backgroundColor: "#ffffff",
    marginPt: [28, 28, 28, 28],
    fontConfig: {
      fontFamily: FONT_FAMILY,
      fontBytes,
      fontStyle: "normal",
      fontWeight: 400
    },
    pageConfig: {
      header: {
        height: 42,
        padding: [8, 16, 0, 16],
        slots: [
          {
            content: "设备采购确认单",
            position: "leftTop",
            color: "#303133",
            fontSize: 12,
            fontFamily: FONT_FAMILY,
            fontWeight: 700
          },
          {
            content: `第 \${currentPage} / \${totalPages} 页`,
            position: { x: "100%", y: 0, anchor: "rightTop" },
            color: "#909399",
            fontSize: 10,
            fontFamily: FONT_FAMILY
          }
        ]
      },
      footer: {
        content: "dompdf.js 纯前端导出 · 文本可选中、可搜索",
        height: 36,
        contentColor: "#909399",
        contentFontSize: 9,
        contentPosition: "center",
        padding: [0, 16, 0, 16]
      }
    },
    watermark: {
      text: "示例导出",
      color: "rgba(64, 158, 255, 0.12)",
      fontFamily: FONT_FAMILY,
      fontSize: 28,
      fontWeight: 700,
      angle: -32,
      layer: "under"
    },
    metadata: {
      title: "设备采购确认单",
      author: "Vue Admin Template",
      subject: "PDF 导出 Demo",
      keywords: ["dompdf.js", "demo"]
    },
    onProgress(progress) {
      progressText.value = describeProgress(progress)
    }
  }
}

async function withExport(task: (root: HTMLElement, options: ExportOptions) => Promise<void>) {
  const root = captureRef.value
  if (!root) {
    ElMessage.warning("未找到导出区域")
    return
  }

  exporting.value = true
  progressText.value = "正在加载中文字体"
  try {
    const options = await buildExportOptions()
    await task(root, options)
  } finally {
    exporting.value = false
  }
}

function revokePreviewUrl() {
  if (!previewObjectUrl) return
  URL.revokeObjectURL(previewObjectUrl)
  previewObjectUrl = ""
  previewUrl.value = ""
}

async function handlePreview() {
  await withExport(async (root, options) => {
    const blob = await exportPDF(root, options)
    revokePreviewUrl()
    previewObjectUrl = URL.createObjectURL(blob)
    previewUrl.value = previewObjectUrl
    ElMessage.success("已生成预览")
  })
}

async function handleDownload() {
  await withExport(async (root, options) => {
    await downloadPDF(root, options, "设备采购确认单.pdf")
    ElMessage.success("已开始下载")
  })
}

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>

<template>
  <div class="p-5">
    <el-card shadow="never">
      <template #header>
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="text-lg font-medium">
              PDF 导出
            </div>
            <div class="mt-1 text-sm text-gray-500">
              使用 <code>dompdf.js</code> 在浏览器内把当前文档导出为可选中、可搜索的矢量 PDF。
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <el-button type="primary" :loading="exporting" @click="handlePreview">
              预览 PDF
            </el-button>
            <el-button :loading="exporting" @click="handleDownload">
              下载 PDF
            </el-button>
          </div>
        </div>
      </template>

      <p v-if="progressText" class="mb-4 text-sm text-gray-500">
        {{ progressText }}
      </p>

      <div class="pdf-workspace">
        <div class="pdf-workspace__preview">
          <div ref="captureRef" class="pdf-doc">
            <header class="pdf-doc__hero">
              <div>
                <p class="pdf-doc__eyebrow">
                  Vue Admin Template
                </p>
                <h1 class="pdf-doc__title">
                  设备采购确认单
                </h1>
              </div>
              <div class="pdf-doc__meta">
                <p>单号：PO-20260922-018</p>
                <p>日期：2026-09-22</p>
                <p>状态：待盖章</p>
              </div>
            </header>

            <section class="pdf-doc__section">
              <h2>采购摘要</h2>
              <p>
                本页演示把现有 DOM 直接转成 PDF：支持分页、页眉页脚、水印和中文字体嵌入。
                导出在浏览器本地完成，不经过后端。
              </p>
              <div class="pdf-doc__grid">
                <div>
                  <span>需求部门</span>
                  <strong>研发中心</strong>
                </div>
                <div>
                  <span>经办人</span>
                  <strong>张三</strong>
                </div>
                <div>
                  <span>交货地址</span>
                  <strong>上海 · 张江办公区 A3</strong>
                </div>
                <div>
                  <span>合计金额</span>
                  <strong>{{ formatMoney(orderTotal) }}</strong>
                </div>
              </div>
            </section>

            <section class="pdf-doc__section">
              <h2>明细清单</h2>
              <table class="pdf-doc__table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>规格</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>小计</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in orderItems" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.spec }}</td>
                    <td>{{ item.qty }}</td>
                    <td>{{ formatMoney(item.price) }}</td>
                    <td>{{ formatMoney(item.qty * item.price) }}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section class="pdf-doc__section" divisionDisable>
              <h2>验收说明</h2>
              <p>
                到货后 3 个工作日内完成开箱验收。显示器需核验序列号，椅具核验气杆铭牌。
                本区块使用 <code>divisionDisable</code>，导出时会尽量保持在同一页。
              </p>
              <p class="mt-2">
                若发现外观损伤、配件缺失或无法开机，请在验收期内拍照留存并联系采购组。超期未反馈的，按验收通过处理。
              </p>
              <p class="mt-2">
                本次采购含安装调试：显示器和支架由供应商上门安装，键盘鼠标到货后由行政统一发放。
                安装完成后请部门接口人在纸质签收单上签字，扫描件回传到本系统即可关闭工单。
              </p>
              <p class="mt-2">
                质保期以供应商合同为准，默认整机一年。保修期内非人为损坏由供应商负责换修，人为损坏按成本价结算。
              </p>
            </section>

            <section class="pdf-doc__section" pageBreak>
              <h2>第二页备注</h2>
              <p>
                这一段带有 <code>pageBreak</code> 属性，会从新页开始。适合把签章、附件说明放到独立页。
              </p>
              <ol>
                <li>PDF 文本可搜索、可复制，不是整页截图。</li>
                <li>页眉页脚支持 <code>{{ pagePlaceholder }}</code> 占位符。</li>
                <li>中文依赖 TTF 嵌入；首次导出会从 CDN 加载思源黑体。</li>
              </ol>
            </section>
          </div>
        </div>

        <div v-if="previewUrl" class="pdf-workspace__result">
          <iframe class="pdf-frame" :src="previewUrl" title="PDF 预览" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
@font-face {
  font-family: SourceHanSansSC-Regular;
  src: url("https://cdn.jsdelivr.net/gh/lmn1919/dompdf.js@v2.0.6/examples/SourceHanSansSC-Regular.ttf")
    format("truetype");
  font-display: swap;
}

.pdf-workspace {
  display: grid;
  gap: 16px;

  @media (min-width: 1200px) {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 1fr);
    align-items: start;
  }
}

.pdf-workspace__preview {
  overflow: auto;
  background: #f5f7fa;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 16px;
}

.pdf-doc {
  width: 698px;
  margin: 0 auto;
  padding: 28px 32px;
  background: #fff;
  color: #303133;
  font-family: SourceHanSansSC-Regular, "Microsoft YaHei", sans-serif;
  line-height: 1.6;
}

.pdf-doc__hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.pdf-doc__eyebrow {
  margin: 0 0 4px;
  color: #909399;
  font-size: 12px;
}

.pdf-doc__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
}

.pdf-doc__meta {
  margin: 0;
  color: #606266;
  font-size: 13px;
  text-align: right;

  p {
    margin: 0;
  }
}

.pdf-doc__section {
  margin-top: 20px;

  h2 {
    margin: 0 0 8px;
    font-size: 16px;
  }

  p,
  ol {
    margin: 0;
    color: #606266;
    font-size: 13px;
  }

  ol {
    padding-left: 18px;
  }
}

.pdf-doc__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;

  span {
    display: block;
    color: #909399;
    font-size: 12px;
  }

  strong {
    font-size: 14px;
    font-weight: 600;
  }
}

.pdf-doc__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid #ebeef5;
    text-align: left;
  }

  th {
    color: #909399;
    font-weight: 600;
    background: #f5f7fa;
  }
}

.pdf-frame {
  width: 100%;
  min-height: 720px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: #fff;
}
</style>
