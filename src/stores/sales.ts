import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Sale } from "@/types/sale";

const useSaleStore = makeAPIStore<Sale>({
  id: "sales",
});

export default useSaleStore;
