<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string | number | Date | string[] | number[] | Date[]
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

const { disabled, placeholder } = useFieldContext(props)

function onUpdate(val: unknown) {
  emit("update:modelValue", val)
}

function onChange(val: unknown) {
  emit("change", val)
}
</script>

<template>
  <el-date-picker
    :model-value="modelValue"
    class="date-field"
    :placeholder="placeholder"
    v-bind="item.typeProps"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>

<style lang="scss" scoped>
.date-field {
  width: 100%;
}
</style>
