import routes from "./routes";
import setup from "core/src/setup";

import fr from "@/i18n/fr.json";
import en from "@/i18n/fr.json";
import config from "@/const";
import axios from "axios";

const { app } = setup({
  routes,
  i18n: {
    messages: { fr, en },
    locale: "fr",
  },
  axios: {
    ...axios.defaults,
    baseURL: config.API_URL,
  },
});

app.mount("#app");
