import {
  computed,
  createApp,
  isRef,
  onMounted,
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

export default function useMenu(props: MenuProps) {
  const open = ref();
  const placement = props.placement || "bottom";
  const openOnHover = props.openOnHover == null ? true : props.openOnHover;

  const container = document.createElement("div");
  const activator = isRef(props.activator)
    ? props.activator
    : ref<HTMLElement>(props.activator);

  watch(
    () => activator.value,
    (elem?: HTMLElement) => {
      if (elem) {
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
    document.body.appendChild(container);
    container.style.opacity = "0";
    container.style.display = "none";
    mount(props.component, props.componentProps || {}, container);
  }

  init();

  watch(
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
  watch(
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

  return {
    display,
    hide,
    open,
  };
}
