import Default from "./layouts/Default.vue";
import LayoutPage from "./layouts/LayoutPage.vue";
import Layout404 from "./layouts/404Layout.vue";

import auth from "./middleware/auth";

import Home from "./pages/Home.vue";
import Settings from "./pages/settings/index.vue";
import Products from "./pages/products/index.vue";
import EditProduct from "./pages/products/EditProduct.vue";
import Reservations from "./pages/reservations/index.vue";
import Quotes from "./pages/quotes/index.vue";
import EditQuote from "./pages/quotes/EditQuote.vue";
import Clients from "./pages/clients/index.vue";
import EditCompany from "./pages/clients/EditCompany.vue";
import Events from "./pages/events/index.vue";
import Invoices from "./pages/invoices/index.vue";
import EditInvoice from "./pages/invoices/EditInvoice.vue";
import Invoice from "./pages/invoices/Invoice.vue";

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
    path: "/products",
    name: "products",
    component: Products,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/products/:id",
    name: "products-id",
    component: EditProduct,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/reservations",
    name: "reservations",
    component: Reservations,
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
    component: Clients,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/companies/:id",
    name: "edit-company",
    component: EditCompany,
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
    path: "/invoices",
    name: "invoices",
    component: Invoices,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/invoices/:id/edit",
    name: "invoices-id-edit",
    component: EditInvoice,
    meta: {
      middleware: [auth],
      layout: LayoutPage,
    },
  },
  {
    path: "/invoices/:id",
    name: "invoices-id",
    component: Invoice,
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
