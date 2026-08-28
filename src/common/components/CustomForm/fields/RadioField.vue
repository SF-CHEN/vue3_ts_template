<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string | number | boolean
  form?: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  form: () => ({}),
  options: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: unknown]
  "change": [value: unknown]
}>()

const { valueKey, labelKey, fieldOptions, disabled, getOptionValue } = useFieldContext(props)

function onUpdate(val: unknown) {
  emit("update:modelValue", val)
}

function onChange(val: unknown) {
  emit("change", val)
}
</script>

<template>
  <el-radio-group
    :model-value="modelValue"
    v-bind="item.typeProps"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  >
    <el-radio
      v-for="option in fieldOptions"
      :key="String(option[valueKey])"
      :value="getOptionValue(option)"
    >
      {{ option[labelKey] }}
    </el-radio>
  </el-radio-group>
</template>
