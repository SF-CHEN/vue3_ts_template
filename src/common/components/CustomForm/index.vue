<script lang="ts" setup>
import type { FormInstance, FormItemRule } from "element-plus"
import type { FormLayout, FormOptionsMap, FormSchemaItem } from "./types"
import FormItemWrapper from "./components/FormItemWrapper.vue"
import { useFormRules, useVisibleSchema } from "./composables/useFormRules"

defineOptions({
  name: "CustomForm",
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  schema: FormSchemaItem[]
  options?: FormOptionsMap
  extraRules?: Record<string, FormItemRule | FormItemRule[]>
  layout?: FormLayout
  colSpan?: number
  gutter?: number
}>(), {
  options: () => ({}),
  layout: "default",
  colSpan: 24,
  gutter: 20
})

const emit = defineEmits<{
  change: [prop: string, value: unknown]
}>()

const model = defineModel<Record<string, unknown>>({ default: () => ({}) })
const formRef = useTemplateRef<FormInstance>("formRef")
const attrs = useAttrs()

const { rules } = useFormRules(
  () => props.schema,
  () => props.extraRules ?? {},
  model
)
const visibleSchema = useVisibleSchema(() => props.schema, model)

const formAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !["labelWidth", "label-width"].includes(key))
  )
)

const labelWidth = computed<string | number | undefined>(() => {
  const value = attrs.labelWidth ?? attrs["label-width"]
  return typeof value === "string" || typeof value === "number" ? value : undefined
})

function onFieldChange(prop: string, value: unknown) {
  model.value = { ...model.value, [prop]: value }
  emit("change", prop, value)
}

async function validate() {
  if (!formRef.value) throw new Error("表单尚未挂载")
  await formRef.value.validate()
  return true
}

function clearValidate(propsArg?: string | string[]) {
  formRef.value?.clearValidate(propsArg)
}

function resetFields() {
  formRef.value?.resetFields()
}

defineExpose({ validate, clearValidate, resetFields, formRef })
</script>

<template>
  <el-form
    ref="formRef"
    class="custom-form"
    :model="model"
    :rules="rules"
    :inline="layout === 'inline'"
    :label-width="labelWidth"
    v-bind="formAttrs"
  >
    <el-row v-if="layout === 'grid'" :gutter="gutter">
      <el-col v-for="item in visibleSchema" :key="item.prop" :span="item.span || colSpan">
        <FormItemWrapper
          :item="item"
          :form="model"
          :options="options"
          @field-change="onFieldChange"
        >
          <template v-if="$slots[item.prop]" #default="slotProps">
            <slot :name="item.prop" v-bind="slotProps" />
          </template>
        </FormItemWrapper>
      </el-col>
    </el-row>

    <template v-else>
      <FormItemWrapper
        v-for="item in visibleSchema"
        :key="item.prop"
        :item="item"
        :form="model"
        :options="options"
        @field-change="onFieldChange"
      >
        <template v-if="$slots[item.prop]" #default="slotProps">
          <slot :name="item.prop" v-bind="slotProps" />
        </template>
      </FormItemWrapper>
    </template>

    <el-form-item v-if="$slots.footer">
      <slot name="footer" />
    </el-form-item>
  </el-form>
</template>
