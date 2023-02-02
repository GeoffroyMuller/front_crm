<template>
  <span class="price-presenter" :class="{ positive, negative: !positive }">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface PricePresenterProps {
  positive: boolean;
}

const props = withDefaults(defineProps<PricePresenterProps>(), {});
</script>

<style lang="scss">
.price-presenter {
  border-radius: map-deep-get($rounded, "md");
  padding: spacing(0.5);
  color: color("white");
  &.positive {
    background-color: color("success", 500);
  }
  &.negative {
    background-color: color("danger", 500);
  }
}
</style>
