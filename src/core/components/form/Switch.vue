<template>
  <div class="switch-container" @click="handleSwitch">
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
import useValidatable from "@/core/helpers/vue/composables/validatable";
import type { IconName } from "../types";
import Alert from "../Alert.vue";
import type { AnySchema } from "yup";

export interface SwitchProps {
  icon?: IconName;

  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const props = withDefaults(defineProps<SwitchProps>(), {});
const emit = defineEmits(["switch"]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

function handleSwitch() {
  if (!props.disabled) {
    internalValue.value = !internalValue.value;
    emit("switch", internalValue.value);
  }
}
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
      cursor: not-allowed;
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
