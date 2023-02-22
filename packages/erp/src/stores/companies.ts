import { makeAPIStore } from "core/src/helpers/vue/store/store.factory";
import type { Company } from "@/types/company";

const useCompaniesStore = makeAPIStore<Company>({
  id: "companies",
});

export default useCompaniesStore;
