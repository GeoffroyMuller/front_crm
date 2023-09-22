<template>
  <div
    class="flex flex-col w-full"
    :class="[
      {
        'px-contentX py-content': padding === 'light',
        'py-content padding-large': padding === 'large',
        'gap-content': gap,
      },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
export type PageContentProps = {
  padding?: null | "light" | "large";
  gap?: boolean;
};
defineProps<PageContentProps>();
</script>

<style lang="scss" scoped>
.padding-large {
  $pageContentPLargeWidth: 1300px;
  padding-left: max(calc((100% - $pageContentPLargeWidth) / 2), 16px);
  padding-right: max(calc((100% - $pageContentPLargeWidth) / 2), 16px);
}
</style>
