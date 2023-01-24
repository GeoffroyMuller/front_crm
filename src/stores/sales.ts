import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Sales } from "@/types/sales";

const useSaleStore = makeAPIStore<Sales>({
  id: "sales",
});

export default useSaleStore;
