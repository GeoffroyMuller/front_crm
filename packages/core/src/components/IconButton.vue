<template>
  <button
    :class="{
      [`hover:bg-${color}-50`]: color && color !== 'white' && color !== 'black',
      'hover:bg-slate-50': !color || color === 'black',
      'icon-btn-white': color === 'white',
    }"
    :disabled="disabled"
    type="button"
    class="icon-btn transition-[background-color]"
  >
    <Icon
      v-bind="iconProps"
      :color="defaultColored || color === 'white' ? color : undefined"
      class="relative"
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
  @apply cursor-pointer select-none bg-transparent block w-fit h-fit border-none transition-all p-1 rounded-sm leading-none disabled:cursor-not-allowed relative;
}

.icon-btn-white::before {
  @apply transition-opacity opacity-0;
}
.icon-btn-white:hover::before {
  content: " ";
  @apply bg-white opacity-10 absolute w-full h-full left-0 top-0;
}
</style>
