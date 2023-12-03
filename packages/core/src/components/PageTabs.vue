<template>
  <div class="page-tabs" ref="tabRef">
    <div
      v-for="tab of tabsVisible"
      tabindex="0"
      @keyup.enter="handleClickTab(tab.id)"
      :key="tab.id"
      class="page-tab typo-button"
      :class="{ selected: tab.id == _currentTab }"
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
      class="mb-4"
    >
      <Button variant="text" color="black">
        <span>+{{ nbTabsHidden }}</span>
        <Icon name="more_horiz" />
      </Button>
    </ActionMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import useTabs, { type Tab } from "../composables/tabs";
import ActionMenu from "./ActionMenu.vue";
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import { toRef } from "vue";

interface PageTabsProps {
  tabs: Array<Tab>;
  currentTab?: Tab["id"];
  defaultTab?: Tab["id"];
}

const props = withDefaults(defineProps<PageTabsProps>(), {});
const emit = defineEmits(["update:currentTab"]);

const tabRef = ref<HTMLElement>();

const {
  handleClickTab,
  currentTab: _currentTab,
  tabsHidden,
  tabsVisible,
  nbTabsHidden,
} = useTabs({
  tabRef: tabRef as Ref<HTMLElement>,
  tabs: toRef(props, "tabs"),
  defaultTab: props.defaultTab,
});

watch(
  () => _currentTab.value,
  (tab) => {
    emit("update:currentTab", tab);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
.page-tabs {
  @apply flex items-center gap-4 select-none relative;
  &::before {
    content: " ";
    width: var(--tab-indicator-width, 0);
    transform: scale(1);
    height: 2px;
    position: absolute;
    @apply bg-primary-500 bottom-0;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    left: var(--tab-indicator-left, 0);
    transition: width 0.25s ease-in-out, left 0.25s ease-in-out;
  }
  .page-tab {
    font-weight: bold;
    text-align: center;
    position: relative;
    cursor: pointer;
    @apply px-[1px] w-max whitespace-nowrap mb-3;
    &:hover:not(.selected) {
      opacity: 0.8;
    }
    &.selected {
      @apply text-primary-500;
    }
  }
}
</style>
