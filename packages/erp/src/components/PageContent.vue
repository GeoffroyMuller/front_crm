<template>
  <div
    class="flex flex-col gap-2 w-full"
    :class="[
      {
        'p-4': padding === 'light',
        'py-4 padding-large': padding === 'large',
      },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
export type PageContentProps = {
  padding?: null | "light" | "large";
};
defineProps<PageContentProps>();
</script>

<style lang="scss">
.page-content {
  &.padding-large {
    $pageContentPLargeWidth: 1300px;
    padding-left: max(calc((100% - $pageContentPLargeWidth) / 2), 16px);
    padding-right: max(calc((100% - $pageContentPLargeWidth) / 2), 16px);
  }
}
</style>
