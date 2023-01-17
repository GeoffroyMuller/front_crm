<template>
  <component
    :is="component || 'div'"
    class="flex"
    ref="flex"
    :style="{
      justifyContent: justifyContent,
    }"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
import type { Component } from "vue";
import type { AlignItemsOptions, JustifyContentOptions } from "./types";

interface FlexProps {
  direction?: "row" | "column";
  alignItems?: AlignItemsOptions;
  justifyContent?: JustifyContentOptions;
  component?: Component;
  gap: number;
}

const props = withDefaults(defineProps<FlexProps>(), {});
</script>

<style lang="scss">
.flex {
  display: flex;
  gap: calc(spacing(1) * var(--flex-gap));
}
</style>
