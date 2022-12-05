import routes from "./routes";
//import routes from "./features/routes";
import setup from "@/core/setup";

const { app } = setup({
  routes,
});

app.mount("#app");
