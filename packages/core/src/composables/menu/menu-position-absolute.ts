import { type MenuProps, getPlacementAlignmentToString } from "../menu";
import {
  createApp,
  isRef,
  onUnmounted,
  ref,
  watch,
  type Component,
  type Ref,
  onMounted,
} from "vue";

export default function useMenuPositionAbsolute(props: MenuProps) {
  const open = ref(false);
  const container = props.container
    ? isRef(props.container)
      ? props.container
      : ref<HTMLElement>(props.container)
    : ref(document.createElement("div"));
  const activator = isRef(props.activator)
    ? props.activator
    : ref<HTMLElement>(props.activator);

  function display() {
    open.value = true;
  }

  function hide() {
    open.value = false;
  }

  watch(
    () => open.value,
    (val) => {
      setContentPosition();
      if (open.value) {
        activator.value.classList.add("open");
      } else {
        activator.value.classList.remove("open");
      }
    }
  );

  function init() {
    if (!props.activator || !props.container) return;
    activator.value.classList.add("menu");
    container.value.classList.add("menu-content");
    if (props.openOnHover) {
      activator.value.classList.add("menu-openhover");
    }
    setContentPosition();
  }

  function _getDimensions(element: HTMLElement) {
    const elemBoundingClientRect = element.getBoundingClientRect();
    return {
      width: element.offsetWidth,
      left: elemBoundingClientRect.left,
      height: element.offsetHeight,
      top: elemBoundingClientRect.top,
      bottom: window.innerHeight - elemBoundingClientRect.bottom,
      right: window.innerWidth - elemBoundingClientRect.right,
    };
  }

  function _getPossibleDisplayPosition(
    placement: MenuProps["placement"],
    alignment: MenuProps["alignment"]
  ): { placement: MenuProps["placement"]; alignment: MenuProps["alignment"] } {
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const dimensions = {
      container: _getDimensions(container.value as HTMLElement),
      activator: _getDimensions(activator.value as HTMLElement),
    };

    if (
      placement == "right" &&
      dimensions.container.width +
        dimensions.activator.left +
        dimensions.activator.width >=
        pageWidth
    ) {
      placement = "left";
    } else if (
      placement == "left" &&
      dimensions.container.width >= dimensions.activator.left
    ) {
      placement = "right";
    } else if (
      placement == "bottom" &&
      dimensions.container.height +
        dimensions.activator.top +
        dimensions.activator.height >=
        pageHeight
    ) {
      placement = "top";
    } else if (
      placement == "top" &&
      dimensions.container.height >= dimensions.activator.top
    ) {
      placement = "bottom";
    }

    return { placement, alignment };
  }

  function _getCoordContainer(
    placement: MenuProps["placement"],
    alignment: MenuProps["alignment"]
  ) {
    const coord = {
      top: "auto",
      left: "auto",
      bottom: "auto",
      right: "auto",
      transformTranslate: "",
    };
    const possiblePosition = _getPossibleDisplayPosition(placement, alignment);
    switch (
      getPlacementAlignmentToString(
        possiblePosition.placement,
        possiblePosition.alignment
      )
    ) {
      case "right":
      case "right-center":
        coord.left = "100%";
        coord.right = "auto";
        coord.top = "50%";
        coord.transformTranslate = "translateY(-50%)";
        break;
      case "left":
      case "left-center":
        coord.right = "100%";
        coord.left = "auto";
        coord.top = "50%";
        coord.transformTranslate = "translateY(-50%)";
        break;
      case "top":
      case "top-center":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "50%";
        coord.transformTranslate = "translateX(-50%)";
        break;
      case "top-end":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "100%";
        coord.right = "auto";
        coord.transformTranslate = "translateX(-100%)";
        break;
      case "top-start":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "auto";
        coord.right = "100%";
        coord.transformTranslate = "translateX(100%)";
        break;
      case "top-end-corner":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "100%";
        coord.right = "auto";
        break;
      case "top-start-corner":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "auto";
        coord.right = "100%";
        break;
      case "bottom":
      case "bottom-center":
        coord.top = "100%";
        coord.bottom = "auto";
        coord.left = "50%";
        coord.transformTranslate = "translateX(-50%)";
        break;
      case "bottom-end":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "100%";
        coord.right = "auto";
        coord.transformTranslate = "translateX(-100%)";
        break;
      case "bottom-start":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "auto";
        coord.right = "100%";
        coord.transformTranslate = "translateX(100%)";
        break;
      case "bottom-end-corner":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "100%";
        coord.right = "auto";
        break;
      case "bottom-start-corner":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "auto";
        coord.right = "100%";
        break;
      case "left-start":
        coord.right = "100%";
        coord.left = "auto";
        coord.top = "0";
        break;
      case "left-end":
        coord.right = "100%";
        coord.left = "auto";
        coord.bottom = "0";
        break;
      case "right-start":
        coord.left = "100%";
        coord.right = "auto";
        coord.top = "0";
        break;
      case "right-end":
        coord.left = "100%";
        coord.right = "auto";
        coord.bottom = "0";
        break;
      default:
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "50%";
        coord.transformTranslate = "translateX(-50%)";
        break;
    }
    return coord;
  }

  function setContentPosition() {
    if (props.fullActivatorWidth) {
      container.value.style.minWidth = "100%";
    }
    const coord = _getCoordContainer(props.placement, props.alignment);
    Object.assign(container.value.style, {
      top: coord.top,
      left: coord.left,
      right: coord.right,
      bottom: coord.bottom,
      transform: coord.transformTranslate,
    });
  }

  onMounted(() => {
    init();
  });

  return {
    display,
    hide,
    open,
  };
}
