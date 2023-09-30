<template>
  <button
    :class="{
      /*'before:!bg-danger-50': color === 'danger',
      'before:!bg-primary-50': color === 'primary',
      'before:!bg-success-50': color === 'success',
      'before:!bg-warning-50': color === 'warning',*/

      'hover:bg-slate-50': !color || color === 'black',
      'hover:bg-danger-50': color === 'danger',
      'hover:bg-primary-50': color === 'primary',
      'hover:bg-success-50': color === 'success',
      'hover:bg-warning-50': color === 'warning',

      'before:!bg-slate-50': !color || color === 'black',
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
  line-height: 0;
  @apply cursor-pointer select-none bg-transparent block w-fit h-fit border-none transition-all rounded-sm disabled:cursor-not-allowed relative p-iconButtonPadding;
}

.icon-btn-white::before {
  content: " ";
  @apply transition-opacity opacity-0;
  position: absolute;
  width: 100%;
  height: 100%;
}

.icon-btn-white:hover::before {
  @apply bg-white opacity-10 absolute left-0 top-0 rounded-sm;
}
</style>
