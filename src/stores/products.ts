import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Product } from "@/types/product";

const useProductsStore = makeAPIStore<Product>({
  id: "products",
  actions: {
    isPhysicalStock: (product: Product) =>
      product?.stockManagement == "physical",
    isNumeraryStock: (product: Product) =>
      product?.stockManagement == "numerary",
    isNullStock: (product: Product) => product?.stockManagement == null,
  },
});

export default useProductsStore;
