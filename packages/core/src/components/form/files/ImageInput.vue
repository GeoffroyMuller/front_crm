<template>
  <FileInput v-bind="$props" @input="onInput" />
</template>

<script lang="ts" setup>
import type { AnySchema } from "yup/lib/schema";
import type { IconName, Size } from "../../types";
import FileInput from "./FileInput.vue";
import { ref } from "vue";

export interface ImageInputProps {
  modelValue?: any;
  icon?: IconName;
  rules?: AnySchema;
  label?: string;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;

  id?: string;
  placeholder?: string;

  rounded?: Size | "full";

  variant?: "base";
}

const props = defineProps<ImageInputProps>();
const emit = defineEmits(["input"]);

function onInput(e: Event) {
  emit("input", e);
}
</script>
