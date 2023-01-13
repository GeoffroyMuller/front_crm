<template>
  <component
    :is="'div'"
    class="grid"
    ref="grid"
    :class="{
      [`grid-col-${columns}`]: columns,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

export type GridColumnsOptions =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export interface GridProps {
  columns?: GridColumnsOptions;
  gap?: number;
}

const grid = ref();

watch(
  () => grid.value && props.gap,
  () => {
    if (grid.value) {
      grid.value.style.setProperty("--grid-gap", props.gap);
    }
  },
  { immediate: true }
);

const props = withDefaults(defineProps<GridProps>(), {});
</script>

<style lang="scss">
.grid {
  display: grid;
  gap: calc(spacing(1) * var(--grid-gap));
}

@for $value from 1 through 12 {
  .grid-col-#{$value} {
    grid-template-columns: repeat($value, minmax(0, 1fr));
  }
}
</style>
