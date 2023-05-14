<template>
  <div
    class="card"
    :class="[
      `card-rd-${rounded}`,
      { padding: withPadding && !noPadding },
      $props.class,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import type { Size } from "./types";

export interface CardProps {
  rounded?: Size;
  title?: string;
  subtitle?: string;
  // @deprecated : use noPadding instead
  withPadding?: boolean;
  noPadding?: boolean;
  class?: string;
  actionOnTop?: boolean;
}

const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
  withPadding: true,
});
</script>

<style lang="scss">
.card {
  background-color: color("white");
  color: color("black");
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07);
}

.padding {
  padding: spacing(3) spacing(4);
}

@each $key, $value in $rounded {
  .card-rd-#{$key} {
    border-radius: map-get($rounded, $key);
  }
}
</style>
