import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
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

export interface MenuProps {
  component?: Component;
  componentProps?: any;
  activator: HTMLElement | Ref<HTMLElement>;
  container?: HTMLElement | Ref<HTMLElement>;

  fullActivatorWidth?: boolean;

  placement?:
    | "top"
    | "top-center"
    | "top-left"
    | "top-right"
    | "top-left-corner"
    | "top-right-corner"
    | "bottom"
    | "bottom-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-left-corner"
    | "bottom-right-corner"
    | "right"
    | "right-center"
    | "right-top"
    | "right-bottom"
    | "left"
    | "left-center"
    | "left-top"
    | "left-bottom";

  hasArrow?: boolean;
  gap?: number;
  openOnHover?: boolean;
  strategy?: "root" | "absolute";
}

const mount = (component: Component, props: any, element: HTMLElement) => {
  const el = element || document.createElement("div");
  createApp(component, props).mount(el);
  return { el };
};
function getScrollParent(element: HTMLElement) {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = /(auto|scroll)/;

  if (style.position === "fixed") return document.body;
  for (let parent = element; (parent = parent.parentElement); ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowX + style.overflowY))
      return parent;
  }

  return document.body;
}

function useMenuPositionAbsolute(props: MenuProps) {
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
    () => {
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

  function setContentPosition() {
    const coord = { top: "auto", left: "auto", bottom: "auto", right: "auto" };
    let transformTranslate = "";
    switch (props.placement) {
      case "right":
      case "right-center":
        coord.left = "100%";
        coord.right = "auto";
        coord.top = "50%";
        transformTranslate = "translateY(-50%)";
        break;
      case "left":
      case "left-center":
        coord.right = "100%";
        coord.left = "auto";
        coord.top = "50%";
        transformTranslate = "translateY(-50%)";
        break;
      case "top":
      case "top-center":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "50%";
        transformTranslate = "translateX(-50%)";
        break;
      case "top-right":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "100%";
        coord.right = "auto";
        transformTranslate = "translateX(-100%)";
        break;
      case "top-left":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "auto";
        coord.right = "100%";
        transformTranslate = "translateX(100%)";
        break;
      case "top-right-corner":
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "100%";
        coord.right = "auto";
        break;
      case "top-left-corner":
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
        transformTranslate = "translateX(-50%)";
        break;
      case "bottom-right":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "100%";
        coord.right = "auto";
        transformTranslate = "translateX(-100%)";
        break;
      case "bottom-left":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "auto";
        coord.right = "100%";
        transformTranslate = "translateX(100%)";
        break;
      case "bottom-right-corner":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "100%";
        coord.right = "auto";
        break;
      case "bottom-left-corner":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "auto";
        coord.right = "100%";
        break;
      case "left-top":
        coord.right = "100%";
        coord.left = "auto";
        coord.top = "0";
        break;
      case "left-bottom":
        coord.right = "100%";
        coord.left = "auto";
        coord.bottom = "0";
        break;
      case "right-top":
        coord.left = "100%";
        coord.right = "auto";
        coord.top = "0";
        break;
      case "right-bottom":
        coord.left = "100%";
        coord.right = "auto";
        coord.bottom = "0";
        break;
      default:
        coord.bottom = "100%";
        coord.top = "auto";
        coord.left = "50%";
        transformTranslate = "translateX(-50%)";
        break;
    }
    Object.assign(container.value.style, {
      top: coord.top,
      left: coord.left,
      right: coord.right,
      bottom: coord.bottom,
      transform: transformTranslate,
    });
    if (props.fullActivatorWidth) {
      container.value.style.minWidth = "100%";
    }
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

export default function useMenu(props: MenuProps) {
  if (props.strategy === "absolute") {
    return useMenuPositionAbsolute(props);
  }

  const open = ref();
  const placement = props.placement || "bottom";
  const openOnHover = props.openOnHover == null ? true : props.openOnHover;

  if (isRef(props.activator)) {
    onUnmounted(() => {
      destroy();
    });
  }

  window.addEventListener("resize", () => {
    if (!isHidden()) {
      open.value = false;
    }
  });

  const arrowContainerElement = document.createElement("div");
  const arrowElement = document.createElement("div");

  const container = props.container
    ? isRef(props.container)
      ? props.container
      : ref<HTMLElement>(props.container)
    : ref(document.createElement("div"));
  const activator = isRef(props.activator)
    ? props.activator
    : ref<HTMLElement>(props.activator);

  const unwatchContainer = watch(
    () => container.value,
    (elem: HTMLElement) => {
      if (elem) {
        init();
      }
    },
    { immediate: true }
  );
  const unwatchActivator = watch(
    () => activator.value,
    (elem?: HTMLElement) => {
      if (elem) {
        let scrollableParent = elem;
        while (scrollableParent != document.body) {
          scrollableParent = getScrollParent(scrollableParent);
          scrollableParent.addEventListener("scroll", () => {
            if (open.value) {
              _setStyle();
            }
          });
        }

        if (openOnHover) {
          elem.addEventListener(
            "mouseenter",
            () => {
              open.value = true;
            },
            false
          );
          elem.addEventListener(
            "mouseleave",
            () => {
              open.value = false;
            },
            false
          );
          elem.addEventListener(
            "click",
            () => {
              open.value = false;
            },
            false
          );
        }
      }
    },
    { immediate: true }
  );

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

  function _setStyleProperties({
    p,
    pt,
    pb,
    pl,
    pr,
    m,
    mt,
    mb,
    ml,
    mr,
  }: {
    [key: string]: number | undefined;
  }) {
    container.value.style.setProperty("--mt", `${mt || m || 0}`);
    container.value.style.setProperty("--mb", `${mb || m || 0}`);
    container.value.style.setProperty("--ml", `${ml || m || 0}`);
    container.value.style.setProperty("--mr", `${mr || m || 0}`);
    container.value.style.setProperty("--pt", `${pt || p || 0}`);
    container.value.style.setProperty("--pb", `${pb || p || 0}`);
    container.value.style.setProperty("--pl", `${pl || p || 0}`);
    container.value.style.setProperty("--pr", `${pr || p || 0}`);
    container.value.style.setProperty("--p", `${p || 0}`);
    container.value.style.setProperty("--m", `${m || 0}`);
  }

  function _setStyle() {
    const dimensions = {
      container: _getDimensions(container.value as HTMLElement),
      activator: _getDimensions(activator.value as HTMLElement),
    };

    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

    const coord = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      transformTranslate: "",
    };
    const coordArrowContainer = {
      top: "auto",
      left: "auto",
      bottom: "auto",
      right: "auto",
      transform: "",
    };
    switch (placement) {
      case "right":
      case "right-center":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height / 2;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ ml: props.gap });
        coord.transformTranslate = "translateY(-50%)";

        coordArrowContainer.top = "50%";
        coordArrowContainer.left = "0";
        coordArrowContainer.transform = "translateY(-50%)";
        break;
      case "left":
      case "left-center":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height / 2;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mr: props.gap });
        coord.transformTranslate = "translateY(-50%)";

        break;
      case "top":
      case "top-center":
        coord.right = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width / 2;
        _setStyleProperties({ mb: props.gap });
        coord.transformTranslate = "translateX(-50%)";
        /* if (
          dimensions.container.width + dimensions.activator.left >=
          pageWidth
        ) {
          coord.left =
            dimensions.activator.left -
            dimensions.container.width +
            dimensions.activator.width;
        } else {
          coord.left = dimensions.activator.left;
        } */
        break;
      case "bottom":
      case "bottom-center":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width / 2;
        _setStyleProperties({ mt: props.gap });
        coord.transformTranslate = "translateX(-50%)";
        /* if (
          dimensions.activator.top +
            dimensions.activator.height +
            dimensions.container.height >=
          pageHeight
        ) {
          _setStyleProperties({ mb: props.gap });
          coord.top = dimensions.activator.top - dimensions.activator.height;
        } else {
          _setStyleProperties({ mt: props.gap });
          coord.top = dimensions.activator.top + dimensions.activator.height;
        }
        if (
          dimensions.container.width + dimensions.activator.left >=
          pageWidth
        ) {
          coord.left =
            dimensions.activator.left -
            dimensions.container.width +
            dimensions.activator.width;
        } else {
          coord.left = dimensions.activator.left;
        }
 */
        break;
      case "top-right":
        coord.right = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap });
        coord.transformTranslate = "translateX(-100%)";
        break;
      case "top-left":
        coord.left = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap });
        coord.transformTranslate = "translateX(100%)";
        break;
      case "top-right-corner":
        coord.right = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap, ml: props.gap });
        coord.transformTranslate = "";
        break;
      case "top-left-corner":
        coord.left = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap, mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "bottom-right":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap });
        coord.transformTranslate = "translateX(-100%)";
        break;
      case "bottom-left":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap });
        coord.transformTranslate = "translateX(100%)";
        break;
      case "bottom-right-corner":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap, ml: props.gap });
        coord.transformTranslate = "";
        break;
      case "bottom-left-corner":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap, mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "left-top":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "left-bottom":
        coord.left = 0;
        coord.top = 0;
        coord.bottom = dimensions.activator.bottom;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "right-top":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ ml: props.gap });
        coord.transformTranslate = "";
        break;
      case "right-bottom":
        coord.right = 0;
        coord.top = 0;
        coord.bottom = dimensions.activator.bottom;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ ml: props.gap });
        coord.transformTranslate = "";
        break;
      default:
        break;
    }

    Object.assign(container.value.style, {
      top: coord.top === 0 ? "auto" : coord.top + "px",
      left: coord.left === 0 ? "auto" : coord.left + "px",
      bottom: coord.bottom === 0 ? "auto" : coord.bottom + "px",
      right: coord.right === 0 ? "auto" : coord.right + "px",
      transform: coord.transformTranslate,
    });

    if (props.hasArrow === true) {
      Object.assign(arrowContainerElement.style, {
        top: coordArrowContainer.top,
        left: coordArrowContainer.left,
        bottom: coordArrowContainer.bottom,
        right: coordArrowContainer.right,
        transform: coordArrowContainer.transform,
      });
    }

    if (props.fullActivatorWidth) {
      container.value.style.minWidth = `${dimensions.activator.width}px`;
    }
  }

  function _resetStyle() {
    _setStyle();
  }

  function init() {
    container.value.classList.add("layout-component");
    container.value.style.position = "absolute";
    container.value.style.zIndex = "27";
    if (!props.container) {
      document.body.appendChild(container.value);
    }
    container.value.style.opacity = "0";
    container.value.style.display = "none";
    container.value.onclick = (e) => {
      open.value = false;
      e.stopPropagation();
    };
    if (!props.container) {
      mount(
        props.component as Component,
        props.componentProps || {},
        container.value
      );
    }
    if (props.hasArrow === true) {
      arrowContainerElement.classList.add("menu-arrow-container");
      arrowElement.classList.add("menu-arrow");
      arrowContainerElement.appendChild(arrowElement);
      container.value.appendChild(arrowContainerElement);
      console.error(container.value);
    }
  }

  const unwatchOpen = watch(
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
    container.value.style.display = "unset";
    _setStyle();
    container.value.style.opacity = "100";
  }

  function hide() {
    container.value.style.opacity = "0";
    container.value.style.display = "none";
    _resetStyle();
  }
  const isHidden = () => container.value?.style?.opacity == "0";

  function destroy() {
    unwatchActivator();
    unwatchOpen();
    unwatchContainer();
    if (!props.container) {
      container.value.remove();
    }
  }

  return {
    display,
    hide,
    open,
    destroy,
  };
}
