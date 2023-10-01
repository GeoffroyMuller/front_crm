<template>
  <PageHead
    v-if="!hideTitleBar"
    v-bind="$props"
    v-model:current-tab="currentTab"
  >
    <template #head-end>
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
    class="overflow-y-auto"
    :padding="padding"
    :gap="gap"
  >
    <slot v-if="currentTab" :name="currentTab" :tab="currentTab" />
    <slot :tab="currentTab" />
  </PageContent>
</template>

<script setup lang="ts">
import Spinner from "./Spinner.vue";
import PageContent, { type PageContentProps } from "./PageContent.vue";
import type { BreadcrumbProps } from "./Breadcrumb.vue";
import type { IconName } from "./types";
import type { PageTab } from "./PageTabs.vue";
import { ref } from "vue";
import PageHead from "./PageHead.vue";

const currentTab = ref();

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
}

withDefaults(defineProps<PageProps>(), {
  padding: "light",
  gap: true,
});
</script>
