<template>
  <component
    :is="component || 'div'"
    class="flex"
    ref="flex"
    :style="{
      justifyContent,
      alignItems,
      flexDirection: direction,
    }"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
import { ref, watch, type Component } from "vue";
import type { AlignItemsOptions, JustifyContentOptions } from "./types";

interface FlexProps {
  direction?: "row" | "column";
  alignItems?: AlignItemsOptions;
  justifyContent?: JustifyContentOptions;
  component?: Component;
  gap?: number;
}

const flex = ref();

watch(
  () => flex.value && props.gap,
  () => {
    if (flex.value) {
      flex.value.style.setProperty("--flex-gap", props.gap);
    }
  },
  { immediate: true }
);

const props = withDefaults(defineProps<FlexProps>(), {});
</script>

<style lang="scss">
.flex {
  display: flex;
  width: 100%;
  gap: calc(spacing(1) * var(--flex-gap));
}
</style>
