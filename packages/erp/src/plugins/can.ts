import useUserStore from "@/stores/user";
import type { Plugin } from "vue";

export type CanFunction = (...actions: string[]) => boolean;

const canPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$can = ((...actions) => {
      const userStore = useUserStore();
      if (!userStore.auth) return false;
      return actions.every((action) => {
        return userStore.auth.role.rights.includes(action);
      });
    }) as CanFunction;
  },
};

export default canPlugin;
