import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";

const useInvoicesStore = makeAPIStore({
  id: "invoices",
  filters: {
    populate: ["client"],
  },
});

export default useInvoicesStore;
