<template>
  <span
    class="icon"
    :class="`icon-${dark ? 'dark-' : light ? 'light-' : ''}${color}`"
  >
    <unicon v-bind="$props" />
  </span>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from "vue";
import type { Color } from "./types";

interface IconProps {
  name: string;
  fill?: string;
  color?: Color;
  dark?: boolean;
  light?: boolean;
}

const props = withDefaults(defineProps<IconProps>(), {
  color: "black",
});
</script>

<style lang="scss">
@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .icon-#{$key} {
      svg {
        fill: map-deep-get($value, 500);
      }
    }
  } @else {
    .icon-#{$key} {
      svg {
        fill: $value;
      }
    }
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .icon-light-#{$key} {
      svg {
        fill: map-deep-get($value, 200);
      }
    }
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .icon-dark-#{$key} {
      svg {
        fill: map-deep-get($value, 700);
      }
    }
  }
}
</style>
