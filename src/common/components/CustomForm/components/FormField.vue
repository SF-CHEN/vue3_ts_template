<script lang="ts" setup>
import type { FormOptionsMap, FormSchemaItem } from "../types"
import CascaderField from "../fields/CascaderField.vue"
import CheckboxField from "../fields/CheckboxField.vue"
import DateField from "../fields/DateField.vue"
import DisplayField from "../fields/DisplayField.vue"
import InputField from "../fields/InputField.vue"
import NumberField from "../fields/NumberField.vue"
import RadioField from "../fields/RadioField.vue"
import SelectField from "../fields/SelectField.vue"
import SwitchField from "../fields/SwitchField.vue"
import TextareaField from "../fields/TextareaField.vue"

type BuiltInFieldValue
  = | string
    | number
    | boolean
    | Date
    | (string | number)[]
    | (string | number | boolean)[]
    | (string | number | Date)[]
    | undefined

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

const fieldComponents = {
  input: InputField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  cascader: CascaderField,
  date: DateField,
  switch: SwitchField,
  checkbox: CheckboxField,
  radio: RadioField,
  display: DisplayField
} as const

const fieldValue = computed(() => props.form[props.item.prop] as BuiltInFieldValue)
const fieldComponent = computed(() => {
  const type = props.item.type || "input"
  return type === "custom" ? undefined : fieldComponents[type]
})

function onFieldUpdate(value: unknown) {
  emit("fieldChange", props.item.prop, value)
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
    @update:model-value="onFieldUpdate"
  />
</template>
