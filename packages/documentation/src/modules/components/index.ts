import type { AppModule } from "core/src/types";
import LayoutDocumentation from "../../layouts/LayoutDocumentation.vue";
import DemoButton from "core/src/components/demo/DemoButtons.vue";

const ComponentsModule: AppModule = {
  name: "ComponentsModule",
  routes: {
    name: "components",
    path: "/",
    meta: {
      layout: LayoutDocumentation,
    },
    component: () => import("./index.vue"),
    children: [
      {
        path: "/buttons",
        name: "buttons",
        component: DemoButton,
      },
    ],
  },
};

export default ComponentsModule;
