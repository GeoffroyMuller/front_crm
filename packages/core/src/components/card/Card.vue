<template>
  <div class="bg-white" :class="{
    'rounded-sm': rounded === 'sm',
    'rounded-md': rounded === 'md',
    'rounded-lg': rounded === 'lg',
    'rounded-xl': rounded === 'xl',

    'px-8 py-5': padding,
  }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, withDefaults } from "vue";
import type { Size } from "../types";

export interface CardProps {
  rounded?: Size;
  padding?: boolean;
}

export type CardProvide = Pick<CardProps, "padding">;


const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
});


provide<CardProvide>("card", {
  padding: props.padding,
});
</script>