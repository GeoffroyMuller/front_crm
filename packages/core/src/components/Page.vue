<template>
  <PageHead
    v-if="!hideTitleBar && pageHeadFixed"
    v-bind="$props"
    v-model:current-tab="currentTab"
  />
  <div v-if="loading" class="w-full h-screenMinusHeaderHeight relative">
    <Spinner
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    />
  </div>
  <div
    v-if="!loading"
    :class="{
      'h-[calc(100%-85px)]': !hideTitleBar && pageHeadFixed,
      'h-full': hideTitleBar || !pageHeadFixed,
    }"
    class="overflow-y-auto"
  >
    <PageHead
      v-if="!hideTitleBar && !pageHeadFixed"
      v-bind="$props"
      v-model:current-tab="currentTab"
    />
    <PageContent :class="$props.class" :padding="padding">
      <slot v-if="currentTab" :name="currentTab" :tab="currentTab" />
      <slot :tab="currentTab" />
    </PageContent>
  </div>
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
  breadcrumb?: BreadcrumbProps["items"];
  hideTitleBar?: boolean;
  tabs?: PageTab[];
  icon?: IconName;
  pageHeadFixed?: boolean;
}

withDefaults(defineProps<PageProps>(), {
  padding: "light",
});
</script>
