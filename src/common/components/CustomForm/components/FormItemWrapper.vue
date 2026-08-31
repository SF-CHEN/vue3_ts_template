<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import FormField from "./FormField.vue"

withDefaults(defineProps<{
  item: FormSchemaItem
  form: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  options: () => ({})
})

defineEmits<{
  fieldChange: [prop: string, value: unknown]
}>()
</script>

<template>
  <el-form-item :prop="item.prop" :label="item.label" :label-width="item.labelWidth">
    <slot :item="item" :form="form" :value="form[item.prop]">
      <FormField
        v-if="item.type !== 'custom'"
        :item="item"
        :form="form"
        :options="options"
        @field-change="(prop, value) => $emit('fieldChange', prop, value)"
      />
    </slot>
  </el-form-item>
</template>
