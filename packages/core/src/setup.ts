import "core/src/assets/style/main.scss";

import "./plugins/daysjs";
import pinia from "./plugins/pinia";
import setupRouter from "./plugins/router";
import lodashPlugin from "./plugins/lodash";
import yupPlugin from "./plugins/yup";
import setupI18n from "./plugins/i18n";

import { createApp } from "vue";
import { createWebHashHistory, type RouteRecordRaw } from "vue-router";

import App from "./components/App.vue";

import "./plugins/typescript";

import clickOutside from "./directives/clickOutside";
import tooltip from "./directives/tooltip";
import utilsPlugin from "./plugins/utils";
import breakpointsPlugin from "./plugins/breakpoints";

interface SetupOptions {
  routes: Readonly<RouteRecordRaw[]>;
  i18n: {
    messages: any;
    locale: string;
  };
}

export default function setup(options: SetupOptions) {
  const app = createApp(App);

  const { routes } = options;

  const router = setupRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
  });

  const i18n = setupI18n(options.i18n.messages, options.i18n.locale);

  app
    .use(pinia)
    .use(router)
    .use(i18n)
    .use(lodashPlugin)
    .use(yupPlugin)
    .use(utilsPlugin)
    .use(breakpointsPlugin);

  app.directive("click-outside", clickOutside);
  app.directive("tooltip", tooltip);

  return {
    router,
    i18n,
    app,
  };
}
