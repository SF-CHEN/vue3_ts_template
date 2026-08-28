<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string | number | boolean | Array<string | number>
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

const { valueKey, labelKey, fieldOptions, disabled, placeholder, getOptionValue } = useFieldContext(props)

function onUpdate(val: unknown) {
  emit("update:modelValue", val)
}

function onChange(val: unknown) {
  emit("change", val)
}
</script>

<template>
  <el-select
    :model-value="modelValue"
    class="form-select"
    :placeholder="placeholder"
    v-bind="item.typeProps"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  >
    <el-option
      v-for="option in fieldOptions"
      :key="String(option[valueKey])"
      :label="String(option[labelKey] ?? '')"
      :value="getOptionValue(option)"
    />
  </el-select>
</template>

<style lang="scss" scoped>
.form-select {
  width: 100%;
  min-width: 160px;
}
</style>
