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
