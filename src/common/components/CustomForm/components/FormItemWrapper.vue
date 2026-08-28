<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import { computed } from "vue"
import { pickFormItemProps } from "../composables/useFormRules"
import { hasFormType } from "../registry"
import FormField from "./FormField.vue"

const props = withDefaults(defineProps<{
  item: FormSchemaItem
  form: Record<string, unknown>
  options?: FormOptionsMap
}>(), {
  options: () => ({})
})

defineEmits<{
  fieldChange: [prop: string, value: unknown]
}>()

const hasRegisteredType = computed(() => hasFormType(props.item.type || "input"))
</script>

<template>
  <el-form-item v-bind="pickFormItemProps(item)" :label-width="item.labelWidth ?? undefined">
    <slot :item="item" :form="form" :value="form[item.prop]">
      <FormField
        v-if="item.type !== 'custom' && hasRegisteredType"
        :item="item"
        :form="form"
        :options="options"
        @field-change="(prop, val) => $emit('fieldChange', prop, val)"
      />
    </slot>
  </el-form-item>
</template>
