import { createI18n } from "vue-i18n";
const i18nLocale = "fr";
//Core translation file
import enCore from "@/core/i18n/en.json";
import frCore from "@/core/i18n/fr.json";

//Feature translation file
import enFeature from "@/i18n/en.json";
import frFeature from "@/i18n/fr.json";

const fr = {
  ...frCore,
  ...frFeature,
};
const en = {
  ...enCore,
  ...enFeature,
};

export const i18n = createI18n({
  locale: i18nLocale ? i18nLocale : "fr",
  globalInjection: true,
  legacy: false,
  messages: {
    en,
    fr,
  },
});
