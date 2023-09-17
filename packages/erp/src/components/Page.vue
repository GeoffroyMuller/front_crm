<template>
  <Spinner v-if="loading" class="page-spinner" />

  <div v-else class="page-container">
    <div
      v-if="!hideTitleBar"
      class="h-[75px] border border-slate-200 bg-white border-solid border-l-0 border-r-0 border-t-0 px-4 flex items-center gap-6"
    >
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
      <div class="h-full relative">
        <div class="absolute bottom-0 left-0">
          <!--  TODO: display page tabs here  -->
        </div>
      </div>
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

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
  padding?: PageContentProps["padding"];
  breadcrumb?: BreadcrumbProps["items"];
  hideTitleBar?: boolean;
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
