<template>
  <div class="switch-container" @click="handleSwitch">
    <label>
      {{ label }}
    </label>
    <div class="switch" :class="{
    selected: !!internalValue,
    error: internalError || error,
    disabled: disabled,
  }">
      <div class="switch-inner" />
    </div>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import useValidatable from "../../composables/validatable";
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
  }

  .switch {
    border-radius: 10px;
    border: solid 1px #d1d5db;
    width: $width;
    height: $height;
    position: relative;

    box-shadow: inset 0px 0px 0.9px rgba(0, 0, 0, 0.12),
      inset 0px 0px 2px rgba(0, 0, 0, 0.18);

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
      @apply bg-primary-50;

      .switch-inner {
        margin-left: calc($width - $dotSize - 2 * $dotMargin);
        @apply bg-primary-500;
        background: linear-gradient(245deg,
            color("primary", 500) 0%,
            color("primary", 400) 100%);
      }
    }

    &.error:not(.disabled) {
      border: solid 1px color("danger", 500);
      background: color("danger", 50);

      .switch-inner {
        background: color("danger", 500);
        background: linear-gradient(245deg,
            color("danger", 500) 0%,
            color("danger", 400) 100%);
      }
    }

    &:not(.selected):active {
      .switch-inner {
        width: calc($dotSize + 4px);
      }
    }

    .switch-inner {
      transition: width 0.5s ease, margin-left 0.5s ease;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: $dotMargin;
      border-radius: 50%;
      background-color: rgb(168, 168, 168);
      box-shadow: 0px 0px 0.9px rgba(0, 0, 0, 0.32),
        0px 0px 2px rgba(0, 0, 0, 0.28);
      width: $dotSize;
      height: $dotSize;
    }
  }
}
</style>
