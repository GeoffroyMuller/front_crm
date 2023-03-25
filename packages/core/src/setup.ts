import "./assets/style/main.scss";

import "./plugins/daysjs";
import pinia from "./plugins/pinia";
import setupRouter from "./plugins/router";
import lodashPlugin from "./plugins/lodash";
import yupPlugin from "./plugins/yup";
import setupI18n from "./plugins/i18n";
import { setupAxios } from "./plugins/axios";
import type { AxiosDefaults } from "axios";

import { createApp, type App as VueApp } from "vue";
import { createWebHashHistory, type RouteRecordRaw } from "vue-router";

import App from "./components/App.vue";

import "./plugins/typescript";

import clickOutside from "./directives/clickOutside";
import tooltip from "./directives/tooltip";
import utilsPlugin from "./plugins/utils";
import breakpointsPlugin from "./plugins/breakpoints";

interface SetupOptions {
  routes: Readonly<RouteRecordRaw[]>;
  i18n?: {
    messages: any;
    locale: string;
  };
  axios?: Partial<AxiosDefaults>;
  app?: VueApp;
}

export function setupPlugins(options: SetupOptions) {
  const { routes } = options;

  const router = setupRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
  });

  const i18n = setupI18n(options.i18n?.messages || {}, options.i18n?.locale);

  if (options.axios) {
    setupAxios(options.axios);
  }

  return {
    router,
    i18n,
    pinia,
    lodashPlugin,
    yupPlugin,
    utilsPlugin,
    breakpointsPlugin,
  };
}

export function setupPluginsArray(options: SetupOptions) {
  return Object.values(setupPlugins(options));
}

export default function setup(options: SetupOptions) {
  const app = options.app || createApp(App);

  const {
    router,
    i18n,
    pinia,
    lodashPlugin,
    yupPlugin,
    utilsPlugin,
    breakpointsPlugin,
  } = setupPlugins(options);

  app
    .use(router)
    .use(i18n)
    .use(pinia)
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
