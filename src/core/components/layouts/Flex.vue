<template>
  <component
    :is="component || 'div'"
    class="flex layout-component"
    :class="{
      divided,
    }"
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
import useLayoutComponent from "@/core/helpers/vue/composables/layoutComponent";
import { processSlotOutlet } from "@vue/compiler-core";
import { ref, watch, type Component } from "vue";
import type { AlignItemsOptions, JustifyContentOptions } from "./types";

interface FlexProps {
  direction?: "row" | "column";
  alignItems?: AlignItemsOptions;
  justifyContent?: JustifyContentOptions;
  component?: Component;
  divided?: boolean;

  gap?: number;

  p?: number;
  pr?: number;
  pl?: number;
  pt?: number;
  pb?: number;

  m?: number;
  mr?: number;
  ml?: number;
  mt?: number;
  mb?: number;
}

const flex = ref();

const props = withDefaults(defineProps<FlexProps>(), {});

useLayoutComponent({
  ref: flex,
  gap: props.gap,
  p: props.p,
  pr: props.pr,
  pl: props.pl,
  pt: props.pt,
  pb: props.pb,
  m: props.m,
  mr: props.mr,
  ml: props.ml,
  mt: props.mt,
  mb: props.mb,
});
</script>

<style lang="scss">
.flex {
  display: flex;
  width: 100%;
}
.divided {
  @include flex-separator();
}
</style>
