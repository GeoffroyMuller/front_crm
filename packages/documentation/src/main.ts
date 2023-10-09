import setup from "core/src/setup";

import fr from "@/i18n/fr.json";
import en from "@/i18n/fr.json";

import ComponentsModule from "./modules/components";

const { app } = setup({
  routes: [],
  i18n: {
    messages: { fr, en },
    locale: "fr",
  },
  axios: {},
  modules: [ComponentsModule],
});

app.mount("#app");
