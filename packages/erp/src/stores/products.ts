import { makeAPIStore } from "core/src/factories/store.factory";
import type { Product } from "@/types/product";

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
  },
});

export default useProductsStore;
