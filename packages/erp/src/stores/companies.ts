import { makeAPIStore } from "core/src/factories/store.factory";
import type { Company } from "@/types/company";

const useCompaniesStore = makeAPIStore<Company>({
  id: "companies",
});

export default useCompaniesStore;
