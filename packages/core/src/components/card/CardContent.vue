<template>
  <div :class="{ 'p-card': !card?.padding }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import type { CardProvide } from "./Card.vue";

const card = inject<CardProvide>("card");
</script>
