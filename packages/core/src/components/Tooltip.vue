<template>
  <div ref="tooltip" class="tooltip bg-tooltip shadow-sm">
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface TooltipProps {
  text?: string;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
    | "left-center"
    | "right-center";
  alignment?: "start" | "end" | "center";
  pxGap?: number;
}
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "top",
  alignment: "start",
});

const tooltip = ref();
</script>
<style lang="scss" scoped>
.tooltip {
  @include typo(label);
  position: relative;
  color: color("white");
  width: max-content;
  border-radius: 5px;
  padding: 8px 16px;
  z-index: 1000;

  & p {
    margin: 0;
  }
}
</style>
