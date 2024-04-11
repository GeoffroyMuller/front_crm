import type { AppModule } from "core/src/types";

import authMiddleware from "@/middleware/auth";

import LayoutPage from "@/layouts/LayoutPage.vue";
import Layout404 from "@/layouts/404Layout.vue";
import LayoutDefault from "core/src/layouts/LayoutDefault.vue";

const baseModule: AppModule = {
  name: "base",
  routes: {
    path: "/",
    component: () => import("./index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("./pages/Home.vue"),
        meta: {
          layout: LayoutPage,
        },
      },
      {
        path: "/login",
        name: "login",
        component: () => import("./pages/Login.vue"),
        meta: {
          layout: LayoutDefault,
        },
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("./pages/404.vue"),
        meta: {
          layout: Layout404,
        },
      },
    ],
  },
};

export default baseModule;
