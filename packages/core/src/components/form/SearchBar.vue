<template>
  <TextField
    rounded="full"
    class="max-w-[400px]"
    v-bind="$attrs"
    input-class="input-style-card shadow-card h-[39px]"
    :placeholder="$props.placeholder || $t('search')"
  >
    <template #icon>
      <Icon name="search" color="primary" />
    </template>
  </TextField>
</template>

<script setup lang="ts">
import type { MaskOptions } from "maska";
import type { AnySchema } from "yup";
import Icon from "../Icon.vue";
import type { IconName } from "../types";
import TextField from "./TextField.vue";

export interface SearchBarProps {
  mask?: string | MaskOptions;
  icon?: IconName;
  multiline?: boolean;
  label?: string;
  modelValue?: any;
  type?: string;
  step?: number;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  min?: number | undefined | null;
  max?: number | undefined | null;

  id?: string;
  placeholder?: string;
  //hide arrows input number
  appearanceNone?: boolean | null;
}

const props = defineProps<SearchBarProps>();
</script>

<style lang="scss">
.input-style-card {
  border-color: transparent !important;
  @apply px-2.5 transition-all duration-300;
  &:focus-within {
    @apply shadow-primary-300;
  }
}
</style>
