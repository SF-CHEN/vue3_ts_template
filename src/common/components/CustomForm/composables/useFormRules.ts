import type { FormItemRule } from "element-plus"
import type { MaybeRefOrGetter } from "vue"
import type { FormSchemaItem } from "../types"
import { computed, toValue } from "vue"

function buildFieldRules(item: FormSchemaItem): FormItemRule[] {
  if (Array.isArray(item.rules)) return item.rules
  if (!item.rule && !item.validator && !item.pattern) return []

  const rules: FormItemRule[] = []

  if (item.rule) {
    rules.push({
      required: true,
      message: item.ruleMessage || `${item.label || item.prop}不得为空`,
      trigger: item.trigger || "blur"
    })
  }

  if (item.validator) {
    rules.push({
      validator: item.validator,
      trigger: item.trigger || "blur"
    })
  }

  if (item.pattern) rules.push(...item.pattern)
  return rules
}

/** 根据 schema 构建 Element Plus rules。 */
export function useFormRules(
  schema: MaybeRefOrGetter<FormSchemaItem[]>,
  extraRules: MaybeRefOrGetter<Record<string, FormItemRule | FormItemRule[]>>,
  form: MaybeRefOrGetter<Record<string, unknown>>
) {
  const rules = computed<Record<string, FormItemRule | FormItemRule[]>>(() => {
    const result: Record<string, FormItemRule | FormItemRule[]> = {}
    const formValue = toValue(form)

    for (const item of toValue(schema)) {
      if (item.hidden || (item.showFn && !item.showFn(formValue))) continue
      const fieldRules = buildFieldRules(item)
      if (fieldRules.length) result[item.prop] = fieldRules
    }

    return { ...result, ...toValue(extraRules) }
  })

  return { rules }
}

/** 过滤当前可见的 schema 项。 */
export function useVisibleSchema(
  schema: MaybeRefOrGetter<FormSchemaItem[]>,
  form: MaybeRefOrGetter<Record<string, unknown>>
) {
  return computed(() => {
    const formValue = toValue(form)
    return toValue(schema).filter(item => !item.hidden && (!item.showFn || item.showFn(formValue)))
  })
}
