import type { LoDashStatic } from "lodash";
import type { $breakpoints } from "./breakpoints";
import type { $utils } from "./utils";
import type * as yup from "yup";

declare module "vue" {
  interface ComponentCustomProperties {
    $_: LoDashStatic;
    $yup: typeof yup;
    $utils: $utils;
    $breakpoints: $breakpoints;
  }
}
