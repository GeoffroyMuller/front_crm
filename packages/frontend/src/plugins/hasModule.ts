import type { Plugin } from "vue";

export type HasModuleFunction = (...modules: string[]) => boolean;

export const $hasModule: HasModuleFunction = (...actions) => {
  return actions.every((action) => {
    return true;
  });
};

const hasModulePlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$hasModule = $hasModule;
  },
};

export default hasModulePlugin;
