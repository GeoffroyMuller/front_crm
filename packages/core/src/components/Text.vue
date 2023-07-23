<template>
  <component
    :is="htmlComponent"
    :class="`typo-${typo} ${weight ? `typo-${weight}` : ''} ${
      color ? `text-${color}-500` : ''
    }`"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Typo, TypoWeight, Color } from "core/src/components/types";

type TextProps = {
  typo?: Typo;
  weight?: TypoWeight;
  htmlComponent?: string;
  color?: Color;
};

const props = withDefaults(defineProps<TextProps>(), {
  htmlComponent: "span",
  typo: "text1",
});
</script>
