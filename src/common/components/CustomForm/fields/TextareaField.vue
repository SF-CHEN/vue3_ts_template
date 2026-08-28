<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string
  form?: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  modelValue: "",
  form: () => ({}),
  options: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  "change": [value: string]
}>()

const { disabled, placeholder } = useFieldContext(props)

function onUpdate(val: string) {
  emit("update:modelValue", val)
}

function onChange(val: string) {
  emit("change", val)
}
</script>

<template>
  <el-input
    type="textarea"
    :model-value="modelValue"
    v-bind="item.typeProps"
    :placeholder="placeholder"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>
