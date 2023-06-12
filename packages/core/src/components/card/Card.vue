<template>
    <div
        class="bg-white"
        :class="{
            'rounded-sm': rounded === 'sm',
            'rounded-md': rounded === 'md',
            'rounded-lg': rounded === 'lg',
            'rounded-xl': rounded === 'xl',

            'px-8': padding,
        }"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import type { Size } from "../types";

export interface CardProps {
  rounded?: Size;
  padding?: boolean;
}

withDefaults(defineProps<CardProps>(), {
  rounded: "md",
});
</script>