<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: boolean | string | number
  form?: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  modelValue: false,
  form: () => ({}),
  options: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean | string | number]
  "change": [value: boolean | string | number]
}>()

const { disabled } = useFieldContext(props)

function onUpdate(val: boolean | string | number) {
  emit("update:modelValue", val)
}

function onChange(val: boolean | string | number) {
  emit("change", val)
}
</script>

<template>
  <el-switch
    :model-value="modelValue"
    v-bind="item.typeProps"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>
