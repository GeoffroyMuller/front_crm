<template>
  <Form
    :model-value="modelValue"
    @update:model-value="($val) => $emit('update:modelValue', $val)"
    @submit="handleSubmit"
    class="magic-form"
  >
    <template #default="form">
      <slot v-bind="form" :loading="loading" />
      <component
        v-for="field of fields"
        :key="field.name"
        :is="getComponent(field.type)"
        :rules="field.rules"
        :name="field.name"
        :label="$t(field.label)"
        :options="field.options"
        :disabled="loading"
      ></component>
      <div class="magic-form-footer">
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
import type { AnySchema } from "yup";
import { useI18n } from "vue-i18n";
import useUI from "@/core/helpers/vue/composables/ui";
import TextField from "../form/TextField.vue";
import Select from "../form/Select.vue";
import type { Notification } from "../types";
import { ref } from "vue";

export type MagicFormFieldType = "string" | "number" | "select";

export interface MagicFormField {
  name: string;
  label: string;
  type: MagicFormFieldType;
  rules?: AnySchema;
  options?: Array<any>;
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
      ? t(notif)
      : { type: "success", ...notif, message: t(notif.message) };
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
      ? t(notif)
      : { type: "danger", ...notif, message: t(notif.message) };
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

function getComponent(type: MagicFormFieldType) {
  switch (type) {
    case "string":
      return TextField;
    case "number":
      return TextField;
    case "select":
      return Select;
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
