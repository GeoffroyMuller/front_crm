<template>
  <div class="card" :class="`card-rd-${rounded}`">
    <div class="card-head" v-if="title?.length || subtitle?.length">
      <div v-if="title?.length" class="title">
        {{ title }}
      </div>
      <div v-if="subtitle?.length" class="subtitle">
        {{ subtitle }}
      </div>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import type { Size } from "./types";

export interface CardProps {
  rounded: Size;
  title?: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
});
</script>

<style lang="scss">
.card {
  background-color: white;
  box-shadow: 0px 0px 5px 0px #f1f5f9;
  padding-left: spacing(2);
  padding-right: spacing(2);
  padding-top: spacing(1.5);
  padding-bottom: spacing(1.5);
  .card-head {
    margin-bottom: spacing(3.5);
  }
}
@each $key, $value in $rounded {
  .card-rd-#{$key} {
    border-radius: map-get($rounded, $key);
  }
}
</style>
