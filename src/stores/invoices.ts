import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type Invoice from "@/types/invoice";

const useInvoicesStore = makeAPIStore<Invoice>({
  id: "invoices",
  filters: {
    populate: ["client"],
  },
});

export default useInvoicesStore;
