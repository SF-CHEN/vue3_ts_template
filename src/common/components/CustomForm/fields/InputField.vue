<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string | number
  form?: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  modelValue: "",
  form: () => ({}),
  options: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
  "change": [value: string | number]
}>()

const { disabled, placeholder } = useFieldContext(props)

function onUpdate(val: string) {
  emit("update:modelValue", val)
}

function onChange(val: string | number) {
  emit("change", val)
}
</script>

<template>
  <el-input
    :model-value="modelValue"
    v-bind="item.typeProps"
    :placeholder="placeholder"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>
