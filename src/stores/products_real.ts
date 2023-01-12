import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { ProductReal } from "@/types/product";

const useProductsRealStore = makeAPIStore<ProductReal>({
  id: "products_real",
});

export default useProductsRealStore;
