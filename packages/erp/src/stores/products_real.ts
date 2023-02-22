import { makeAPIStore } from "core/src/factories/store.factory";
import type { ProductReal } from "@/types/product";

const useProductsRealStore = makeAPIStore<ProductReal>({
  id: "products_real",
});

export default useProductsRealStore;
