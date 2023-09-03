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

export default function useMenu(props: MenuProps) {
  if (props.strategy === "absolute") {
    return useMenuPositionAbsolute(props);
  }
  return useMenuPositionRoot(props);
}
