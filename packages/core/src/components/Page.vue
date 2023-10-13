<template>
  <PageHead
    v-if="!hideTitleBar"
    v-bind="$props"
    v-model:current-tab="currentTab"
    :style="contentStyle"
  >
    <template #head-end v-if="sidebarWidth === 0">
      <slot name="head-end" />
    </template>
  </PageHead>
  <div v-if="loading" class="w-full h-screenMinusHeaderHeight relative">
    <Spinner
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    />
  </div>
  <PageContent
    v-if="!loading"
    :class="[
      $props.class,
      {
        'h-fullMinusPageHeadHeight': !hideTitleBar,
        'h-full': hideTitleBar,
      },
    ]"
    ref="contentRef"
    :style="contentStyle"
    class="overflow-y-auto"
    :padding="padding"
    :gap="gap"
  >
    <slot v-if="currentTab" :name="currentTab" :tab="currentTab" />
    <slot :tab="currentTab" />
  </PageContent>
  <Sidebar
    :open="sidebarOpen || false"
    @update:open="emit('update:sidebarOpen', $event)"
    v-if="$slots.sidebar"
    ref="sidebarRef"
  >
    <slot name="sidebar" />
  </Sidebar>
</template>

<script setup lang="ts">
import Spinner from "./Spinner.vue";
import PageContent, { type PageContentProps } from "./PageContent.vue";
import type { BreadcrumbProps } from "./Breadcrumb.vue";
import type { IconName } from "./types";
import type { PageTab } from "./PageTabs.vue";
import { computed, ref } from "vue";
import PageHead from "./PageHead.vue";
import Sidebar from "./sidebar/Sidebar.vue";
import { watch } from "vue";
import { SIDEBAR_ANIMATION_DURATION } from "./sidebar/sidebar.types";

const currentTab = ref();
const sidebarRef = ref();

const sidebarWidth = ref<string | 0>(0);
const contentStyle = computed(() => {
  return {
    width: `calc(100% - ${sidebarWidth.value || "0px"})`,
  };
});

export interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
  padding?: PageContentProps["padding"];
  gap?: PageContentProps["gap"];
  breadcrumb?: BreadcrumbProps["items"];
  hideTitleBar?: boolean;
  tabs?: PageTab[];
  icon?: IconName;

  sidebarOpen?: boolean;
}

const emit = defineEmits(["update:sidebarOpen"]);

const props = withDefaults(defineProps<PageProps>(), {
  padding: "light",
  gap: true,
});

watch(
  () => props.sidebarOpen,
  (val) => {
    if (val) {
      const sidebarHtmlElement = sidebarRef.value.$refs.internalRef;
      if (!sidebarHtmlElement) return;
      setTimeout(() => {
        sidebarWidth.value = getComputedStyle(sidebarHtmlElement)?.width || 0;
      }, SIDEBAR_ANIMATION_DURATION - 50);
    } else {
      sidebarWidth.value = 0;
    }
  }
);
</script>
