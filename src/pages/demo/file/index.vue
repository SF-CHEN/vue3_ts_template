<script lang="ts" setup>
import type { UploadFile } from "element-plus"
import { downloadDemoFile, uploadDemoFile } from "@@/apis/demo-file"

const selectedFile = ref<File>()
const uploadProgress = ref(0)
const uploading = ref(false)
const downloading = ref(false)

function handleFileChange(uploadFile: UploadFile) {
  selectedFile.value = uploadFile.raw
  uploadProgress.value = 0
}

function handleFileRemove() {
  selectedFile.value = undefined
  uploadProgress.value = 0
}

async function handleUpload() {
  if (!selectedFile.value) {
    ElMessage.warning("请先选择文件")
    return
  }

  uploading.value = true
  uploadProgress.value = 0
  try {
    const result = await uploadDemoFile(selectedFile.value, (percent) => {
      uploadProgress.value = percent
    })
    ElMessage.success(`上传成功：${result.name}`)
  } finally {
    uploading.value = false
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

async function handleDownload() {
  downloading.value = true
  try {
    const blob = await downloadDemoFile(1)
    saveBlob(blob, "file-transfer-demo.txt")
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <div class="p-5">
    <el-card shadow="never">
      <template #header>
        <div>
          <div class="text-lg font-medium">
            文件上传与下载
          </div>
          <div class="mt-1 text-sm text-gray-500">
            演示 FormData、上传进度和 Blob 下载，页面不直接使用 Axios。
          </div>
        </div>
      </template>

      <div class="max-w-2xl space-y-8">
        <section>
          <h3 class="mb-3 font-medium">
            文件上传
          </h3>
          <el-upload
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
          >
            <el-button>选择文件</el-button>
          </el-upload>

          <el-progress v-if="uploadProgress > 0" class="mt-4" :percentage="uploadProgress" />

          <el-button
            class="mt-4"
            type="primary"
            :loading="uploading"
            :disabled="!selectedFile"
            @click="handleUpload"
          >
            上传文件
          </el-button>
        </section>

        <el-divider />

        <section>
          <h3 class="mb-2 font-medium">
            Blob 下载
          </h3>
          <p class="mb-4 text-sm text-gray-500">
            API 只返回 Blob，浏览器保存动作保留在页面交互边界。
          </p>
          <el-button type="primary" :loading="downloading" @click="handleDownload">
            下载示例文件
          </el-button>
        </section>
      </div>
    </el-card>
  </div>
</template>
