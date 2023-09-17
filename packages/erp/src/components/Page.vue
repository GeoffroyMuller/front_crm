<template>
  <Spinner v-if="loading" class="page-spinner" />

  <div v-else class="page-container">
    <div
      v-if="!hideTitleBar"
      class="h-[85px] border border-slate-200 bg-white border-solid border-l-0 border-r-0 border-t-0 px-4 flex items-center gap-6"
    >
      <div class="flex gap-5 items-center">
        <div
          v-if="icon"
          class="bg-gradient-245 from-primary-400 to-primary-300 shadow-md shadow-primary-200 rounded grid place-items-center w-12 h-12"
        >
          <Icon :name="icon" color="white" class="!text-3xl" />
        </div>
        <div class="grid gap-2 items-center justify-start w-fit">
          <Text
            v-if="title?.length"
            typo="title1"
            html-component="div"
            weight="bold"
          >
            {{ title }}
          </Text>
          <Breadcrumb v-if="breadcrumb?.length" :items="breadcrumb" />
        </div>
      </div>
      <!-- <div class="h-full relative" v-if="tabs">
        <div class="absolute bottom-0 left-0">
          <Tabs :tabs="tabs"> </Tabs>
        </div>
      </div> -->
    </div>
    <PageContent :class="$props.class" :padding="padding">
      <slot />
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import Spinner from "core/src/components/Spinner.vue";
import PageContent, { type PageContentProps } from "./PageContent.vue";
import Breadcrumb, {
  type BreadcrumbProps,
} from "core/src/components/Breadcrumb.vue";
import Text from "core/src/components/Text.vue";
import Tabs, { type Tab } from "core/src/components/Tabs.vue";
import Icon from "core/src/components/Icon.vue";
import type { IconName } from "core/src/components/types";

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
  padding?: PageContentProps["padding"];
  breadcrumb?: BreadcrumbProps["items"];
  hideTitleBar?: boolean;
  tabs?: Tab[];
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
