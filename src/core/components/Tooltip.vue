<template>
  <div ref="tooltip" class="tooltip">
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface TooltipProps {
  text?: string;
  placement?: "top" | "bottom" | "left" | "right";
  pxGap?: number;
}
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "top",
  pxGap: 8,
});

const tooltip = ref();
/* 
useMenu({
  activator: ref(props.parentElement),
  content: tooltip,
  gap: props.pxGap,
  placement: props.placement,
}); */
</script>

<style lang="scss" scoped>
.tooltip {
  background-color: #616161e6;
  color: white;
  width: max-content;
  border-radius: 5px;
  padding: 8px 16px;
  z-index: 1000;
  & p {
    margin: 0;
  }
}
</style>
