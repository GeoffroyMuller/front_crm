import { createI18n } from "vue-i18n";
import { merge } from "lodash";

//Core translation file
import en from "../i18n/en.json";
import fr from "../i18n/fr.json";

export const corei18nMessages = { en, fr };

export default function setupI18n(lang: any, locale = "fr") {
  return createI18n({
    locale,
    fallbackLocale: "en",
    globalInjection: true,
    legacy: false,
    messages: merge(lang, corei18nMessages),
  });
}
