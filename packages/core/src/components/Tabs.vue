<template>
  <div class="">
    <div class="tabs" ref="tabRef">
      <div
        v-for="tab of tabsVisible"
        tabindex="0"
        @keyup.enter="handleClickTab(tab.id)"
        :key="tab.id"
        class="tab typo-button"
        :class="{ selected: tab.id == currentTab }"
        @click="handleClickTab(tab.id)"
      >
        {{ tab.title }}
      </div>
      <ActionMenu
        v-if="nbTabsHidden"
        :actions="
          tabsHidden.map((tab) => ({
            title: tab.title,
            action: () => {
              handleClickTab(tab.id);
            },
          }))
        "
        placement="bottom"
        alignment="start"
        class="transform -translate-y-[4px]"
      >
        <Button variant="text" color="black">
          <span>+{{ nbTabsHidden }}</span>
          <Icon name="more_horiz" />
        </Button>
      </ActionMenu>
    </div>
    <slot :name="currentTab" :tab="currentTab" />
    <slot :tab="currentTab" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import useTabs, { type Tab } from "../composables/tabs";
import ActionMenu from "./ActionMenu.vue";
import Button from "./Button.vue";
import Icon from "./Icon.vue";

const tabRef = ref<HTMLElement>();

interface TabsProps {
  tabs: Array<Tab>;
}

const props = withDefaults(defineProps<TabsProps>(), {});

const { handleClickTab, currentTab, tabsHidden, tabsVisible, nbTabsHidden } =
  useTabs({
    tabRef: tabRef as Ref<HTMLElement>,
    tabs: props.tabs,
  });
</script>

<style lang="scss">
.tabs {
  @apply flex items-center gap-4 mb-content select-none relative;

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
    font-weight: bold;
    border-radius: map-deep-get($rounded, "sm");
    @apply pb-2;
    text-align: center;
    position: relative;
    cursor: pointer;
    @apply whitespace-nowrap;
    &:hover:not(.selected) {
      opacity: 0.8;
    }

    &.selected {
      @apply text-primary-500;
    }
  }
}
</style>
