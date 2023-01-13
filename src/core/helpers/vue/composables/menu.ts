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
  component: Component;
  componentProps?: any;
  activator: HTMLElement | Ref<HTMLElement>;
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

  const container = document.createElement("div");
  const activator = isRef(props.activator)
    ? props.activator
    : ref<HTMLElement>(props.activator);

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
      container: _getDimensions(container),
      activator: _getDimensions(activator.value as HTMLElement),
    };

    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

    const coord = { left: 0, top: 0 };

    switch (placement) {
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
    Object.assign(container.style, {
      top: coord.top + "px",
      left: coord.left + "px",
    });
  }

  function _resetStyle() {
    _setStyle();
  }

  function init() {
    container.style.position = "absolute";
    container.style.zIndex = "6";
    document.body.appendChild(container);
    container.style.opacity = "0";
    container.style.display = "none";
    container.onclick = (e) => e.stopPropagation();
    mount(props.component, props.componentProps || {}, container);
  }

  init();

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
    container.style.display = "unset";
    _setStyle();
    container.style.opacity = "100";
  }

  function hide() {
    container.style.opacity = "0";
    container.style.display = "none";
    _resetStyle();
  }

  function destroy() {
    unwatchActivator();
    unwatchDisabled();
    unwatchOpen();
    container.remove();
  }

  return {
    display,
    hide,
    open,
    destroy,
  };
}
