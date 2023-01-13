import Default from "./layouts/Default.vue";
import LayoutPage from "./layouts/LayoutPage.vue";
import Layout404 from "./layouts/404Layout.vue";

import auth from "./middleware/auth";

export default [
  {
    path: "/",
    name: "home",
    component: () => import("./pages/Home.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("./pages/products/index.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/products/:id",
    name: "products-id",
    component: () => import("./pages/products/EditProduct.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/quotes",
    name: "quotes",
    component: () => import("./pages/quotes/index.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/quotes/:id",
    name: "quotes-id",
    component: () => import("./pages/quotes/EditQuote.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/customers",
    name: "customers",
    component: () => import("./pages/clients/index.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/companies/:id",
    name: "edit-company",
    component: () => import("./pages/clients/EditCompany.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/projects-calendar",
    name: "projects-calendar",
    component: () => import("./pages/projects/Calendar.vue"),
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/invoices",
    name: "invoices",
    component: () => import("./pages/invoices/index.vue"),
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
];
