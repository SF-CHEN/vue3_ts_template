<script lang="ts" setup>
import type { UploadFile } from "element-plus"
import type { UploadFile as UploadedFile } from "@@/apis/types/public"
import { uploadPublic } from "@@/apis/public"

const selectedFile = ref<File>()
const uploadProgress = ref(0)
const uploading = ref(false)
const uploaded = ref<UploadedFile>()

function handleFileChange(uploadFile: UploadFile) {
  // 只保留原始 File 给 API 层使用，Element Plus 的 UploadFile 类型不向下扩散。
  selectedFile.value = uploadFile.raw
  uploadProgress.value = 0
  uploaded.value = undefined
}

function handleFileRemove() {
  selectedFile.value = undefined
  uploadProgress.value = 0
  uploaded.value = undefined
}

async function handleUpload() {
  if (!selectedFile.value) {
    ElMessage.warning("请先选择文件")
    return
  }

  uploading.value = true
  uploadProgress.value = 0
  try {
    // API 层把 Axios 进度事件转换成百分比，页面只维护展示状态。
    uploaded.value = await uploadPublic(selectedFile.value, (percent) => {
      uploadProgress.value = percent
    })
    ElMessage.success(`上传成功：${uploaded.value.oriFileName || ""}`)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="p-5">
    <el-card shadow="never">
      <template #header>
        <div>
          <div class="text-lg font-medium">
            文件上传
          </div>
          <div class="mt-1 text-sm text-gray-500">
            调用 `/public/upload`，页面不直接使用 Axios。
          </div>
        </div>
      </template>

      <div class="max-w-2xl space-y-6">
        <el-upload
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <el-button>选择文件</el-button>
        </el-upload>

        <el-progress v-if="uploadProgress > 0" :percentage="uploadProgress" />

        <el-button
          type="primary"
          :loading="uploading"
          :disabled="!selectedFile"
          @click="handleUpload"
        >
          上传文件
        </el-button>

        <p v-if="uploaded" class="text-sm text-gray-500">
          已上传：{{ uploaded.oriFileName }}
          <span v-if="uploaded.saveUri">（{{ uploaded.saveUri }}）</span>
        </p>
      </div>
    </el-card>
  </div>
</template>
