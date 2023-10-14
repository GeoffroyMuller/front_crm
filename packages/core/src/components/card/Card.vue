<template>
  <div
    class="shadow-card"
    :class="{
      'max-md:p-cardMobile p-card': padding,
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
      'border border-slate-200 border-solid': bordered,
      'cursor-pointer select-none': selectable,
      'hover:shadow-md': selectable && !selected,
      'bg-primary-50': selected,
      'bg-white': !selected,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, withDefaults } from "vue";
import type { Size } from "../types";

export interface CardProps {
  padding?: boolean;
  rounded: Size;
  bordered?: boolean;
  selectable?: boolean;
  selected?: boolean;
}

export type CardProvide = Pick<CardProps, "padding" | "rounded">;

const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
});

provide<CardProvide>("card", {
  padding: props.padding,
  rounded: props.rounded,
});
</script>
