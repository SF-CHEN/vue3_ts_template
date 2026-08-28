import type { FormOption, FormOptionsMap, FormSchemaItem } from "../types"
import { computed } from "vue"

interface FieldContextProps {
  item: FormSchemaItem
  form: Record<string, unknown>
  options?: FormOptionsMap
}

/** 字段级上下文：统一解析 options / disabled / keys / placeholder */
export function useFieldContext(props: FieldContextProps) {
  const valueKey = computed(() => props.item.valueKey || "value")
  const labelKey = computed(() => props.item.labelKey || "label")

  const getOptionValue = (option: FormOption): string | number | boolean => option[valueKey.value] as string | number | boolean

  const fieldOptions = computed(() => {
    const fromMap = props.options?.[props.item.prop]
    const fromItem = props.item.options
    const opts = fromMap ?? fromItem ?? []
    return Array.isArray(opts) ? opts : []
  })

  const disabled = computed(() => {
    if (typeof props.item.disabledFn === "function") {
      return props.item.disabledFn(props.form)
    }
    return !!props.item.disabled
  })

  const placeholder = computed(() => {
    const custom = props.item.typeProps?.placeholder
    if (typeof custom === "string") return custom
    const label = props.item.label || ""
    const inputTypes = ["input", "textarea", "number"]
    if (inputTypes.includes(props.item.type || "input")) return `请输入${label}`
    return `请选择${label}`
  })

  return {
    valueKey,
    labelKey,
    getOptionValue,
    fieldOptions,
    disabled,
    placeholder
  }
}
