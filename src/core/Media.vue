<template>
  <component
    :is="component"
    class="media"
    :class="{
      [`up-${up}`]: !!up,
      [`down-${down}`]: !!down && !up,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Breakpoints } from "./components/types";

export interface MediaProps<T = any> {
  component?: "div" | "span";
  up?: Breakpoints;
  down?: Breakpoints;
}

const props = withDefaults(defineProps<MediaProps>(), {
  component: "div",
});
</script>

<style lang="scss" scoped>
.media {
  width: 100%;
}
@each $key, $value in $grid-breakpoints {
  @include media-down($key) {
    .up-#{$key} {
      display: none;
    }
    .down-#{$key} {
      display: initial;
    }
  }
  @include media-up($key) {
    .up-#{$key} {
      display: initial;
    }
    .down-#{$key} {
      display: none;
    }
  }
}
</style>
