import LayoutPage from "@/layouts/LayoutPage.vue";
import auth from "@/middleware/auth";

import EditQuote from "./pages/quotes/EditQuote.vue";
import Invoices from "./pages/invoices/index.vue";
import EditInvoice from "./pages/invoices/EditInvoice.vue";
import Invoice from "./pages/invoices/Invoice.vue";

export default {
  name: "billing",
  path: "/billing",
  component: () => import("./index.vue"),
  children: [
    {
      path: "quotes",
      name: "quotes",
      component: () => import("./pages/quotes/index.vue"),
      meta: {
        middleware: [auth],
        layout: LayoutPage,
      },
    },
    {
      path: "quotes/:id",
      name: "quotes-id",
      component: EditQuote,
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
  ],
};
