<template>
  <div class="tabs" ref="tabRef">
    <div
      v-for="tab of tabs"
      :key="tab.id"
      class="tab"
      :class="{ selected: tab.id == currentTab }"
      @click="handleClickTab(tab)"
    >
      {{ tab.title }}
    </div>
  </div>
  <slot :name="currentTab" :tab="currentTab" />
  <slot :tab="currentTab" />
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { isEqual } from "lodash";

export interface Tab {
  id: string;
  title: string;
}

interface TabsProps {
  tabs: Array<Tab>;
}

const props = withDefaults(defineProps<TabsProps>(), {});

const tabRef = ref<HTMLElement>();
const currentTab = ref();

function handleClickTab(tab: Tab) {
  currentTab.value = tab.id;
  nextTick(() => {
    if (!tabRef.value) return;
    const selected = tabRef.value.querySelector(".selected");
    if (!selected) return;
    const selectedBounds = selected.getBoundingClientRect();
    const selectedLeft = selectedBounds.left;
    const tabsLeft = tabRef.value.getBoundingClientRect().left;
    if (tabsLeft && selectedLeft) {
      tabRef.value.style.setProperty(
        "--tab-indicator-left",
        `${selectedLeft - tabsLeft}px`
      );
      tabRef.value.style.setProperty(
        "--tab-indicator-width",
        `${selectedBounds.width}px`
      );
    }
  });
}

watch(
  () => props.tabs,
  (val, oldVal) => {
    if (!isEqual(val, oldVal)) {
      handleClickTab(val?.[0]);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.tabs {
  display: flex;
  align-items: center;
  gap: spacing(2);
  user-select: none;
  margin-bottom: spacing(2);
  position: relative;
  width: fit-content;
  &::before {
    content: " ";
    width: var(--tab-indicator-width, 0);
    transform: scale(1);
    height: 1.5px;
    position: absolute;
    bottom: 0;
    background-color: color("primary", 500);
    left: var(--tab-indicator-left, 0);
    transition: width 0.25s ease-in-out, left 0.25s ease-in-out;
    border-radius: 1px;
  }
  .tab {
    @include typo(text);
    font-weight: bold;
    border-radius: map-deep-get($rounded, "sm");
    padding-bottom: spacing(1);
    text-align: center;
    position: relative;
    cursor: pointer;
    &:hover:not(.selected) {
      opacity: 0.8;
    }
    &.selected {
      color: color("primary", 500);
    }
  }
}
</style>
