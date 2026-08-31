import type { FormItemRule } from "element-plus"

export type FormFieldType
  = | "input"
    | "textarea"
    | "number"
    | "select"
    | "cascader"
    | "date"
    | "switch"
    | "checkbox"
    | "radio"
    | "display"
    | "custom"

/** 下拉 / 单选 / 多选选项 */
export interface FormOption {
  label?: string
  value?: string | number | boolean
  [key: string]: unknown
}

/** 仅用于明确需要 schema 驱动的动态表单。 */
export interface FormSchemaItem {
  prop: string
  label?: string
  type?: FormFieldType
  /** 透传给具体 Element Plus 控件。 */
  typeProps?: Record<string, unknown>
  options?: FormOption[]
  valueKey?: string
  labelKey?: string
  disabled?: boolean
  disabledFn?: (form: Record<string, unknown>) => boolean
  hidden?: boolean
  showFn?: (form: Record<string, unknown>) => boolean
  span?: number
  labelWidth?: string | number
  /** 快捷必填规则。 */
  rule?: boolean
  ruleMessage?: string
  trigger?: string | string[]
  validator?: FormItemRule["validator"]
  pattern?: FormItemRule[]
  rules?: FormItemRule[]
  /** display 字段格式化。 */
  fn?: (value: unknown, form: Record<string, unknown>) => string
}

export type FormOptionsMap = Record<string, FormOption[]>

export type FormLayout = "default" | "inline" | "grid"
