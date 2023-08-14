<template>
  <div class="flex gap-4 w-fit">
    <RouterLink
      v-for="(item, index) in items"
      :key="item.label"
      :to="item.to"
      class="decoration-transparent"
    >
      <Text
        class="flex gap-4 w-fit hover:text-primary-600 decoration-transparent"
        typo="title2"
      >
        {{ item.label }}
        <div
          v-if="index !== items.length - 1"
          class="transform rotate-45 border-solid border-gray-500 border"
        />
      </Text>
    </RouterLink>
  </div>
</template>
<script lang="ts" setup>
import Text from "./Text.vue";
import type { RouteLocationRaw } from "vue-router";

interface BreadcrumbProps {
  items: { label: string; to: RouteLocationRaw }[];
}

defineProps<BreadcrumbProps>();
</script>
