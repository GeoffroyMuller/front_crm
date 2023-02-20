import type { LoDashStatic } from "lodash";
import type { $breakpoints } from "./breakpoints";
import type { $utils } from "./utils";

declare module "vue" {
  interface ComponentCustomProperties {
    $_: LoDashStatic;
    $yup: any;
    $utils: $utils;
    $breakpoints: $breakpoints;
  }
}
