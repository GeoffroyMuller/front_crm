import { makeAPIStore } from "core/src/helpers/vue/store/store.factory";
import type { InvoicePayment } from "@/types/invoice";
import type Invoice from "@/types/invoice";
import type { ID } from "core/src/types";
import axios from "axios";
import useQuoteStore from "./quotes";
import pinia from "core/src/plugins/pinia";

const useInvoicesStore = makeAPIStore<Invoice>({
  id: "invoices",
  filters: {
    populate: ["client", "payments"],
  },
  state: {
    invoiceToCreate: null,
  },
  actions: {
    async addPayment(id: ID, data: InvoicePayment) {
      return (await axios.post(`/invoices/${id}/payments`, data)).data;
    },
    async sendByMail(id: ID) {
      return await axios.post(`/invoices/${id}/send_mail`);
    },
    async deleteInvoiceToCreate() {
      this.invoiceToCreate = null;
    },
    async invoiceToCreateFromQuote(id: ID): Promise<void> {
      const quoteStore = useQuoteStore(pinia);
      const quote = await quoteStore.fetchById(id, {
        populate: [
          "client.company",
          "responsible.company",
          "lines.[vat, sublines]",
        ],
      });
      this.invoiceToCreate = {
        archived: quote.archived,
        footer: quote.footer,
        modalities: quote.modalities,
        idClient: quote.idClient,
        idResponsible: quote.idResponsible,
        lines: quote.lines.map((line) => {
          const sublines = (line.sublines || []).map(({ idProductReal }) => ({
            idProductReal,
          }));
          const lineCopy = { ...line };
          // @ts-ignore
          delete lineCopy.id;
          delete lineCopy.idQuote;
          return {
            ...lineCopy,
            sublines,
          };
        }),
      } as Invoice;
    },
  },
});

export default useInvoicesStore;
