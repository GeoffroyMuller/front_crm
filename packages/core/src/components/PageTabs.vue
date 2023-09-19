<template>
  <div class="page-tabs" ref="tabRef">
    <div
      v-for="tab of tabs"
      tabindex="0"
      @keyup.enter="handleClickTab(tab)"
      :key="tab.id"
      class="page-tab"
      :class="{ selected: tab.id == currentTab }"
      @click="handleClickTab(tab)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { isEqual } from "lodash";

export interface PageTab {
  id: string;
  title: string;
}

interface PageTabsProps {
  tabs: Array<PageTab>;
  currentTab?: PageTab["id"];
}

const props = withDefaults(defineProps<PageTabsProps>(), {});
const emit = defineEmits(["update:currentTab"]);

const tabRef = ref<HTMLElement>();

function handleClickTab(tab: PageTab) {
  emit("update:currentTab", tab.id);
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
.page-tabs {
  @apply flex items-center gap-4 select-none relative w-fit;
  &::before {
    content: " ";
    width: var(--tab-indicator-width, 0);
    transform: scale(1);
    height: 2.3px;
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
