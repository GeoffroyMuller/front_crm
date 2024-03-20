import dayjs from "dayjs";

export interface Utils {
  formatPrice: (
    price: number | string | undefined,
    currency: "€" | "$"
  ) => string;
  formatDate: (date: string | dayjs.Dayjs | Date) => string;
}

export function getJWT(): string | null {
  return localStorage.getItem("jwt");
}

export function setJWT(jwt: string | null): void {
  if (jwt === null) {
    localStorage.removeItem("jwt");
  } else {
    localStorage.setItem("jwt", jwt);
  }
}

export const utils: Utils = {
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
};
