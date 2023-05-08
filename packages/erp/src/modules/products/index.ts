import LayoutPage from "@/layouts/LayoutPage.vue";
import auth from "@/middleware/auth";

import type { AppModule } from "core/src/types";

const ProductsModule: AppModule = {
  name: "products",
  routes: {
    path: "/products",
    component: () => import("./index.vue"),
    children: [
      {
        path: "/",
        name: "products",
        component: () => import("@/modules/products/pages/index.vue"),
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
      {
        path: ":id",
        name: "products-id",
        component: () => import("@/modules/products/pages/EditProduct.vue"),
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
    ],
  },
};

export default ProductsModule;
