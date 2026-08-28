<script lang="ts" setup>
import type { FormItemRule, FormInstance } from "element-plus"

import type { FormLayout, FormOptionsMap, FormSchemaItem } from "./types"
import { computed, useAttrs, useTemplateRef } from "vue"
import FormItemWrapper from "./components/FormItemWrapper.vue"
import { useFormRules, useVisibleSchema } from "./composables/useFormRules"
import "./registry/builtInTypes"

defineOptions({
  name: "CustomForm",
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  /** 表单 schema */
  schema: FormSchemaItem[]
  options?: FormOptionsMap
  /** 额外校验规则 */
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

const internalModel = defineModel<Record<string, unknown>>({ default: () => ({}) })

const formData = computed(() => internalModel.value)

const schemaSource = computed(() => props.schema)
const extraRulesSource = computed(() => props.extraRules ?? {})

const { rules } = useFormRules(schemaSource, extraRulesSource, formData)
const visibleSchema = useVisibleSchema(schemaSource, formData)

const formRef = useTemplateRef<FormInstance>("formRef")
const attrs = useAttrs()

const filterAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !["labelWidth", "label-width"].includes(key))
  )
)

const formLabelWidth = computed(() => {
  const labelWidth = attrs.labelWidth ?? attrs["label-width"]
  return labelWidth || labelWidth === 0 ? labelWidth : undefined
})

function onFieldChange(prop: string, val: unknown) {
  const target = formData.value
  if (target && typeof target === "object") {
    target[prop] = val
  }
  internalModel.value = { ...internalModel.value, [prop]: val }
  emit("change", prop, val)
}

function validate() {
  return new Promise<boolean>((resolve, reject) => {
    if (!formRef.value) {
      reject(new Error("表单尚未挂载"))
      return
    }
    formRef.value.validate((valid) => {
      if (valid) resolve(true)
      else reject(new Error("表单校验不通过"))
    })
  })
}

function clearValidate(propsArg?: string | string[]) {
  formRef.value?.clearValidate(propsArg)
}

function resetFields() {
  formRef.value?.resetFields()
}

defineExpose({
  validate,
  clearValidate,
  resetFields,
  formRef
})
</script>

<template>
  <el-form
    ref="formRef"
    class="custom-form"
    :model="formData"
    :rules="rules"
    :inline="layout === 'inline'"
    v-bind="filterAttrs"
    :label-width="formLabelWidth as any"
  >
    <el-row v-if="layout === 'grid'" :gutter="gutter">
      <el-col v-for="item in visibleSchema" :key="item.prop" :span="item.span || colSpan">
        <FormItemWrapper
          :item="item"
          :form="formData"
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
        :form="formData"
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
