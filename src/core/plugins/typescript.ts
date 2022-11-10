import lodash from "lodash";

declare module "vue" {
  interface ComponentCustomProperties {
    $_: lodash;
    $yup: any;
  }
}
