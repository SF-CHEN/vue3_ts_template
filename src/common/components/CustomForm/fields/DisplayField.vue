<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { computed } from "vue"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  modelValue?: string | number | boolean
  form?: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  modelValue: "",
  form: () => ({}),
  options: () => ({})
})

const displayText = computed(() => {
  if (typeof props.item.fn === "function") {
    return props.item.fn(props.modelValue, props.form)
  }
  return props.modelValue
})
</script>

<template>
  <div class="display-field">
    {{ displayText }}
  </div>
</template>
