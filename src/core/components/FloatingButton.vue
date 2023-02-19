<template>
  <button
    class="float-button"
    :class="{
      [`float-button-${color}`]: true,
    }"
  >
    <Icon v-if="icon" :name="icon" />
    <div v-if="$slots.default">
      <slot />
    </div>
  </button>
</template>
<script setup lang="ts">
import type { Color, IconName } from "./types";
import Icon from "./Icon.vue";

export interface FloatingButtonProps {
  color?: Color;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: IconName;
}

const props = withDefaults(defineProps<FloatingButtonProps>(), {
  color: "primary",
  type: "button",
});
</script>

<style lang="scss">
.float-button {
  user-select: none;
  padding: spacing(1);
  position: fixed;
  right: spacing(1);
  bottom: spacing(1);
  border: none;
  min-width: spacing(6.5);
  min-height: spacing(6.5);
  border-radius: spacing(3.25);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 3px #999;
  cursor: pointer;
}

.float-button-black,
.float-button-white {
  background-color: #9ca3af;
  color: white;
  &:hover {
    background-color: #6b7280;
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .float-button-#{$key} {
      background-color: color($key, 500);
      color: white;

      &:hover:not(:disabled) {
        background-color: map-deep-get($value, 600);
      }

      &:disabled {
        background-color: map-deep-get($value, 200);
      }
    }
  } @else {
  }
}
</style>
