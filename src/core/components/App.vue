<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

import Default from "@/features/layouts/Default.vue";

const route = useRoute();

const layout = computed(() => {
  if (route?.meta?.layout) {
    return route.meta.layout;
  }

  return Default;
});
</script>
