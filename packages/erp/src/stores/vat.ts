import { makeAPIStore } from "core/src/factories/store.factory";
import type { Vat } from "@/types/vat";

const useVatStore = makeAPIStore<Vat>({
  id: "vats",
});

export default useVatStore;
