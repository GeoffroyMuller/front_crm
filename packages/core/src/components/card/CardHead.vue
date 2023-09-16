<template>
  <CardContent class="!py-3 flex justify-between items-center">
    <div>
      <div v-if="title" class="typo-title3 typo-bold">
        {{ title }}
      </div>
      <div class="typo-title7 mt-1" v-if="subtitle">
        {{ subtitle }}
      </div>
    </div>

    <div>
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
