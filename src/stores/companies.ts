import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useCompaniesStore = makeAPIStore({
  id: "companies",
});

export default useCompaniesStore;
