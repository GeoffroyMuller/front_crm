<template>
  <div
    class="h-px b border-t border-transparent border-dashed border-t-slate-400"
    :class="{ '-mx-cardMobile md:-mx-card my-6 relative': card?.padding }"
  />
</template>

<script setup lang="ts">
import { inject } from "vue";
import type { CardProvide } from "./Card.vue";

const card = inject<CardProvide>("card");
</script>
