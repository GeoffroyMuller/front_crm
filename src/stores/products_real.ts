import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useProductsRealStore = makeAPIStore({
  id: "products_real",
});

export default useProductsRealStore;
