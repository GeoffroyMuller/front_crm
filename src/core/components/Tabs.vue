<template>
  <div class="tabs">
    <div
      v-for="tab of tabs"
      :key="tab.id"
      class="tab"
      :class="{ selected: tab.id == currentTab }"
      @click="currentTab = tab.id"
    >
      {{ tab.title }}
    </div>
  </div>
  <slot :name="currentTab" :tab="currentTab" />
  <slot :tab="currentTab" />
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface Tab {
  id: string;
  title: string;
}

interface TabsProps {
  tabs: Array<Tab>;
}

const props = withDefaults(defineProps<TabsProps>(), {});

const currentTab = ref(props.tabs?.[0]?.id);
</script>

<style lang="scss">
.tabs {
  display: flex;
  align-items: center;
  gap: spacing(1);
  cursor: pointer;
  user-select: none;
  margin-bottom: spacing(2);
  .tab {
    border-radius: map-deep-get($rounded, "sm");
    padding: spacing(1) spacing(1);
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;

    &.selected {
      background-color: color("primary", 500);
      color: white;
    }
  }
}
</style>
