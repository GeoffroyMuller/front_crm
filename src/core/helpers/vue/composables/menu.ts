import {
  createApp,
  isRef,
  onUnmounted,
  ref,
  watch,
  type Component,
  type Ref,
} from "vue";

export interface MenuProps {
  component?: Component;
  componentProps?: any;
  activator: HTMLElement | Ref<HTMLElement>;
  container?: HTMLElement | Ref<HTMLElement>;

  fullActivatorWidth?: boolean;

  placement?: "top" | "bottom" | "left" | "right";
  gap?: number;
  openOnHover?: boolean;
  disabled?: Ref;
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

export default function useMenu(props: MenuProps) {
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

  function _setStyle() {
    const dimensions = {
      container: _getDimensions(container.value as HTMLElement),
      activator: _getDimensions(activator.value as HTMLElement),
    };

    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

    const coord = { left: 0, top: 0 };

    switch (placement) {
      case "left":
        coord.top = dimensions.activator.top;
        coord.left = dimensions.activator.left - dimensions.container.width;
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
        coord.top = dimensions.activator.top + dimensions.activator.height;
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
    container.value.style.position = "absolute";
    container.value.style.zIndex = "6";
    if (!props.container) {
      document.body.appendChild(container.value);
    }
    container.value.style.opacity = "0";
    container.value.style.display = "none";
    container.value.onclick = (e) => e.stopPropagation();
    if (!props.container) {
      mount(
        props.component as Component,
        props.componentProps || {},
        container.value
      );
    }
  }

  const unwatchDisabled = watch(
    () => props.disabled?.value,
    () => {
      if (props.disabled?.value) {
        hide();
      } else {
        if (open.value) {
          display();
        }
      }
    }
  );
  const unwatchOpen = watch(
    () => open.value,
    () => {
      if (open.value && !props.disabled?.value) {
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
  const isHidden = () => container.value.style.opacity == "0";

  function destroy() {
    unwatchActivator();
    unwatchDisabled();
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
