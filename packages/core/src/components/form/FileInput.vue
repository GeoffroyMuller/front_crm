<template>
  <div class="grid gap-2">
    <label v-if="label" @click="$refs.internalRef?.click?.()">
      {{ label }}
    </label>
    <div
      class="file-input min-h-input relative flex items-center justify-center gap-2 p-4 typo-title5 text-slate-400 cursor-pointer"
      :class="{
        'border border-dashed border-slate-400': variant === 'base',
        [`rounded-${rounded}`]: true,
      }"
      @click="$refs.internalRef?.click?.()"
    >
      <Icon name="file_upload" size="sm" />
      {{ placeholder || $t("core.import") }}
    </div>
    <input
      ref="internalRef"
      @focus="onFocus()"
      @blur="onBlur()"
      @input="onInput($event)"
      class="hidden"
      type="file"
    />
  </div>
</template>

<script setup lang="ts">
import type { AnySchema } from "yup/lib/schema";
import type { IconName, Size } from "../types";
import useValidatable from "../../composables/validatable";
import Icon from "../Icon.vue";

export interface InputFileProps {
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
const props = withDefaults(defineProps<InputFileProps>(), {
  rounded: "md",
  placeholder: "",
  variant: "base",
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);
function onBlur() {
  emit("blur");
}

function onFocus() {
  emit("focus");
}

function onInput(e: InputEvent) {
  emit("input", e);
}
const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});
</script>

<style lang="scss">
.file-input {
  &::before {
    content: " ";
    @apply absolute top-0 left-0 w-full h-full rounded-sm transition-all bg-transparent pointer-events-none opacity-10;
  }
  &:hover::before {
    @apply bg-selectable;
  }
}
</style>
