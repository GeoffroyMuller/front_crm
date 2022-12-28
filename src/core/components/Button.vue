<template>
  <button
    class="button"
    :class="variant === 'text' ? `button-text button-text-${color}` : `button-${color}`"
    :type="type"
    :disabled="disabled || loading"
  >
    <div class="content">
      <Icon :name="icon" v-if="icon" />
      <span v-if="$slots.default"> <slot /></span>
    </div>

    <Spinner size="sm" v-if="loading" :color="variant === 'text' ? color : 'white'" />
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import Spinner from "./Spinner.vue";
import type { Color, IconName } from "./types";
import Icon from "./Icon.vue";
interface ButtonProps {
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  variant?: "base" | "text";
  type?: "button" | "submit";

  icon?: IconName;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  color: "primary",
  variant: "base",
  type: "button",
});
</script>

<style lang="scss" scoped>
.button {
  padding: spacing(0.5) spacing(1);
  border: none;
  border-radius: map-deep-get($rounded, "sm");
  min-height: 33px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.15s ease;
  user-select: none;
  @include typo(text);

  .content {
    display: flex;
    align-items: center;
    gap: spacing(1);
  }

  gap: spacing(1);

  &:not(:disabled) {
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
}

.button-black,
.button-white {
  background-color: #9ca3af;
  color: white;
  &:hover {
    background-color: #6b7280;
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-#{$key} {
      background-color: map-deep-get($value, 500);
      color: white;

      &:hover:not(:disabled) {
        background-color: map-deep-get($value, 600);
      }

      &:disabled {
        background-color: map-deep-get($value, 200);
      }
    }
  }
}

.button-text {
  background-color: transparent;
  color: #6b7280;
  position: relative;
  padding: 0;
  &:hover {
    color: #4b5563;
  }
  .content {
    align-items: flex-end;
    gap: spacing(0.5);
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-text-#{$key} {
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
