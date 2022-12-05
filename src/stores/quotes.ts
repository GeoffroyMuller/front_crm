import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useQuoteStore = makeAPIStore({
  id: "quotes",
});

export default useQuoteStore;
