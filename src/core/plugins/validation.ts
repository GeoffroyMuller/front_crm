import type { Plugin } from "vue";
import AllRules from "../helpers/rules";

const validationPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$rules = AllRules;
  },
};

export default validationPlugin;
