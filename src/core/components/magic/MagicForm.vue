<template>
  <Form
    :model-value="modelValue"
    @update:model-value="($val) => $emit('update:modelValue', $val)"
    @submit="handleSubmit"
    class="magic-form"
  >
    <template #default="form">
      <slot name="fields" v-bind="form" :loading="loading" />
      <template v-if="$slots.fields == null">
        <template v-for="field of fields" :key="field.props.name">
          <component
            :is="getComponent(field)"
            v-bind="field.props"
            :label="$t(field.props.label || '')"
          />
        </template>
      </template>
      <slot name="footer" v-bind="form" :loading="loading" />
      <div class="magic-form-footer" v-if="$slots.footer == null">
        <Button
          type="submit"
          :loading="loading"
          :disabled="form.hasError || loading"
        >
          {{ btnSaveText ? $t(btnSaveText) : $t("save") }}
        </Button>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import Button from "../Button.vue";
import Form from "../form/Form.vue";
import { useI18n } from "vue-i18n";
import useUI from "@/core/helpers/vue/composables/ui";
import TextField, { type InputProps } from "../form/TextField.vue";
import Select, { type SelectProps } from "../form/Select.vue";
import type { Notification } from "../types";
import { ref, type Component } from "vue";
import Autocomplete, { type AutocompleteProps } from "../form/Autocomplete.vue";
import DatePicker, { type DatePickerProps } from "../form/DatePicker.vue";
import RadioGroup, { type RadioGroupProps } from "../form/RadioGroup.vue";
import Switch, { type SwitchProps } from "../form/Switch.vue";

export type MagicFormFieldType =
  | "string"
  | "number"
  | "select"
  | "autocomplete"
  | "datepicker"
  | "radiogroup"
  | "switch";
export type MagicFormFieldProps =
  | AutocompleteProps
  | InputProps
  | DatePickerProps
  | SelectProps
  | RadioGroupProps
  | SwitchProps;

export interface MagicFormField {
  props: MagicFormFieldProps;
  component?: Component;
  /* if component is set, following props useless */
  type: MagicFormFieldType;
}

export interface MagicFormProps {
  fields: Array<MagicFormField>;
  modelValue?: any;
  btnSaveText?: string;

  submitAction?: (formData: any) => Promise<any>;
  /* if submitAction is not set, following props useless */
  successToastParams?: (data: any) => Notification | string;
  errorToastParams?: (err: any) => Notification | string;
}

const emit = defineEmits(["update:modelValue", "submit"]);
const props = withDefaults(defineProps<MagicFormProps>(), {});

const loading = ref(false);

function getSuccessToastParams(res: any): Notification | string {
  if (props.successToastParams) {
    const notif = props.successToastParams(res);
    return typeof notif === "string"
      ? { type: "success", message: t(notif) }
      : notif;
  }
  return {
    type: "success",
    message: t("saved"),
  };
}
function getErrorToastParams(err: any): Notification | string {
  if (props.errorToastParams) {
    const notif = props.errorToastParams(err);
    return typeof notif === "string"
      ? { type: "danger", message: t(notif) }
      : notif;
  }
  return {
    type: "danger",
    message: t("error_occured"),
  };
}

async function handleSubmit(data: any) {
  loading.value = true;
  if (props.submitAction) {
    try {
      const res = await props.submitAction(data);
      toast(getSuccessToastParams(res));
    } catch (err) {
      console.error(err);
      toast(getErrorToastParams(err));
    }
  }
  await emit("submit", data);
  loading.value = false;
}

const { toast } = useUI();
const { t } = useI18n();

function getComponent(field: MagicFormField): Component {
  if (field.component != null) {
    return field.component;
  }
  switch (field.type) {
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
    default:
      return TextField;
  }
}
</script>

<style lang="scss">
.magic-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  .magic-form-footer {
    display: flex;
    gap: spacing(1);
  }
}
</style>
