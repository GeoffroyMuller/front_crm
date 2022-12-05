import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";

import Default from "./layouts/Default.vue";
import Page from "./layouts/Page.vue";

import auth from "./middleware/auth";

export default [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      middleware: [auth],
      layout: Page,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      layout: Default,
    },
  },
];
