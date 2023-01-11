<template>
  <Form
    :model-value="modelValue"
    @update:model-value="($val) => $emit('update:modelValue', $val)"
    @submit="handleSubmit"
    class="magic-form"
  >
    <template #default="{ hasError }">
      <component
        v-for="field of fields"
        :key="field.name"
        :is="getComponent(field.type)"
        :rules="field.rules"
        :options="field.options"
      ></component>
      <Button type="submit" :disabled="hasError">
        {{ btnSaveText || $t("save") }}
      </Button>
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
}

const emit = defineEmits(["update:modelValue", "submit"]);
const props = withDefaults(defineProps<MagicFormProps>(), {});

async function handleSubmit(data: any) {
  try {
    await emit("submit", data);
  } catch (err) {
    console.error(err);
  }
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
}
</style>
