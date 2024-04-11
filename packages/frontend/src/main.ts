
import setup from "core/src/setup";

import fr from "@/i18n/fr.json";
import en from "@/i18n/fr.json";

import config from "@/const";

import canPlugin from "./plugins/can";
import baseModule from "./modules/base";

const { app } = setup({
  i18n: {
    messages: { fr, en },
    locale: "fr",
  },
  axios: {
    baseURL: config.API_URL,
  },
  modules: [baseModule],
});

app.use(canPlugin);

app.mount("#app");
