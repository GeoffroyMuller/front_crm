<template>
  <div
    class="flex justify-end items-center gap-4 p-3 bg-actions border border-t-slate-200 border-solid border-b-0 border-l-0 border-r-0"
    :class="{
      'rounded-b-sm': card?.rounded === 'sm',
      'rounded-b-md': card?.rounded === 'md',
      'rounded-b-lg': card?.rounded === 'lg',
      'rounded-b-xl': card?.rounded === 'xl',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import type { CardProvide } from "./Card.vue";

const card = inject<CardProvide>("card");
</script>
