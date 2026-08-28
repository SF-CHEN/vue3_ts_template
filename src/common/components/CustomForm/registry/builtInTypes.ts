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
import { registerFormType } from "./index"

const builtInFormTypes = {
  input: InputField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  cascader: CascaderField,
  date: DateField,
  switch: SwitchField,
  checkbox: CheckboxField,
  radio: RadioField,
  div: DisplayField,
  display: DisplayField
}

Object.entries(builtInFormTypes).forEach(([type, component]) => {
  registerFormType(type, { component })
})

export { builtInFormTypes }
