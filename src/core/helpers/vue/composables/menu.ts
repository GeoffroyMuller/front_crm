import { nextTick, onMounted, ref, watch, type Ref } from "vue";

export interface MenuProps {
  content: Ref;
  activator: Ref;
  placement?: "top" | "bottom" | "left" | "right";
  gap?: number;
  openOnHover?: boolean;
}

/**
 * Pour fonctionner, useMenu a besoin que "content" soit
 * au même niveau que "activator" sous une div en position relative
 */
export default function useMenu(props: MenuProps) {
  const open = ref();
  const content = ref(props.content);
  const activator = ref(props.activator);
  const placement = props.placement || "bottom";
  const openOnHover = props.openOnHover == null ? true : props.openOnHover;

  const forceDisplay = ref({
    top: false,
    left: false,
  });
  const activatorDimensions = ref({
    width: 0,
    height: 0,
  });

  function compute() {
    const contentBoundingClientRect = content.value.getBoundingClientRect();

    const contentDimensions = {
      width: content.value.offsetWidth,
      left: contentBoundingClientRect.left,
      height: content.value.offsetHeight,
      top: contentBoundingClientRect.top,
    };

    activatorDimensions.value = {
      width: activator.value.offsetWidth,
      height: activator.value.offsetHeight,
    };

    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

    if (contentDimensions.width + contentDimensions.left >= pageWidth) {
      forceDisplay.value.left = true;
    } else {
      forceDisplay.value.left = false;
    }

    if (contentDimensions.height + contentDimensions.top >= pageHeight) {
      forceDisplay.value.top = true;
    } else {
      forceDisplay.value.top = false;
    }
  }

  function setStyle() {
    const parentHeight = activator.value.offsetHeight;
    const parentWidth = activator.value.offsetWidth;

    const gap = props.gap || 0;

    const translate: { x?: string; y?: string } = {
      x: undefined,
      y: undefined,
    };
    switch (placement) {
      case "top":
        translate.y = `calc(-100% - ${gap}px)`;
        break;
      case "bottom":
        translate.y = `calc(${parentHeight}px + ${gap}px)`;
        break;
      case "left":
        translate.x = `calc(-100% - ${gap}px)`;
        break;
      case "right":
        translate.x = `calc(${parentWidth}px + ${gap}px)`;
        break;
      default:
        break;
    }
    if (forceDisplay.value.left) {
      if (placement === "bottom" || placement === "top") {
        translate.x = `calc(-100% + ${activatorDimensions.value.width}px)`;
      } else {
        translate.x = "calc(-100% - " + gap + "px)";
      }
    }
    const res = `translate(${translate.x || "0"}, ${translate.y || "0"})`;
    content.value.style.transform = res;
  }

  function resetStyle() {
    forceDisplay.value = { left: false, top: false };
    setStyle();
  }

  function init() {
    content.value.style.position = "absolute";
    content.value.style.zIndex = 99;
    activator.value.style.position = "relative";
    content.value.style.top = 0;
    hide();
  }

  onMounted(() => {
    init();
    if (openOnHover) {
      activator.value.addEventListener(
        "mouseenter",
        () => {
          open.value = true;
        },
        false
      );
      activator.value.addEventListener(
        "mouseleave",
        () => {
          open.value = false;
        },
        false
      );
    }
  });

  watch(
    () => open.value,
    () => {
      if (open.value) {
        display();
      } else {
        hide();
      }
    }
  );

  function display() {
    content.value.style.display = "unset";
    compute();
    setStyle();
    setTimeout(() => {
      content.value.style.opacity = "100";
    }, 150);
  }

  function hide() {
    content.value.style.opacity = "0";
    setTimeout(() => {
      content.value.style.display = "none";
      resetStyle();
    }, 150);
  }

  return {
    forceDisplay,
    activatorDimensions,
    compute,
    setStyle,
    display,
    hide,
    open,
  };
}
