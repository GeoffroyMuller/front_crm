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
  border-radius: map-deep-get($rounded, "sm");
  padding: spacing(0.5);
  color: color("white");

  &.positive {
    background: color("success", 500);
    background: linear-gradient(
      245deg,
      color("success", 500) 0%,
      color("success", 400) 100%
    );
  }

  &.negative {
    background: color("danger", 500);
    background: linear-gradient(
      245deg,
      color("danger", 500) 0%,
      color("danger", 400) 100%
    );
  }
}
</style>
