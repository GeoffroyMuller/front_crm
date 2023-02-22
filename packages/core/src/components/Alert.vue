<template>
  <div
    class="alert"
    :class="{
      [`alert-${color}`]: color,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Color } from "./types";

interface AlertProps {
  error?: string;
  color?: Color;
}
const props = withDefaults(defineProps<AlertProps>(), {
  color: "danger",
});
</script>

<style lang="scss">
.alert {
  width: fit-content;
  max-width: 100%;
}
@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .alert-#{$key} {
      color: map-deep-get($value, 500);
    }
  }
}
</style>
