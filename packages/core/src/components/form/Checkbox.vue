<template>
  <div class="checkbox-container" @click="handleSwitch">
    <label>
      {{ label }}
    </label>
    <div class="checkbox" tabindex="0" @keyup.enter="handleSwitch">
      <input
        class="mousetrap"
        tabindex="-1"
        type="checkbox"
        :checked="!!internalValue"
      />
      <span class="checkmark"></span>
    </div>
    <!-- <div
      class="switch"
      :class="{
        selected: !!internalValue,
        error: internalError || error,
        disabled: disabled,
      }"
    >
      <div class="switch-inner" />
    </div> -->
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

export interface CheckboxProps {
  icon?: IconName;
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const props = withDefaults(defineProps<CheckboxProps>(), {});

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

function handleSwitch() {
  if (!props.disabled) {
    internalValue.value = !internalValue.value;
  }
}
</script>

<style lang="scss">
.checkbox-container {
  cursor: pointer;
  label {
    cursor: pointer;
    @include typo(label);
  }
  .checkbox {
    $size: 18px;
    height: $size;
    width: $size;
    position: relative;
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }
    .checkmark {
      border-radius: map-deep-get($rounded, "sm");
      position: absolute;
      top: 0;
      left: 0;
      height: $size;
      width: $size;
      background: color("white");
      border: 1px solid #d1d5db;
    }
    /* When the checkbox is checked, add a blue background */
    input:checked ~ .checkmark {
      background: color("primary", 500);
      background: linear-gradient(
        245deg,
        color("primary", 500) 0%,
        color("primary", 400) 100%
      );
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    /* Show the checkmark when checked */
    input:checked ~ .checkmark:after {
      display: block;
    }

    /* Style the checkmark/indicator */
    .checkmark:after {
      left: 6px;
      top: 3px;
      width: 3px;
      height: 6px;
      border: solid white;
      border-width: 0 1px 1px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}
</style>
