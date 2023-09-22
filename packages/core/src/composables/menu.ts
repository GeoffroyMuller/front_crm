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

export default function useMenu(props: MenuProps) {
  if (props.strategy === "absolute") {
    return useMenuPositionAbsolute(props);
  }
  return useMenuPositionRoot(props);
}
