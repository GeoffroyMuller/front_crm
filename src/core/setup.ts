import "./assets/style/main.scss";

import "./plugins/daysjs";
import pinia from "./plugins/pinia";
import Unicon from "./plugins/unicon";
import setupRouter from "./plugins/router";

import { createApp } from "vue";
import { createWebHistory, type RouteRecordRaw } from "vue-router";

import App from "./components/App.vue";

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

  app.use(pinia).use(router).use(Unicon);

  return {
    router,
    app,
  };
}
