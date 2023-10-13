<template>
  <div
    class="flex flex-col w-full"
    ref="internalRef"
    :class="[
      {
        'px-contentX max-md:px-contentXMobile py-content': padding === 'light',
        'py-content max-md:!px-contentXMobile padding-large':
          padding === 'large',
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
  $pageContentPaddingX: 1.5rem;
  padding-left: max(
    calc((100% - $pageContentPLargeWidth) / 2),
    $pageContentPaddingX
  );
  padding-right: max(
    calc((100% - $pageContentPLargeWidth) / 2),
    $pageContentPaddingX
  );
}
</style>
