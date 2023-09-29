<template>
  <button
    :class="{
      'icon-btn-white': color === 'white',
    }"
    :disabled="disabled"
    type="button"
    class="icon-btn"
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
  @apply cursor-pointer select-none bg-transparent block w-fit h-fit border-none transition-all p-0 rounded-sm leading-none disabled:cursor-not-allowed relative;
}

.icon-btn::before {
  position: absolute;
  transform: translate(-4px, -4px);
  width: calc(100% + 8px);
  height: calc(100% + 8px);
}

.icon-btn:not(.icon-btn-white)::before {
  content: " ";
  @apply transition-[background-color] bg-transparent;
}
.icon-btn:not(.icon-btn-white):hover::before {
  @apply bg-slate-50 left-0 top-0 rounded-sm;
}

.icon-btn-white::before {
  content: " ";
  @apply transition-opacity opacity-0;
}
.icon-btn-white:hover::before {
  @apply bg-white opacity-10 absolute left-0 top-0 rounded-sm;
}
</style>
