import Home from "./pages/Home.vue";
import Quotes from "./pages/quotes/index.vue";
import Customers from "./pages/clients/index.vue";
import EditQuote from "./pages/quotes/EditQuote.vue";
import Login from "./pages/Login.vue";

import Default from "./layouts/Default.vue";
import LayoutPage from "./layouts/LayoutPage.vue";

import auth from "./middleware/auth";

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
    path: "/quotes",
    name: "quotes",
    component: Quotes,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/quotes/:id",
    name: "quotes-id",
    component: EditQuote,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/customers",
    name: "customers",
    component: Customers,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
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
