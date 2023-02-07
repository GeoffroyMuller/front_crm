import { getJWT } from "@/core/helpers/utils";
import useUI from "@/core/helpers/vue/composables/ui";
import useInvoicesStore from "@/stores/invoices";
import type Invoice from "@/types/invoice";
import config from "@/const";
import { ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";

export interface UseInvoiceProps {
  invoice?: Ref<Invoice>;
}
/*
to preview and send mail, add the following to the <template> :

    <InvoicePreview
        @close="() => (invoiceToPreview = null)"
        :invoice="invoiceToPreview"
    />
    <InvoiceSendMail
      @clickDownloadPDF="() => downloadPdf(invoiceToSendMail as Invoice)"
      @close="invoiceToSendMail = null"
      :invoice="invoiceToSendMail"
    />
*/

export default function useInvoice(props?: UseInvoiceProps) {
  const { toast, confirm } = useUI();
  const { t } = useI18n();

  const invoiceStore = useInvoicesStore();

  const selected = ref<Array<Invoice>>([]);

  const invoiceToPreview = ref<Invoice | null>();
  function preview(item: Invoice) {
    invoiceToPreview.value = item;
  }

  const invoiceToSendMail = ref<Invoice | null>();
  function sendMail(item: Invoice) {
    invoiceToSendMail.value = item;
  }

  function downloadPdf(item?: Invoice) {
    const _invoice = (props?.invoice?.value || item) as Invoice;
    const url = `${config.API_URL}/invoices/${
      _invoice.id
    }/pdf?token=${getJWT()}`;
    window.open(url, "_blank");
  }

  async function setArchived(item: Invoice) {
    const _invoice = (props?.invoice?.value || item) as Invoice;
    const confirmed = await confirm(t("pages.invoices.sure_archive_invoice"));
    if (confirmed) {
      try {
        await invoiceStore.update(_invoice.id, {
          archived: true,
        } as Invoice);
        toast({
          type: "success",
          message: t(`archived`),
        });
        invoiceStore.fetchList();
      } catch (err) {
        toast({
          type: "danger",
          message: (err as any).response.data.message,
        });
      }
    }
  }

  async function setArchivedSelection() {
    if (
      selected.value.length &&
      (await confirm(t("pages.invoices.sure_archive_selected")))
    ) {
      for (const q of selected.value) {
        try {
          await invoiceStore.update(q.id, {
            archived: true,
          } as Invoice);
          toast({
            type: "success",
            message: t(`archived`),
          });
        } catch (err) {
          toast({
            type: "danger",
            message: (err as any).response.data.message,
          });
        }
      }
      invoiceStore.fetchList();
      selected.value = [];
    }
  }

  return {
    invoiceStore,
    selected,
    setArchived,
    setArchivedSelection,
    downloadPdf,
    preview,
    invoiceToPreview,
    sendMail,
    invoiceToSendMail,
  };
}
