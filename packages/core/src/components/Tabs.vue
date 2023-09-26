<template>
  <div class="w-full">
    <div class="tabs" ref="tabRef">
      <div
        v-for="tab of tabs"
        tabindex="0"
        @keyup.enter="handleClickTab(tab)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import useTabs, { type Tab } from "../composables/tabs";

const tabRef = ref<HTMLElement>();

interface TabsProps {
  tabs: Array<Tab>;
}

const props = withDefaults(defineProps<TabsProps>(), {});

const { handleClickTab, currentTab } = useTabs({
  tabRef: tabRef as Ref<HTMLElement>,
  tabs: props.tabs,
});
</script>

<style lang="scss">
.tabs {
  @apply flex items-center gap-4 mb-content select-none relative w-fit;

  &::before {
    content: " ";
    width: var(--tab-indicator-width, 0);
    transform: scale(1);
    height: 1.5px;
    position: absolute;
    bottom: 0;

    @apply bg-primary-500;
    left: var(--tab-indicator-left, 0);
    transition: width 0.25s ease-in-out, left 0.25s ease-in-out;
    border-radius: 4px;
  }

  .tab {
    @include typo(button);
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
      @apply text-primary-500;
    }
  }
}
</style>
