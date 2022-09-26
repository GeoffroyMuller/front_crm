import lodash from "lodash";
import type { Rule } from "../helpers/rules";

declare module "vue" {
  interface ComponentCustomProperties {
    $rules: { [key: string]: (...args: any) => Rule };
    $_: lodash;
  }
}
