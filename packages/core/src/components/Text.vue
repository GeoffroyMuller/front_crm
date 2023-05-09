<template>
  <component :is="htmlComponent" :class="`typo-${typo}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Typo } from "core/src/components/types";

type TextProps = {
  typo?: Typo;
  htmlComponent?: string;
};

const props = withDefaults(defineProps<TextProps>(), {
  htmlComponent: "span",
  typo: "text1",
});
</script>
