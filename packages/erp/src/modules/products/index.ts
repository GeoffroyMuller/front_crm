import LayoutPage from "@/layouts/LayoutPage.vue";
import auth from "@/middleware/auth";

import type { AppModule } from "core/src/types";

import Products from "@/modules/products/pages/index.vue";
import EditProduct from "@/modules/products/pages/EditProduct.vue";

const ProductsModule: AppModule = {
  name: "products",
  routes: {
    path: "/products",
    component: () => import("./index.vue"),
    children: [
      {
        path: "/",
        name: "products",
        component: Products,
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
      {
        path: ":id",
        name: "products-id",
        component: EditProduct,
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
    ],
  },
};

export default ProductsModule;
