<template>
  <component
    :is="component || 'div'"
    class="grid layout-component"
    ref="grid"
    :class="gridClasses"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import useLayoutComponent from "core/src/helpers/vue/composables/layoutComponent";
import { computed, ref, type Component } from "vue";
import type { GridColumnsOptions } from "./types";

export interface GridProps {
  columns?: GridColumnsOptions;
  component?: Component;

  gap?: number;
  p?: number;
  pr?: number;
  pl?: number;
  pt?: number;
  pb?: number;

  m?: number;
  mr?: number;
  ml?: number;
  mt?: number;
  mb?: number;

  mx?: number;
  my?: number;
  px?: number;
  py?: number;
}

const grid = ref();

const props = withDefaults(defineProps<GridProps>(), {});

useLayoutComponent({
  ref: grid,
  gap: props.gap,
  p: props.p,
  pr: props.pr,
  pl: props.pl,
  pt: props.pt,
  pb: props.pb,
  m: props.m,
  mr: props.mr,
  ml: props.ml,
  mt: props.mt,
  mb: props.mb,
  mx: props.mx,
  my: props.my,
  px: props.px,
  py: props.py,
  
});

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
  width: 100%;
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
