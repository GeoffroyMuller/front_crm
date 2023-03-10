<template>
  <div
    class="card"
    :class="[`card-rd-${rounded}`, { padding: withPadding }, $props.class]"
  >
    <div
      class="card-head"
      v-if="
        title?.length || subtitle?.length || $slots.title || $slots.subtitle
      "
    >
      <div v-if="title?.length || $slots.title" class="typo-title">
        {{ title }}
        <slot name="title" />
      </div>
      <div v-if="subtitle?.length || $slots.subtitle" class="typo-subtitle">
        {{ subtitle }}
        <slot name="subtitle" />
      </div>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import type { Size } from "./types";

export interface CardProps {
  rounded?: Size;
  title?: string;
  subtitle?: string;
  withPadding?: boolean;
  class?: string;
  actionOnTop?: boolean;
}

const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
  withPadding: true,
});
</script>

<style lang="scss">
.card {
  overflow: hidden;
  background-color: color("white");
  color: color("black");
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07);

  .card-head {
    margin-bottom: spacing(3.5);
  }
}

.padding {
  padding-left: spacing(2);
  padding-right: spacing(2);
  padding-top: spacing(1.5);
  padding-bottom: spacing(1.5);
}

@each $key, $value in $rounded {
  .card-rd-#{$key} {
    border-radius: map-get($rounded, $key);
  }
}
</style>
