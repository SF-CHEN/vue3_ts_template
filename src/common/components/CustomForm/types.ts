import type { FormItemRule } from "element-plus"
import type { Component } from "vue"

/** 下拉 / 单选 / 多选选项 */
export interface FormOption {
  label?: string
  value?: string | number | boolean
  [key: string]: unknown
}

/** 表单 schema 项 */
export interface FormSchemaItem {
  prop: string
  label?: string
  /** 字段类型，默认 input；custom 仅渲染插槽 */
  type?: string
  /** 透传给具体控件（el-input / el-select 等） */
  typeProps?: Record<string, unknown>
  /** 透传给字段组件根 */
  componentProps?: Record<string, unknown>
  options?: FormOption[]
  valueKey?: string
  labelKey?: string
  disabled?: boolean
  disabledFn?: (form: Record<string, unknown>) => boolean
  hidden?: boolean
  showFn?: (form: Record<string, unknown>) => boolean
  span?: number
  labelWidth?: string | number
  /** 快捷必填：true → required rule */
  rule?: boolean
  ruleMessage?: string
  trigger?: string | string[]
  validator?: FormItemRule["validator"]
  pattern?: FormItemRule[]
  rules?: FormItemRule[]
  /** display / div 自定义展示 */
  fn?: (value: unknown, form: Record<string, unknown>) => string
  [key: string]: unknown
}

export interface FormTypeConfig {
  component: Component
}

export type FormOptionsMap = Record<string, FormOption[]>

export type FormLayout = "default" | "inline" | "grid"
