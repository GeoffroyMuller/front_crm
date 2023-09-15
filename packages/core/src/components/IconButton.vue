<template>
  <button
    :disabled="disabled"
    class="icon-button"
    :class="`icon-button-${color} ${defaultColored ? 'default-colored' : ''}`"
    type="button"
  >
    <Icon v-bind="iconProps" />
  </button>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Icon from "./Icon.vue";
import type { IconName, Size, Color } from "./types";
interface IconButtonProps {
  name: IconName;
  color?: Color;
  sharp?: boolean;
  size?: Size;
  disabled?: boolean;
  defaultColored?: boolean;
}

const props = withDefaults(defineProps<IconButtonProps>(), {});

const iconProps = computed(() => {
  const p = { ...props };
  delete p.color;
  return p;
});
</script>
<style lang="scss">
.icon-button {
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  width: fit-content;
  height: fit-content;
  border: none;
  transition: background-color 0.15s ease;
  padding: 0;
  line-height: 0;
  color: color("black");
  &:disabled {
    cursor: not-allowed;
  }
  @include media-up(md) {
    &:hover:not(:disabled) {
      color: color("primary", 500);
    }
  }
}
@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .icon-button-#{$key} {
      &.default-colored {
        color: color($key, 500);
      }
      @include media-up(md) {
        &:hover:not(:disabled) {
          color: color($key, 600);
        }
      }
    }
  } @else {
  }
}
.icon-button-white {
  color: white;
}
</style>
