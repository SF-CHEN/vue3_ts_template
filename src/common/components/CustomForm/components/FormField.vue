<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { computed } from "vue"
import { getFormType } from "../registry"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  form: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  options: () => ({})
})

const emit = defineEmits<{
  fieldChange: [prop: string, value: unknown]
}>()

const fieldValue = computed(() => props.form[props.item.prop])

const fieldComponent = computed(() => {
  const type = props.item.type || "input"
  return getFormType(type)?.component
})

const extraProps = computed(() => props.item.componentProps || {})

function onFieldUpdate(val: unknown) {
  emit("fieldChange", props.item.prop, val)
}
</script>

<template>
  <component
    :is="fieldComponent"
    v-if="fieldComponent"
    :item="item"
    :model-value="fieldValue"
    :form="form"
    :options="options"
    v-bind="extraProps"
    @update:model-value="onFieldUpdate"
  />
</template>
