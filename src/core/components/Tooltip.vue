<template>
  <div ref="tooltip" class="tooltip">
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { isNil } from "lodash";

export interface TooltipProps {
  text?: string;
  parentElement: HTMLElement;
  placement?: "top" | "bottom" | "left" | "right";
  pxGap?: number;
}
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "top",
  pxGap: 8,
});

const display = ref<boolean>(false);
const tooltip = ref();

const position = () => {
  const parentHeight = props.parentElement.offsetHeight;
  const parentWidth = props.parentElement.offsetWidth;
  switch (props.placement) {
    case "top":
      tooltip.value.style.transform = "translateY(calc(-100% - " + props.pxGap + "px))";
      break;
    case "bottom":
      tooltip.value.style.transform =
        "translateY(calc(" + parentHeight + "px + " + props.pxGap + "px))";
      break;
    case "left":
      tooltip.value.style.transform = "translateX(calc(-100% - " + props.pxGap + "px))";
      break;
    case "right":
      tooltip.value.style.transform =
        "translateX(calc(" + parentWidth + "px + " + props.pxGap + "px))";
      break;
    default:
      break;
  }
};

onMounted(() => {
  props.parentElement.addEventListener(
    "mouseenter",
    () => {
      display.value = true;
    },
    false
  );
  props.parentElement.addEventListener(
    "mouseleave",
    () => {
      display.value = false;
    },
    false
  );
  const resizeObserver = new ResizeObserver(() => position());
  resizeObserver.observe(props.parentElement);
  position();
});

watch(
  () => props.placement,
  (val) => {
    if (isNil(val)) return;

    position();
  }
);
watch(
  () => display.value,
  (val) => {
    if (val === false) {
      tooltip.value.style.opacity = "0";
      setTimeout(() => {
        tooltip.value.style.display = "none";
      }, 150);
    } else if (val === true) {
      tooltip.value.style.display = "unset";
      setTimeout(() => {
        tooltip.value.style.opacity = "100";
      }, 150);
    }
  }
);
</script>

<style lang="scss" scoped>
.tooltip {
  display: none;
  opacity: 0;
  transition: all 0.15s;
  position: absolute;
  background-color: #616161e6;
  color: white;
  width: max-content;
  border-radius: 5px;
  padding: 8px 16px;
  z-index: 99;
  & p {
    margin: 0;
  }
}
</style>
