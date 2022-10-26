<template>
  <button class="icon-button" type="button">
    <Icon v-bind="$props" />
  </button>
</template>
<script setup lang="ts">
import Icon from "./Icon.vue";
import type { IconName, Size, Color } from "./types";
interface IconButtonProps {
  name: IconName;
  color?: Color;
  outlined?: boolean;
  size?: Size;
}

const props = withDefaults(defineProps<IconButtonProps>(), {});
</script>
<style lang="scss">
.icon-button {
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  width: fit-content;
  height: fit-content;
  border: none;
  transition: background-color 0.15s ease;
  padding: 0;
  &:hover {
    color: color("primary", 500);
  }
}
</style>
