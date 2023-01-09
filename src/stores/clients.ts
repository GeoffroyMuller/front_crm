import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useClientStore = makeAPIStore({
  id: "clients",
  filters: {
    "populate[0]": "company",
  },
});

export default useClientStore;
