<template>
  <button :disabled="disabled" type="button" class="icon-btn">
    <Icon
      v-bind="iconProps"
      :color="defaultColored || color === 'white' ? color : undefined"
      class="relative"
      :class="[`hover:text-${color || 'primary'}-500`]"
    />
  </button>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Icon from "./Icon.vue";
import type { IconName, Size, Color } from "./types";
interface IconButtonProps {
  name: IconName;
  color?: Color;
  sharp?: boolean;
  size?: Size;
  disabled?: boolean;
  defaultColored?: boolean;
}

const props = withDefaults(defineProps<IconButtonProps>(), {});

const iconProps = computed(() => {
  const p = { ...props };
  delete p.color;
  return p;
});
</script>

<style>
.icon-btn {
  @apply cursor-pointer select-none bg-transparent block w-fit h-fit border-none transition-all p-0 leading-none disabled:cursor-not-allowed relative;
}
/* .icon-btn::before {
  content: " ";
  @apply absolute -top-[25%] -left-[25%] w-[150%] h-[150%] aspect-square rounded-full -z-10  bg-black opacity-0 transition-all duration-150;
}
.icon-btn:hover::before {
  content: " ";
  @apply opacity-[2%];
} */
</style>
