import type { Plugin } from "vue";
import lodash from "lodash";

const lodashPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$_ = lodash;
  },
};

export default lodashPlugin;
