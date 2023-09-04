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

export default function useMenuPositionRoot(props: MenuProps) {
  const open = ref();
  const placement = props.placement || "bottom";
  const alignment = props.alignment || "center";
  const openOnHover = props.openOnHover == null ? true : props.openOnHover;
  const delayOpen = props.delayOpen || 0;

  if (isRef(props.activator)) {
    onUnmounted(() => {
      destroy();
    });
  }

  const onResize = () => {
    if (!isHidden()) {
      open.value = false;
    }
  };

  window.addEventListener("resize", onResize);

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
            (e) => {
              let currentMouseTarget: any = null;
              const listener = (ev: MouseEvent) => {
                currentMouseTarget = ev.target;
              };
              window.addEventListener("mousemove", listener);
              const timeout = setTimeout(() => {
                if (
                  // @ts-ignore
                  e.target?.contains(currentMouseTarget) ||
                  // @ts-ignore
                  e.target?.isEqualNode(currentMouseTarget)
                ) {
                  open.value = true;
                }
              }, delayOpen);

              const onClick = () => {
                clearTimeout(timeout);
                window.removeEventListener("mousemove", listener);
                open.value = false;
              };
              e.target?.addEventListener("click", onClick);
              setTimeout(() => {
                window.removeEventListener("mousemove", listener);
                e.target?.removeEventListener("click", onClick);
              }, delayOpen + 1);
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
          /* elem.addEventListener(
            "click",
            () => {
              open.value = false;
            },
            false
          ); */
        } /* else {
            //TODO
            elem.addEventListener(
              "click",
              () => {
                open.value = !open.value;
              },
              false
            );
          } */
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

    console.log(
      "absolute: ",
      getPlacementAlignmentToString(props.placement, props.alignment)
    );
    switch (getPlacementAlignmentToString(placement, props.alignment)) {
      case "right":
      case "right-center":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height / 2;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ ml: props.gap });
        coord.transformTranslate = "translateY(-50%)";

        coordArrowContainer.top = "50%";
        break;
      case "left":
      case "left-center":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height / 2;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mr: props.gap });
        coord.transformTranslate = "translateY(-50%)";

        coordArrowContainer.top = "50%";
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

        coordArrowContainer.transform = "translateX(-50%)";
        coordArrowContainer.left = "50%";
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

        coordArrowContainer.transform = "translateX(-50%)";
        coordArrowContainer.left = "50%";
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
      case "top-end":
        coord.right = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap });
        coord.transformTranslate = "translateX(-100%)";

        coordArrowContainer.right = "0";
        break;
      case "top-start":
        coord.left = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap });
        coord.transformTranslate = "translateX(100%)";
        break;
      case "top-end-corner":
        coord.right = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap, ml: props.gap });
        coord.transformTranslate = "";
        break;
      case "top-start-corner":
        coord.left = 0;
        coord.top = 0;
        coord.bottom =
          dimensions.activator.bottom + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mb: props.gap, mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "bottom-end":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap });
        coord.transformTranslate = "translateX(-100%)";
        break;
      case "bottom-start":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap });
        coord.transformTranslate = "translateX(100%)";
        break;
      case "bottom-end-corner":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap, ml: props.gap });
        coord.transformTranslate = "";
        break;
      case "bottom-start-corner":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top + dimensions.activator.height;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mt: props.gap, mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "left-start":
        coord.left = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "left-end":
        coord.left = 0;
        coord.top = 0;
        coord.bottom = dimensions.activator.bottom;
        coord.right = dimensions.activator.right + dimensions.activator.width;
        _setStyleProperties({ mr: props.gap });
        coord.transformTranslate = "";
        break;
      case "right-start":
        coord.right = 0;
        coord.bottom = 0;
        coord.top = dimensions.activator.top;
        coord.left = dimensions.activator.left + dimensions.activator.width;
        _setStyleProperties({ ml: props.gap });
        coord.transformTranslate = "";
        break;
      case "right-end":
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

    if (placement != null) {
      if (placement == "right") {
        coordArrowContainer.transform =
          coordArrowContainer.transform + "translateX(-100%) rotate(270deg)";
        coordArrowContainer.left = "0";
      }
      if (placement == "left") {
        coordArrowContainer.transform =
          coordArrowContainer.transform + "translateX(100%) rotate(90deg)";
        coordArrowContainer.right = "0";
      }
      if (placement == "top") {
        coordArrowContainer.transform =
          coordArrowContainer.transform + "translateY(100%) rotate(180deg)";
        coordArrowContainer.bottom = "0";
      }
      if (placement == "bottom") {
        coordArrowContainer.transform =
          coordArrowContainer.transform + "translateY(-100%) rotate(0deg)";
        coordArrowContainer.top = "0";
      }
    }
    if (alignment != null) {
      const direction: "vertical" | "horizontal" =
        placement == "top" || placement == "bottom" ? "vertical" : "horizontal";
      if (direction == "vertical" && alignment == "end") {
        coordArrowContainer.right = "0";
      }
      if (direction == "vertical" && alignment == "start") {
        coordArrowContainer.left = "0";
      }
      if (direction == "horizontal" && alignment == "start") {
        coordArrowContainer.top = "0";
      }
      if (direction == "horizontal" && alignment == "end") {
        coordArrowContainer.bottom = "0";
      }
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
    window.removeEventListener("resize", onResize);
  }

  return {
    display,
    hide,
    open,
    destroy,
  };
}
