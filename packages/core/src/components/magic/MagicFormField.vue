<template>
  <component
    :is="getComponent()"
    v-bind="getProps()"
    :label="$t($props.props.label || '')"
  />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import Autocomplete, { type AutocompleteProps } from "../form/Autocomplete.vue";
import DatePicker, {
  type DatePickerProps,
} from "../form/Datepicker/DatePicker.vue";
import RadioGroup, { type RadioGroupProps } from "../form/RadioGroup.vue";
import Select, { type SelectProps } from "../form/Select.vue";
import Switch, { type SwitchProps } from "../form/Switch.vue";
import TextField, { type TextFieldProps } from "../form/TextField.vue";
import MagicAutocomplete, {
  type MagicAutocompleteProps,
} from "./MagicAutocomplete.vue";

export type MagicFormFieldType =
  | "string"
  | "number"
  | "select"
  | "autocomplete"
  | "datepicker"
  | "radiogroup"
  | "switch"
  | "magicautocomplete";
export type MagicFormFieldPropsProps =
  | AutocompleteProps
  | TextFieldProps
  | DatePickerProps
  | SelectProps
  | RadioGroupProps
  | SwitchProps
  | MagicAutocompleteProps<any>;

export interface MagicFormFieldProps {
  props: MagicFormFieldPropsProps;
  component?: Component;
  /* if component is set, following props useless */
  type: MagicFormFieldType;
}

const props = withDefaults(defineProps<MagicFormFieldProps>(), {});

function getProps(): any {
  if (props.type == "number") {
    return { ...props.props, type: props.type };
  }
  return props.props;
}

function getComponent(): Component {
  if (props.component != null) {
    return props.component;
  }
  switch (props.type) {
    case "string":
      return TextField;
    case "number":
      return TextField;
    case "select":
      return Select;
    case "switch":
      return Switch;
    case "radiogroup":
      return RadioGroup;
    case "autocomplete":
      return Autocomplete;
    case "datepicker":
      return DatePicker;
    case "magicautocomplete":
      return MagicAutocomplete;
    default:
      return TextField;
  }
}
</script>
