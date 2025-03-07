import Default from "./layouts/Default.vue";
import LayoutPage from "./layouts/LayoutPage.vue";
import Layout404 from "./layouts/404Layout.vue";

import auth from "./middleware/auth";

import Home from "./pages/Home.vue";
import Settings from "./pages/settings/index.vue";
import Events from "./pages/events/index.vue";
import MyAccount from "./pages/MyAccount.vue";

export default [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/events",
    name: "events",
    component: Events,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/account",
    name: "account",
    component: MyAccount,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/Login.vue"),
    meta: {
      layout: Default,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("./pages/404.vue"),
    meta: {
      layout: Layout404,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/Register.vue"),
    meta: {
      layout: Default,
    },
  },
];
