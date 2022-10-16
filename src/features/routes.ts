import auth from "@/features/middleware/auth";

import Default from "@/features/layouts/Default.vue";
import Page from "@/features/layouts/Page.vue";

import Home from "@/features/pages/Home.vue";
import Login from "@/features/pages/Login.vue";
import Customers from "@/features/pages/customers/index.vue";
import CustomerEdit from "@/features/pages/customers/Edit.vue";
import Reservations from "@/features/pages/reservations/index.vue";

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
    path: "/customers",
    name: "customers",
    component: Customers,
    meta: {
      middleware: [auth],
      layout: Page,
    },
  },
  {
    path: "/customers/new",
    name: "new-customers",
    component: CustomerEdit,
    meta: {
      middleware: [auth],
      layout: Page,
    },
  },
  {
    path: "/customers/:id",
    name: "customer-edit",
    component: CustomerEdit,
    meta: {
      middleware: [auth],
      layout: Page,
    },
  },
  {
    path: "/reservations",
    name: "reservations",
    component: Reservations,
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
