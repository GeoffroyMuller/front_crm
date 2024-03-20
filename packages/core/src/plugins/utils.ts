import dayjs from "dayjs";
import { utils } from "../helpers/utils";
import type { Plugin } from "vue";

const utilsPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$utils = utils;
  },
};

export default utilsPlugin;
