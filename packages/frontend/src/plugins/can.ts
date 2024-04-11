import type { Plugin } from "vue";

export type CanFunction = (...actions: string[]) => boolean;

export const $can: CanFunction = (...actions) => {
  return true;
};

const canPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$can = $can;
  },
};

export default canPlugin;
