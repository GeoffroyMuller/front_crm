<template>
  <div class="page-tabs" ref="tabRef">
    <div
      v-for="tab of tabs"
      tabindex="0"
      @keyup.enter="handleClickTab(tab)"
      :key="tab.id"
      class="page-tab"
      :class="{ selected: tab.id == _currentTab }"
      @click="handleClickTab(tab)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import useTabs, { type Tab } from "../composables/tabs";

interface PageTabsProps {
  tabs: Array<Tab>;
  currentTab?: Tab["id"];
}

const props = withDefaults(defineProps<PageTabsProps>(), {});
const emit = defineEmits(["update:currentTab"]);

const tabRef = ref<HTMLElement>();

const { handleClickTab, currentTab: _currentTab } = useTabs({
  tabRef: tabRef as Ref<HTMLElement>,
  tabs: props.tabs,
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
  @apply flex items-center gap-4 select-none relative w-fit;
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
    @include typo(button);
    padding-bottom: 14px;
    font-weight: bold;
    text-align: center;
    position: relative;
    cursor: pointer;
    @apply px-[1px];
    &:hover:not(.selected) {
      opacity: 0.8;
    }
    &.selected {
      @apply text-primary-500;
    }
  }
}
</style>
