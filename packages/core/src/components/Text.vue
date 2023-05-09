<template>
  <component
    :is="htmlComponent"
    :class="`typo-${typo} ${weight ? `typo-${weight}` : ''}`"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Typo, TypoWeight } from "core/src/components/types";

type TextProps = {
  typo?: Typo;
  weight?: TypoWeight;
  htmlComponent?: string;
};

const props = withDefaults(defineProps<TextProps>(), {
  htmlComponent: "span",
  typo: "text1",
});
</script>
