import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useClientStore = makeAPIStore({
  id: "clients",
  filters: {
    populate: ["company"],
  },
});

export default useClientStore;
