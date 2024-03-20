import type { LoDashStatic } from "lodash";
import type { $breakpoints } from "./breakpoints";
import type { Utils } from "../helpers/utils";
import type * as yup from "yup";

declare module "vue" {
  interface ComponentCustomProperties {
    $_: LoDashStatic;
    $yup: typeof yup;
    $utils: Utils;
    $breakpoints: $breakpoints;
  }
}
