import routes from "./routes";
import setup from "@/core/setup";

console.error({
  env: import.meta.env,
});

const { app } = setup({
  routes,
});

app.mount("#app");
