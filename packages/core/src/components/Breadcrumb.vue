<template>
  <div class="flex gap-2 w-fit items-center">
    <Text
      class="flex gap-2 items-center w-fit decoration-transparent"
      typo="title6"
      v-for="(item, index) in items"
      :key="item.label"
    >
      <RouterLink
        class="inline-block decoration-transparent flex items-center gap-1 text-gray-400 hover:text-primary-400"
        :to="item.to"
      >
        <Icon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
      </RouterLink>
      <span class="select-none" v-if="index !== items.length - 1">{{ ">" }}</span>
    </Text>
  </div>
</template>
<script lang="ts" setup>
import Text from "./Text.vue";
import type { RouteLocationRaw } from "vue-router";
import type { IconName } from "./types";
import Icon from "./Icon.vue";

export type BreadcrumbProps = {
  items: { label: string; to: RouteLocationRaw; icon?: IconName }[];
}

defineProps<BreadcrumbProps>();
</script>
