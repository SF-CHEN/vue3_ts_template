import "./registry/builtInTypes"

export { default as CustomForm } from "./index.vue"
export {
  getFormType,
  getRegisteredFormTypes,
  hasFormType,
  registerFormType
} from "./registry"
export type {
  FormLayout,
  FormOption,
  FormOptionsMap,
  FormSchemaItem,
  FormTypeConfig
} from "./types"
