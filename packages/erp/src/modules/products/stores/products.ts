import { makeAPIStore } from "core/src/factories/store.factory";
import type { Product } from "@/types/product";
import axios from "axios";

const useProductsStore = makeAPIStore<Product>({
  id: "products",
  filters: {
    populate: ["stock_physical"],
  },
  actions: {
    isPhysicalStock: (product: Product) =>
      product?.stockManagement == "physical",
    isNumeraryStock: (product: Product) =>
      product?.stockManagement == "numerary",
    isNullStock: (product: Product) => product?.stockManagement == null,
    isEventStock: (product: Product) => product?.stockManagement == "events",

    addImage: function (id: Product["id"], image: any) {
      axios.post(`products/${id}/image`, image);
      // @ts-ignore
      if (Array.isArray(this.byId[id].images)) {
        // @ts-ignore
        this.byId[id].images.push(image);
      }
    },
  },
});

export default useProductsStore;
