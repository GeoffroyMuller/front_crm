<template>
  <div
    class="flex justify-end items-center gap-4 p-3 bg-actions"
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
