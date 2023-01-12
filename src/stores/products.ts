import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Product } from "@/types/product";

const useProductsStore = makeAPIStore({
  id: "products",
  actions: {
    isPhysicalStock: (product: Product) =>
      product?.stockManagement == "physical",
    isNumeraryStock: (product: Product) =>
      product?.stockManagement == "numerary",
    isNoneOrNullStock: (product: Product) =>
      product?.stockManagement == "none" || product?.stockManagement == null,
  },
});

export default useProductsStore;
