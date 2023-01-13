<template>
  <div></div>
</template>
<script setup lang="ts">
import type { AlignItemsOptions, JustifyContentOptions } from "./types";

interface FlexProps {
  direction?: "row" | "column";
  alignItems?: AlignItemsOptions;
  justifyContent?: JustifyContentOptions;
  gap: number;
}

const props = withDefaults(defineProps<FlexProps>(), {});
</script>

<style lang="scss">
.flex {
  display: flex;
  gap: calc(spacing(1) * var(--grid-gap));
}
</style>
