<template>
  <TextField
    type="number"
    v-bind="$props"
    :step="0.01"
    @update:model-value="($val) => $emit('update:modelValue', $val)"
    icon="euro"
    appearance-none
  />
</template>

<script lang="ts" setup>
import TextField from "@/core/components/form/TextField.vue";
import type { IconName } from "@/core/components/types";
import type { AnySchema } from "yup";

export interface PriceInputProps {
  icon?: IconName;
  multiline?: boolean;
  label?: string;
  modelValue?: any;
  step?: number;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  min?: number | undefined | null;
  max?: number | undefined | null;
  id?: string;
}

const props = withDefaults(defineProps<PriceInputProps>(), {});
</script>
