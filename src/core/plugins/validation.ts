import type { Plugin } from "vue";
import AllRules from "../helpers/rules";
import type { Rule } from "../helpers/rules";

declare module "vue" {
  interface ComponentCustomProperties {
    $rules: { [key: string]: (...args: any) => Rule };
  }
}

const validationPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$rules = AllRules;
  },
};

export default validationPlugin;
