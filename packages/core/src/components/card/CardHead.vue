<template>
  <CardContent class="!pb-3 !pt-5 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <div v-if="$slots.start">
        <slot name="start" />
      </div>
      <div>
        <div v-if="title" class="typo-title3 typo-bold">
          {{ title }}
        </div>
        <div class="typo-title7 mt-1" v-if="subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>

    <div v-if="$slots.end">
      <slot name="end" />
    </div>
  </CardContent>
</template>

<script setup lang="ts">
import CardContent from "./CardContent.vue";

export interface CardHeadProps {
  title?: string;
  subtitle?: string;
}

withDefaults(defineProps<CardHeadProps>(), {});
</script>
