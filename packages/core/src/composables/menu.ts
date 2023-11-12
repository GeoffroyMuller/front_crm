import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import useMenuPositionAbsolute from "./menu/menu-position-absolute";
import useMenuPositionRoot from "./menu/menu-position-root";

import type { Component, Ref } from "vue";

export interface MenuProps {
  component?: Component;
  componentProps?: any;
  activator: HTMLElement | Ref<HTMLElement>;
  container?: HTMLElement | Ref<HTMLElement>;

  // milliseconds
  delayOpen?: number;

  fullActivatorWidth?: boolean;

  placement?: "top" | "bottom" | "right" | "left";
  alignment?: "start" | "end" | "center";
  hasArrow?: boolean;
  gap?: number;
  space?: string;
  openOnHover?: boolean;
  strategy?: "root" | "absolute";
  hideOnClickActivator?: boolean;
}

export function getPlacementAlignmentToString(
  placement?: MenuProps["placement"],
  alignment?: MenuProps["alignment"]
): string | null {
  console.log({ placement, alignment });
  if (!placement) return null;
  const stringConcat = !alignment ? "" : "-" + alignment;
  return placement + stringConcat;
}

export function getDimensions(element: HTMLElement) {
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

export function getPossibleDisplayPosition(
  placement: MenuProps["placement"],
  alignment: MenuProps["alignment"],
  container: Ref,
  activator: Ref
): { placement: MenuProps["placement"]; alignment: MenuProps["alignment"] } {
  const pageHeight = window.innerHeight;
  const pageWidth = window.innerWidth;
  const dimensions = {
    container: getDimensions(container.value as HTMLElement),
    activator: getDimensions(activator.value as HTMLElement),
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

export default function useMenu(props: MenuProps) {
  if (props.strategy === "absolute") {
    return useMenuPositionAbsolute({ ...props, space: "8px" }); //TODO 8px:arrowHeight
  }
  return useMenuPositionRoot({ ...props, space: "8px" });
}
