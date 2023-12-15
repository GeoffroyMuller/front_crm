<template>
  <div
    class="min-h-input h-input relative border border-solid overflow-hidden flex items-center px-inputXPadding py-1 transition-[box-shadow_border-color_background] duration-200"
    :class="[
      {
        'border-danger-600': (internalError || error) && variant === 'base',
        'focus-within:border-primary-600  border-input':
          !internalError && !error && variant === 'base',
        [`rounded-${rounded}`]: true,
        'bg-white': !disabled && variant === 'base',
        'bg-inputDisabled cursor-not-allowed': disabled,
        'bg-transparent border border-solid border-transparent hover:border-input focus-within:bg-white focus-within:!border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200':
          variant === 'text' || variant === 'title',
        '!h-12 ': variant === 'title',
      },
    ]"
    @click="($refs.internalRef as HTMLInputElement)?.focus?.()"
  >
    <div v-if="$slots.start">
      <slot name="start" />
    </div>
    <input
      class="mousetrap flex-1 min-h-input h-input outline-none focus:outline-none border-none disabled:cursor-not-allowed w-full bg-inherit"
      @blur="onBlur"
      :class="{
        'appearance-none': appearanceNone === true,
        'typo-title4  font-normal': variant === 'text',
        ' typo-title2': variant === 'title',
        [inputClass]: true,
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
      class="ml-1 flex w-fit items-center"
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
import type { IconName, Size, Typo } from "../types";
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
  // hide arrows input number
  appearanceNone?: boolean;
  rounded?: Size | "full";

  inputClass?: any;

  variant?: "text" | "title" | "base";
};

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  rounded: "sm",
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

function onBlur($event: Event) {
  validate();
  emit("blur", $event);
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
  cursor: inherit;
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
