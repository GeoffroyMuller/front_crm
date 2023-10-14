import dayjs from "dayjs";
import type { Plugin } from "vue";

export interface $utils {
  formatPrice: (price: number, currency?: "€" | "$") => string;
  formatDate: (date: string | dayjs.Dayjs | Date) => string;
}

const utilsPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$utils = {
      formatDate: (date?: string | dayjs.Dayjs | Date) => {
        if (!date) return "";
        const FORMAT = "DD/MM/YYYY";
        return dayjs(date).format(FORMAT);
      },
      formatPrice: (
        price: number | string | undefined,
        currency: "€" | "$" = "€"
      ) => {
        if (price == null) {
          return "";
        }
        const priceNumber = +price;
        let formattedPrice;
        switch (currency) {
          case "€":
            formattedPrice = priceNumber.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            });
            break;
          case "$":
            formattedPrice = priceNumber.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
            break;
          default:
            return priceNumber;
        }
        return formattedPrice.split(".")[0];
      },
    } as $utils;
  },
};

export default utilsPlugin;
