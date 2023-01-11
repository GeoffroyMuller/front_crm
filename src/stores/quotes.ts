import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import axiosIntance from "@/core/plugins/axios";
import type { ID } from "@/types/utils";

const useQuoteStore = makeAPIStore({
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
