import type { Plugin } from "vue";
import * as yup from "yup";

const yupPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$yup = yup;
  },
};

export default yupPlugin;
