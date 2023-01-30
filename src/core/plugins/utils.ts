import type { Plugin } from "vue";

export interface $utils {
  formatPrice: (price: number) => string;
}

const utilsPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$utils = {
      formatPrice: (price: number) => {
        const language = "fr-FR";
        if (price == null) {
          return "";
        }
        let formattedPrice;
        switch (language) {
          case "fr-FR":
            formattedPrice = price.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            });
            break;
          case "en-US":
            formattedPrice = price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
            break;
          case "de-DE":
            formattedPrice = price.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
            });
            break;
          default:
            formattedPrice = price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
        }
        return formattedPrice.split(".")[0];
      },
    } as $utils;
  },
};

export default utilsPlugin;
