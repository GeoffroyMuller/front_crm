import routes from "./routes";
import setup from "core/src/setup";

const { app } = setup({
  routes,
});

app.mount("#app");
