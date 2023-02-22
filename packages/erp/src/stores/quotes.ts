import { makeAPIStore } from "core/src/helpers/vue/store/store.factory";
import axiosIntance from "core/src/plugins/axios";
import type { Quote } from "@/types/quote";
import type { ID } from "core/src/types";

const useQuoteStore = makeAPIStore<Quote>({
  id: "quotes",
  actions: {
    async sendByMail(id: ID) {
      return await axiosIntance.post(`/quotes/${id}/send_mail`);
    },
  },
  filters: {
    populate: ["client"],
  },
});

export default useQuoteStore;
