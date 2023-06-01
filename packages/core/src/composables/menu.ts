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
        break;
      case "top-left":
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
        break;
      case "bottom-left":
        coord.bottom = "auto";
        coord.top = "100%";
        coord.left = "auto";
        coord.right = "100%";
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

    const coord = { left: 0, top: 0 };

    switch (placement) {
      case "right":
        coord.top = dimensions.activator.top;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ ml: props.gap });
        break;
      case "left":
        coord.top = dimensions.activator.top;
        coord.left = dimensions.activator.left - dimensions.container.width;
        // todo: this do not have effect...
        _setStyleProperties({ mr: props.gap });
        break;
      case "top":
        coord.top = dimensions.activator.top - dimensions.activator.height;
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
        break;
      case "bottom":
        if (
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

        break;
      default:
        break;
    }

    Object.assign(container.value.style, {
      top: coord.top + "px",
      left: coord.left + "px",
    });
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
