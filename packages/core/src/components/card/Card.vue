<template>
  <div class="bg-white shadow-[0_1px_3px_0_rgb(0_0_0/0.07)]" :class="{

    'px-8 py-5': padding,
    'rounded-sm': rounded === 'sm',
    'rounded-md': rounded === 'md',
    'rounded-lg': rounded === 'lg',
    'rounded-xl': rounded === 'xl',

  }">
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
  rounded: 'md'
});


provide<CardProvide>("card", {
  padding: props.padding,
});
</script>