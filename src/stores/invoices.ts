import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { InvoicePayment } from "@/types/invoice";
import type Invoice from "@/types/invoice";
import type { ID } from "@/types/utils";
import axios from "@/core/plugins/axios";

const useInvoicesStore = makeAPIStore<Invoice>({
  id: "invoices",
  filters: {
    populate: ["client"],
  },
  actions: {
    async addPayment(id: ID, data: InvoicePayment) {
      return (await axios.post(`/invoices/${id}/payments`, data)).data;
    },
  },
});

export default useInvoicesStore;
