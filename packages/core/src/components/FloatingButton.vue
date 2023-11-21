<template>
  <button
    class="select-none h-[50px] w-[50px] grid place-items-center cursor-pointer rounded-full border-none p-2 fixed right-2 bottom-2 z-50 shadow-[2px_2px_3px_#999] text-white"
    :class="{
      [`bg-${color}-500 hover:bg-${color}-600 `]: !disabled && !loading,
      [`bg-${color}-200`]: (disabled || loading)
    }">


    <Spinner
      v-if="loading"
      size="1rem"
      color="white"
    />


    <Icon v-if="icon && !loading" :name="icon" />

    <slot v-if="$slots.default && !loading" />

  </button>
</template>
<script setup lang="ts">
import type { Color, IconName } from "./types";
import Icon from "./Icon.vue";
import Spinner from "./Spinner.vue";

export interface FloatingButtonProps {
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  icon?: IconName;
}

const props = withDefaults(defineProps<FloatingButtonProps>(), {
  color: "primary",
  type: "button",
});
</script>
