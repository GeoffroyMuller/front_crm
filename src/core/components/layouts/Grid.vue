<template>
  <component
    :is="component || 'div'"
    class="grid"
    ref="grid"
    :class="gridClasses"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Component } from "vue";
import type { GridColumnsOptions } from "./types";

export interface GridProps {
  columns?: GridColumnsOptions;
  gap?: number;
  component?: Component;
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

const gridClasses = computed<string[]>(() => {
  const res: string[] = [];
  if (typeof props.columns === "number") {
    res.push(`grid-col-${props.columns}`);
  } else if (typeof props.columns === "object") {
    for (const key of Object.keys(props.columns)) {
      // @ts-ignore
      res.push(`grid-${key}-col-${props.columns[key]}`);
    }
  }
  return res;
});
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
  @each $k, $v in $grid-breakpoints {
    @include media-up($k) {
      .grid-#{$k}-col-#{$value} {
        grid-template-columns: repeat($value, minmax(0, 1fr));
      }
    }
  }
}
</style>
