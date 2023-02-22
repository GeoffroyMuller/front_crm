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
import { ref, watch } from "vue";
import { isEqual } from "lodash";

export interface Tab {
  id: string;
  title: string;
}

interface TabsProps {
  tabs: Array<Tab>;
}

const props = withDefaults(defineProps<TabsProps>(), {});

const currentTab = ref(props.tabs?.[0]?.id);

watch(
  () => props.tabs,
  (val, oldVal) => {
    if (!isEqual(val, oldVal)) {
      currentTab.value = val?.[0]?.id;
    }
  }
);
</script>

<style lang="scss">
.tabs {
  display: flex;
  align-items: center;
  gap: spacing(2);
  user-select: none;
  margin-bottom: spacing(2);
  .tab {
    border-radius: map-deep-get($rounded, "sm");
    padding-bottom: spacing(1);
    text-align: center;
    position: relative;
    cursor: pointer;
    &::before {
      content: " ";
      width: 100%;
      transform: scale(0);
      height: 1px;
      position: absolute;
      bottom: 0;
      background-color: color("primary", 400);
      box-shadow: 0 0 5pt 0.1pt color("primary", 200);
      left: 0;
      transition: transform 0.25s ease-in-out;
      border-radius: 1px;
    }
    &.selected,
    &:hover {
      &::before {
        transform: scale(1);
      }
    }
  }
}
</style>
