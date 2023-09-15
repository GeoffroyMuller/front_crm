<template>
  <Spinner v-if="loading" class="page-spinner" />

  <div v-else class="page-container">
    <PageContent :class="$props.class" :padding="padding">
      <slot />
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import Spinner from "core/src/components/Spinner.vue";
import PageContent, { type PageContentProps } from "./PageContent.vue";

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
  padding?: PageContentProps["padding"];
}

withDefaults(defineProps<PageProps>(), {
  padding: "light",
});
</script>

<style lang="scss">
$header_height: $layoutSideHeaderHeight;
$navWidth: $layoutSideNavWidth;
$miniNavWidth: $layoutSideMiniNavWidth;
$headerHeightMobile: $layoutSideHeaderHeightMobile;

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

.page-content {
  &.padding-light {
    padding-top: spacing(2);
    padding-bottom: spacing(2);
    padding-left: spacing(2);
    padding-right: spacing(2);
  }

  &.padding-large {
    $pageContentPLargeWidth: 1300px;
    padding-top: spacing(2);
    padding-bottom: spacing(2);

    padding-left: max(calc((100% - $pageContentPLargeWidth) / 2), spacing(2));
    padding-right: max(calc((100% - $pageContentPLargeWidth) / 2), spacing(2));
  }

  display: flex;
  flex-direction: column;
  width: 100%;
  gap: spacing(2);
}
</style>
