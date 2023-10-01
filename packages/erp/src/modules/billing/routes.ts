import LayoutPage from "@/layouts/LayoutPage.vue";
import auth from "@/middleware/auth";

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
      component: () => import("./pages/quotes/EditQuote.vue"),
      meta: {
        middleware: [auth],
        layout: LayoutPage,
      },
    },
    {
      path: "invoices",
      name: "invoices",
      component: () => import("./pages/invoices/index.vue"),
      meta: {
        middleware: [auth],
        layout: LayoutPage,
      },
    },
    {
      path: "invoices/:id",
      name: "invoices-id",
      meta: {
        middleware: [auth],
        layout: LayoutPage,
      },
    },
  ],
};
