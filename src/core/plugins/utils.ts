import dayjs from "dayjs";
import type { Plugin } from "vue";

export interface $utils {
  formatPrice: (price: number, currency?: "€" | "$") => string;
  formatDate: (date: string | dayjs.Dayjs | Date) => string;
}

const utilsPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$utils = {
      formatDate: (date: string | dayjs.Dayjs | Date) => {
        const FORMAT = "DD/MM/YYYY";
        return dayjs(date).format(FORMAT);
      },
      formatPrice: (price: number, currency: "€" | "$" = "€") => {
        if (price == null) {
          return "";
        }
        let formattedPrice;
        switch (currency) {
          case "€":
            formattedPrice = price.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            });
            break;
          case "$":
            formattedPrice = price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
            break;
          default:
            return price;
        }
        return formattedPrice.split(".")[0];
      },
    } as $utils;
  },
};

export default utilsPlugin;
