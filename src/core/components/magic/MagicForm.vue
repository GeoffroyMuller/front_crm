<template>
  <Form
    :initial-value="initialValue"
    :model-value="modelValue"
    @update:model-value="($val) => $emit('update:modelValue', $val)"
    @submit="handleSubmit"
    class="magic-form"
    @input-change="($data) => $emit('inputChange', $data)"
  >
    <template #default="form">
      <slot name="fields" v-bind="form" :loading="loading" />
      <template v-if="$slots.fields == null">
        <Grid :gap="gap" :columns="columns">
          <template v-for="field of fields" :key="field.props.name">
            <MagicFormField v-bind="field" />
          </template>
        </Grid>
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
import type { Notification } from "../types";
import { ref } from "vue";
import type { MagicFormFieldProps } from "./MagicFormField.vue";
import MagicFormField from "./MagicFormField.vue";
import Grid from "../layouts/Grid.vue";
import type { GridColumnsOptions } from "../layouts/types";

export interface MagicFormProps {
  fields: Array<MagicFormFieldProps>;
  modelValue?: any;
  btnSaveText?: string;
  initialValue?: any;

  columns?: GridColumnsOptions;
  gap?: number;

  submitAction?: (formData: any) => Promise<any>;
  /* if submitAction is not set, following props useless */
  successToastParams?: (data: any) => Notification | string;
  errorToastParams?: (err: any) => Notification | string;
}

const emit = defineEmits(["update:modelValue", "submit", "inputChange"]);
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
