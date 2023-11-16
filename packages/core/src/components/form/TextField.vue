<template>
  <div
    @click="
      ($refs.internalRef as HTMLInputElement)?.focus?.(),
        // @ts-ignore
        $refs?.inputRef?.$refs?.internalRef?.focus?.()
    "
    class="text-field"
    :class="{
      error: internalError || error,
      [`rounded-${rounded}`]: true,
    }"
  >
    <label v-if="label">
      {{ label }}
    </label>
    <div class="input-wrapper">
      <Input
        ref="inputRef"
        v-model="internalValue"
        :inputClass="inputClass"
        @focus="onFocus"
        @blur="onBlur"
        v-bind="{
          min,
          max,
          step,
          icon,
          placeholder,
          error,
          id,
          disabled,
          blur: onBlur,
          focus: onFocus,
          input: onInput,
          mask,
          appearanceNone,
          rounded,
          type,
          variant,
        }"
      >
        <template #start v-if="$slots.start">
          <slot name="start" />
        </template>
        <template #icon v-if="$slots.icon">
          <slot name="icon" />
        </template>
      </Input>
    </div>
    <Alert
      v-if="
        (internalError || error) && typeof (internalError || error) === 'string'
      "
    >
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script lang="ts" setup>
import useValidatable from "../../composables/validatable";
import { withDefaults, type InputHTMLAttributes } from "vue";
import type { IconName, Size } from "../types";
import Alert from "../Alert.vue";
import type { AnySchema } from "yup";
import Input from "./Input.vue";
import type { MaskOptions } from "maska/dist/types/mask";

export interface TextFieldProps {
  mask?: string | MaskOptions;
  icon?: IconName;
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
  appearanceNone?: boolean;
  rounded?: Size | "full";

  inputClass?: any;

  variant?: "text" | "title" | "base";
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  type: "text",
  rounded: "sm",
  placeholder: "",
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
  validate();
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
.text-field {
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  width: 100%;

  textarea {
    &:disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
  }
  textarea {
    padding: spacing(2) spacing(1.5);
    min-height: spacing(12);
    height: auto;
    resize: vertical;
  }
}
</style>
