<script lang="ts" setup>
defineOptions({ name: "CustomDialog" })

withDefaults(defineProps<{
  title?: string
  width?: string | number
}>(), {
  title: "",
  width: "550px"
})

const emit = defineEmits<{
  confirm: []
  closed: []
}>()

const visible = defineModel<boolean>({ default: false })
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="emit('closed')"
  >
    <slot />
    <template #footer>
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button type="primary" @click="emit('confirm')">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
