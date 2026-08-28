<script lang="ts" setup>
defineOptions({ name: "CustomDialog" })

withDefaults(defineProps<{
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: string | number
  /** 确认按钮 loading */
  loading?: boolean
  /** 确认文案，对齐旧站默认「保存」 */
  confirmText?: string
  /** 取消文案 */
  cancelText?: string
  /** 是否展示默认底部按钮 */
  showFooter?: boolean
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
}>(), {
  title: "",
  width: "550px",
  loading: false,
  confirmText: "保存",
  cancelText: "取消",
  showFooter: true,
  closeOnClickModal: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  closed: []
}>()

const visible = defineModel<boolean>({ default: false })

function handleCancel() {
  visible.value = false
  emit("cancel")
}

function handleConfirm() {
  emit("confirm")
}

function handleClosed() {
  emit("closed")
}
</script>

<template>
  <!--
    弹窗默认挂 body；图标用内联 SVG，避免 UnoCSS important:#app
    在 teleport 场景下首次能显示、再次打开丢失的问题
  -->
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    append-to-body
    :close-on-click-modal="closeOnClickModal"
    destroy-on-close
    class="custom-dialog"
    @closed="handleClosed"
  >
    <slot />

    <template v-if="showFooter" #footer>
      <slot name="footer">
        <div class="custom-dialog__footer">
          <el-button class="custom-dialog__btn" @click="handleCancel">
            <template #icon>
              <svg class="custom-dialog__icon" viewBox="0 0 1024 1024" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M764.288 214.592L512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.248l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                />
              </svg>
            </template>
            {{ cancelText }}
          </el-button>
          <el-button
            type="primary"
            class="custom-dialog__btn"
            :loading="loading"
            @click="handleConfirm"
          >
            <template #icon>
              <svg class="custom-dialog__icon" viewBox="0 0 1024 1024" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M406.656 706.944L195.84 496.256a32 32 0 1 0-45.248 45.248l230.976 230.976a32 32 0 0 0 45.248 0l512-512a32 32 0 0 0-45.248-45.248L406.656 706.944z"
                />
              </svg>
            </template>
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>

    <slot name="other" />
  </el-dialog>
</template>

<style lang="scss" scoped>
.custom-dialog__footer {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.custom-dialog__btn {
  min-width: 96px;
  height: 36px;
}

.custom-dialog__icon {
  display: block;
  width: 1em;
  height: 1em;
}
</style>
