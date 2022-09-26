<template>
  <button
    class="button"
    :class="
      variant === 'text'
        ? `button-text button-text-${color}`
        : `button-${color}`
    "
    :type="type"
    :disabled="disabled || loading"
  >
    <slot />

    <Spinner
      size="sm"
      v-show="loading"
      :color="variant === 'text' ? color : 'white'"
    />
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import Spinner from "./Spinner.vue";
import type { Color } from "./types";

interface ButtonProps {
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  variant?: "base" | "text";
  type?: "button" | "submit";
}

const props = withDefaults(defineProps<ButtonProps>(), {
  color: "primary",
  variant: "base",
  type: "button",
});
</script>

<style lang="scss" scoped>
.button {
  padding: 4px 8px;
  border: none;
  border-radius: map-deep-get($rounded, "sm");
  min-height: 35px;
  color: white;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  &:not(:disabled) {
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-#{$key} {
      background-color: map-deep-get($value, 500);

      &:hover:not(:disabled) {
        background-color: map-deep-get($value, 700);
      }

      &:disabled {
        background-color: map-deep-get($value, 200);
      }
    }
  }
}

.button-text {
  background-color: transparent;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-text-#{$key} {
      color: transparent;

      color: map-deep-get($value, 500);

      &:hover:not(:disabled) {
        color: map-deep-get($value, 700);
      }

      &:disabled {
        color: map-deep-get($value, 200);
      }
    }
  }
}
</style>
