import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Vat } from "@/types/vat";

const useVatStore = makeAPIStore<Vat>({
  id: "vats",
});

export default useVatStore;
