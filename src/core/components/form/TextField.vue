<template>
  <div
    @click="($refs.internalRef as HTMLInputElement).focus()"
    class="text-field"
    :class="{
      'w-full': fullWidth,
      error: internalError || error,
    }"
  >
    <label v-if="label">
      {{ label }}
    </label>
    <div class="relative">
      <input
        @blur="validate"
        v-bind="$props"
        ref="internalRef"
        v-model="internalValue"
      />
      <div v-if="icon" class="icon-hook">
        <Icon :name="icon" />
      </div>
    </div>
    <div v-if="internalError || error" class="input-error">
      {{ internalError || error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import useValidatable from "../../helpers/vue/composables/validatable";
import { defineEmits, defineProps, withDefaults, watch } from "vue";
import type { FormInputProps, IconName } from "../types";
import type { Rules } from "@/core/helpers/rules";
import Icon from "../Icon.vue";

interface InputProps extends FormInputProps<string | number> {
  fullWidth?: boolean;
  icon?: IconName;
  /*
  TODO : this is a duplicate of props in FormInputProps<string | number>
        need to found why extends do not work proprely
  */
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: Rules;
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
  rules: props.rules,
});
</script>

<style lang="scss" scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  .relative {
    position: relative;
  }
  .icon-hook {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: grid;
    place-items: center;
    margin-right: spacing(1);
  }
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
