import routes from "./routes";
import setup from "core/src/setup";

import fr from "@/i18n/fr.json";
import en from "@/i18n/fr.json";

import config from "@/const";

import canPlugin from "./plugins/can";

import billing from "./modules/billing";

const { app } = setup({
  routes,
  i18n: {
    messages: { fr, en },
    locale: "fr",
  },
  axios: {
    baseURL: config.API_URL,
  },
  modules: [billing],
});

app.use(canPlugin);

app.mount("#app");
