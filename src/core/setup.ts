import "./assets/style/main.scss";

import "./plugins/daysjs";
import pinia from "./plugins/pinia";
import setupRouter from "./plugins/router";
import lodashPlugin from "./plugins/lodash";
import yupPlugin from "./plugins/yup";
import { i18n } from "./plugins/i18n";

import { createApp } from "vue";
import { createWebHistory, type RouteRecordRaw } from "vue-router";

import App from "./components/App.vue";

import "./plugins//typescript";

import clickOutside from "./directives/clickOutside";
import tooltip from "./directives/tooltip";
import setupComponents from "./setupComponents";

interface SetupOptions {
  routes: Readonly<RouteRecordRaw[]>;
}

export default function setup(options: SetupOptions) {
  const app = createApp(App);

  const { routes } = options;

  const router = setupRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  });

  app.use(pinia).use(router).use(i18n).use(lodashPlugin).use(yupPlugin);

  app.directive("click-outside", clickOutside);
  app.directive("tooltip", tooltip);

  setupComponents(app);

  return {
    router,
    app,
  };
}
