<template>
  <div
    class="bg-white shadow-card"
    :class="{
      'p-card': padding,
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
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
}

export type CardProvide = Pick<CardProps, "padding">;

const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
});

provide<CardProvide>("card", {
  padding: props.padding,
});
</script>
