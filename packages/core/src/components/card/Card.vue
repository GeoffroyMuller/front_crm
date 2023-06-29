<template>
  <div class="bg-white shadow-[0_1px_3px_0_rgb(0_0_0/0.07)] rounded-md" :class="{

    'px-8 py-5': padding,
  }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, withDefaults } from "vue";

export interface CardProps {
  padding?: boolean;
}

export type CardProvide = Pick<CardProps, "padding">;


const props = withDefaults(defineProps<CardProps>(), {});


provide<CardProvide>("card", {
  padding: props.padding,
});
</script>