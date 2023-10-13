import LayoutPage from "@/layouts/LayoutPage.vue";
import auth from "@/middleware/auth";

import type { AppModule } from "core/src/types";

const ProductsModule: AppModule = {
  name: "projects",
  routes: {
    path: "/projects",
    component: () => import("./index.vue"),
    children: [
      {
        path: "",
        name: "projects",
        component: () => import("@/modules/projects/pages/index.vue"),
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
      {
        path: ":id",
        name: "projects-id",
        component: () => import("@/modules/projects/pages/Project.vue"),
        meta: {
          middleware: [auth],
          layout: LayoutPage,
        },
      },
    ],
  },
};

export default ProductsModule;
