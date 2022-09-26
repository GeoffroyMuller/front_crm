<template>
  <div
    @click="($refs.internalRef as HTMLInputElement).focus()"
    class="text-field"
    :class="{
      'w-full': fullWidth,
      error: internalError,
    }"
  >
    <label v-if="label">
      {{ label }}
    </label>
    <input
      @blur="validate"
      v-bind="$props"
      ref="internalRef"
      v-model="internalValue"
    />
    <div v-if="internalError" class="input-error">
      {{ internalError }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import useValidatable from "../../helpers/vue/composables/validatable";
import { defineEmits, defineProps, withDefaults, watch } from "vue";
import type { FormInputProps } from "../types";

interface InputProps extends FormInputProps<string | number> {
  fullWidth?: boolean;

  /*
  TODO : this is a duplicate of props in FormInputProps<string | number>
        need to found why extends do not work proprely
  */
  label?: string;
  modelValue?: string | number;
  readonly?: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  fullWidth: true,
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
});
</script>

<style lang="scss" scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  input {
    background-color: white;
    border-radius: map-get($rounded, "sm");
    display: block;
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    width: 100%;
    height: 35px;

    transition: border-color 0.5s, box-shadow 0.5s;

    &:focus {
      outline: none;
      border-color: color("primary", 500);
      box-shadow: 0 0 5pt 0.5pt color("primary", 200);
    }
  }

  &.error {
    input {
      outline: none;
      border-color: color("danger", 500);
      box-shadow: 0 0 5pt 0.5pt color("danger", 200);
    }
  }
}
.input-error {
  color: color("danger", 500);
}
</style>
