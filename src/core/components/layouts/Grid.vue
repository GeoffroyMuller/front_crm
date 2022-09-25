<template>
  <div
    :class="`grid grid-cols-${columns} grid-rows-${rows} column-gap-${
      columnGap || gap
    } row-gap-${rowGap || gap}`"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

export type GridNumber =
  | 0
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
  | 12
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export type GapNumber = 0.5 | 1.5 | 2.5 | 3.5 | 4.5 | 5.5 | GridNumber;

export interface GridProps {
  columns?: GridNumber;
  rows?: GridNumber;
  gap?: GapNumber;
  rowGap?: GapNumber;
  columnGap?: GapNumber;
}

const props = withDefaults(defineProps<GridProps>(), {
  columns: 0,
  rows: 0,
  gap: 0,
  rowGap: 0,
  columnGap: 0,
});
</script>

<style lang="scss">
.grid {
  display: grid;
}

@each $value in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12) {
  .grid-cols-#{$value} {
    grid-template-columns: repeat($value, minmax(0, 1fr));
  }
  .grid-rows-#{$value} {
    grid-template-rows: repeat($value, minmax(0, 1fr));
  }
  .row-gap-#{$value} {
    row-gap: spacing($value);
  }
  .column-gap-#{$value} {
    column-gap: spacing($value);
  }
}
</style>
/* @each $value in (0.5, 1.5, 2.5, 3.5, 4.5, 5.5) { .row-gap-#{$value} { row-gap:
spacing($value); } .column-gap-#{$value} { column-gap: spacing($value); } } */
