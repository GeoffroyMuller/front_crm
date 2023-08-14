<template>
  <div class="max-w-full flex items-center gap-2" :class="`text-${color}-500`">
    <Icon :name="icon" size="sm" :class="`text-${color}-400`" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Color, IconName } from "./types";
import Icon from "./Icon.vue";

interface AlertProps {
  error?: string;
  color?: Color;
}
const props = withDefaults(defineProps<AlertProps>(), {
  color: "danger",
});
const icon = computed<IconName>(() => {
  switch (props.color) {
    case "success":
      return "check";
    case "danger":
      return "dangerous";
    case "warning":
      return "warning";
    default:
      return "info";
  }
});

const color = computed<Color>(() => {
  switch (props.color) {
    case "success":
      return "success";
    case "danger":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "primary";
  }
});
</script>
