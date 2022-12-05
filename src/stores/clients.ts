import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useClientStore = makeAPIStore({
  id: "clients",
});

export default useClientStore;
