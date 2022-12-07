import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useVatStore = makeAPIStore({
  id: "vats",
});

export default useVatStore;
