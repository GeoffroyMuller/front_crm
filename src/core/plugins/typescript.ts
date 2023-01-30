import lodash from "lodash";
import type { $utils } from "./utils";

declare module "vue" {
  interface ComponentCustomProperties {
    $_: lodash;
    $yup: any;
    $utils: $utils;
  }
}
