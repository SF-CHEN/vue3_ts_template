import type { FormItemRule } from "element-plus"
import type { MaybeRefOrGetter } from "vue"
import type { FormSchemaItem } from "../types"
import { computed, reactive, toValue, watch } from "vue"

const FORM_ITEM_KEYS = [
  "prop",
  "label",
  "required",
  "rules",
  "error",
  "showMessage",
  "inline",
  "size",
  "for",
  "validateStatus"
] as const

/** 提取可透传给 el-form-item 的属性 */
export function pickFormItemProps(item: FormSchemaItem) {
  const result: Record<string, unknown> = {}
  FORM_ITEM_KEYS.forEach((key) => {
    if (item[key] !== undefined) {
      result[key] = item[key]
    }
  })
  return result
}

function buildFieldRules(item: FormSchemaItem): FormItemRule[] {
  if (Array.isArray(item.rules)) {
    return item.rules
  }
  if (!item.rule && !item.validator && !item.pattern) {
    return []
  }

  const fieldRules: FormItemRule[] = []
  if (item.rule) {
    fieldRules.push({
      required: true,
      message: item.ruleMessage || `${item.label}不得为空`,
      trigger: item.trigger || "blur"
    })
  }
  if (item.validator) {
    fieldRules.push({
      validator: item.validator,
      trigger: item.trigger || "blur"
    })
  }
  if (item.pattern) {
    fieldRules.push(...item.pattern)
  }
  return fieldRules
}

/** 根据 schema 构建 Element Plus 表单 rules */
export function useFormRules(
  schema: MaybeRefOrGetter<FormSchemaItem[]>,
  extraRules: MaybeRefOrGetter<Record<string, FormItemRule | FormItemRule[]>>,
  form?: MaybeRefOrGetter<Record<string, unknown>>
) {
  const rules = reactive<Record<string, FormItemRule | FormItemRule[]>>({})

  function rebuildRules() {
    Object.keys(rules).forEach((key) => {
      delete rules[key]
    })
    toValue(schema).forEach((item) => {
      if (!item.prop) return
      if (item.hidden) return
      const formValue = form ? toValue(form) : undefined
      if (typeof item.showFn === "function" && formValue && !item.showFn(formValue)) return
      const fieldRules = buildFieldRules(item)
      if (fieldRules.length) {
        rules[item.prop] = fieldRules
      }
    })
    Object.assign(rules, toValue(extraRules) || {})
  }

  watch(
    () => [toValue(schema), toValue(extraRules), form ? toValue(form) : null],
    rebuildRules,
    { immediate: true, deep: true }
  )

  return { rules, rebuildRules }
}

/** 过滤可见 schema 项 */
export function useVisibleSchema(
  schema: MaybeRefOrGetter<FormSchemaItem[]>,
  form: MaybeRefOrGetter<Record<string, unknown>>
) {
  return computed(() =>
    toValue(schema).filter((item) => {
      if (item.hidden) return false
      if (typeof item.showFn === "function") {
        return item.showFn(toValue(form))
      }
      return true
    })
  )
}
