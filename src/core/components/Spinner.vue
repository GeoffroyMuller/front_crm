<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="width"
    viewBox="0 0 38 38"
    :class="`spinner spinner-${color}`"
  >
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)" stroke-width="2">
        <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { withDefaults, computed } from "vue";
import type { Color } from "./types";

interface SpinnerProps {
  color?: Color;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  color: "primary",
  size: "md",
});

const width = computed(() => {
  switch (props.size) {
    case "sm":
      return 16;
    case "md":
      return 32;
    case "lg":
      return 48;
    default:
      return 32;
  }
});
</script>

<style lang="scss" scoped>
.spinner {
  stroke: black;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .spinner-#{$key} {
      stroke: map-deep-get($value, 500);
    }
  } @else {
    .spinner-#{$key} {
      stroke: $value;
    }
  }
}
</style>
