<template>
  <div
    :class="[
      `bg-${color}-500`,
      'text-white rounded-full py-px px-1 w-fit h-fit min-w-[18px] min-h-[18px] grid place-items-center',
    ]"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import type { Color } from "./types";
export type BadgeProps = {
  color?: Color;
};

withDefaults(defineProps<BadgeProps>(), {
  color: "primary",
});
</script>
