import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useProductsStore = makeAPIStore({
  id: "products",
});

export default useProductsStore;
