import type { FormTypeConfig } from "../types"
import { markRaw } from "vue"

const formTypeRegistry = new Map<string, FormTypeConfig>()

/** 注册表单字段类型 */
export function registerFormType(type: string, config: FormTypeConfig) {
  if (!type || !config?.component) {
    console.warn("[CustomForm] registerFormType: type 与 component 为必填项")
    return
  }
  formTypeRegistry.set(type, {
    ...config,
    component: markRaw(config.component)
  })
}

export function getFormType(type: string) {
  return formTypeRegistry.get(type)
}

export function hasFormType(type: string) {
  return formTypeRegistry.has(type)
}

export function getRegisteredFormTypes() {
  return [...formTypeRegistry.keys()]
}
