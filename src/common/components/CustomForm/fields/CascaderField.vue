<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { useFieldContext } from "../composables/useFieldContext"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string | number | Array<string | number>
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

const { fieldOptions, disabled, placeholder } = useFieldContext(props)

function onUpdate(val: unknown) {
  emit("update:modelValue", val)
}

function onChange(val: unknown) {
  emit("change", val)
}
</script>

<template>
  <el-cascader
    :model-value="modelValue"
    class="cascader-field"
    :options="fieldOptions as any"
    :placeholder="placeholder"
    v-bind="item.typeProps"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>

<style lang="scss" scoped>
.cascader-field {
  width: 100%;
}
</style>
