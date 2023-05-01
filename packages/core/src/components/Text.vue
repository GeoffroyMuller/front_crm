<template>
  <component :is="htmlComponent" :class="`text typo-${typo}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
type TextProps = {
  typo?: "title" | "subtitle" | "text" | "text2s";
  htmlComponent?: string;
};

const props = withDefaults(defineProps<TextProps>(), {
  htmlComponent: "span",
  typo: "text",
});
</script>
