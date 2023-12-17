import LayoutPage from "@/layouts/LayoutPage.vue";
import auth from "@/middleware/auth";

import type { AppModule } from "core/src/types";

const ProductsModule: AppModule = {
  name: "customers",
  routes: {
    path: "/customers",
    component: () => import("./index.vue"),
    children: [
      {
        path: "",
        name: "customers",
        component: () => import("@/modules/customers/pages/index.vue"),
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
      {
        path: "/customers/companies/:id",
        name: "customers-companies-id",
        component: () => import("@/modules/customers/pages/Company.vue"),
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
    ],
  },
};

export default ProductsModule;
