<template>
  <div
    class="min-h-input h-input relative border border-solid overflow-hidden flex items-center px-2 py-1"
    :class="[
      {
        'border-danger-400 focus-within:shadow-[0_0_2pt_0.5pt] focus-within:shadow-danger-200':
          internalError || error,
        'focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input':
          !internalError && !error,
        [`rounded-${rounded}`]: true,
        'bg-white': !disabled,
        'bg-inputDisabled cursor-not-allowed': disabled,
      },
      inputClass,
    ]"
    @click="($refs.internalRef as HTMLInputElement)?.focus?.()"
  >
    <div v-if="$slots.start">
      <slot name="start" />
    </div>
    <input
      class="mousetrap flex-1 min-h-input h-input outline-none focus:outline-none border-none disabled:cursor-not-allowed w-full"
      @blur="onBlur"
      :class="{
        'appearance-none': appearanceNone === true,
      }"
      ref="internalRef"
      v-model="internalValue"
      @focus="onFocus"
      @input="(e) => onInput(e)"
      v-maska:[maskOptions]
      v-bind="{
        min: min as InputHTMLAttributes['min'],
        max: max as InputHTMLAttributes['min'],
        type,
        step,
        disabled,
        readonly,
        name,
        id,
        placeholder,
      }"
    />
    <div
      v-if="icon || $slots.icon"
      class="ml-1"
      :class="{
        [`rounded-${rounded}`]: true,
      }"
    >
      <Icon v-if="icon" :name="icon" />
      <slot name="icon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MaskOptions } from "maska";
import useValidatable from "../../composables/validatable";
import { computed, type InputHTMLAttributes } from "vue";
import type { AnySchema } from "yup";
import type { IconName, Size } from "../types";
import Icon from "../Icon.vue";

export type InputProps = {
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
};

const props = withDefaults(defineProps<InputProps>(), {
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

const maskOptions = computed<MaskOptions | null>(() => {
  if (props.mask) {
    if (typeof props.mask === "string") {
      return {
        mask: props.mask,
      };
    }
    return props.mask;
  }
  return null;
});
</script>

<style lang="scss">
input {
  &.appearance-none {
    /* Firefox */
    -moz-appearance: textfield;

    /* Chrome */
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Opéra*/
    &::-o-inner-spin-button {
      -o-appearance: none;
      margin: 0;
    }
  }
}
</style>
