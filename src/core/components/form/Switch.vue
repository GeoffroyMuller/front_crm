<template>
  <div class="switch-container" @click="internalValue = !internalValue">
    <label>
      {{ label }}
    </label>
    <div
      class="switch"
      :class="{
        selected: !!internalValue,
        error: internalError || error,
        disabled: disabled,
      }"
    >
      <div class="switch-inner" />
    </div>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import type { Rules } from "@/core/helpers/rules";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import type { FormInputProps, IconName } from "../types";
import Alert from "../Alert.vue";

interface SwitchProps extends FormInputProps<string | number> {
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

const props = withDefaults(defineProps<SwitchProps>(), {});

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});
</script>

<style lang="scss">
.switch-container {
  $width: spacing(5);
  $dotSize: spacing(2);
  $dotMargin: spacing(0.2);
  $height: spacing(2.5);
  width: fit-content;
  @include grid(1, 0, 1);
  overflow: hidden;

  cursor: pointer;
  label {
    cursor: pointer;
    @include typo(text2);
  }
  .switch {
    border-radius: 10px;
    border: solid 1px #d1d5db;
    width: $width;
    height: $height;
    position: relative;

    &.disabled {
      background-color: #d1d5db;
      &.selected {
        .switch-inner {
          margin-left: calc($width - $dotSize - 2 * $dotMargin);
        }
      }
    }
    &.selected:not(.disabled) {
      background-color: color("primary", 50);
      .switch-inner {
        margin-left: calc($width - $dotSize - 2 * $dotMargin);
        background-color: color("primary", 500);
      }
    }
    &.error:not(.disabled) {
      border: solid 1px color("danger", 500);
      background-color: color("danger", 50);
      .switch-inner {
        background-color: color("danger", 500);
      }
    }
    .switch-inner {
      transition: margin-left 0.5s ease;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: $dotMargin;
      border-radius: 50%;
      background-color: rgb(168, 168, 168);
      width: $dotSize;
      height: $dotSize;
    }
  }
}
</style>
