<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: number
  form?: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  form: () => ({}),
  options: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: number | undefined]
  "change": [value: number | undefined]
}>()

const { disabled } = useFieldContext(props)

function onUpdate(val: number | undefined) {
  emit("update:modelValue", val)
}

function onChange(val: number | undefined) {
  emit("change", val)
}
</script>

<template>
  <el-input-number
    :model-value="modelValue"
    class="number-field"
    v-bind="item.typeProps"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>

<style lang="scss" scoped>
.number-field {
  width: 100%;
}
</style>
