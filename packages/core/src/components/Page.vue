<template>
  <Spinner v-if="loading" class="page-spinner" />

  <div v-else class="page-container">
    <div
      v-if="!hideTitleBar"
      class="min-h-[85px] border border-slate-200 bg-white border-solid border-l-0 border-r-0 border-t-0 px-4 flex items-center justify-between gap-6"
    >
      <div class="flex gap-5 items-center">
        <div
          v-if="icon"
          class="bg-gradient-245 from-primary-400 to-primary-300 shadow-md shadow-primary-200 rounded grid place-items-center w-12 h-12"
        >
          <Icon :name="icon" color="white" class="!text-3xl" />
        </div>
        <div
          class="grid gap-3 items-center justify-start w-fit"
          :class="{ 'transform translate-y-[9px]': tabs?.length }"
        >
          <Text
            v-if="title?.length"
            typo="title1"
            html-component="div"
            weight="bold"
          >
            {{ title }}
          </Text>

          <PageTabs
            v-if="tabs?.length"
            :tabs="tabs"
            v-model:current-tab="currentTab"
          />
        </div>
      </div>
    </div>
    <PageContent :class="$props.class" :padding="padding">
      <slot />

      <slot :name="currentTab" :tab="currentTab" />
      <slot :tab="currentTab" />
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import Spinner from "./Spinner.vue";
import PageContent, { type PageContentProps } from "./PageContent.vue";
import type { BreadcrumbProps } from "./Breadcrumb.vue";
import Text from "./Text.vue";
import Icon from "./Icon.vue";
import type { IconName } from "./types";
import PageTabs, { type PageTab } from "./PageTabs.vue";
import { ref } from "vue";

const currentTab = ref();

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
  padding?: PageContentProps["padding"];
  breadcrumb?: BreadcrumbProps["items"];
  hideTitleBar?: boolean;
  tabs?: PageTab[];
  icon?: IconName;
}

withDefaults(defineProps<PageProps>(), {
  padding: "light",
});
</script>

<style lang="scss">
.page-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%);
}

.page-container {
  overflow-y: auto;
  height: 100%;
}
</style>
