import { getJWT } from "core/src/helpers/utils";
import useUI from "core/src/composables/ui";
import useInvoicesStore from "@/modules/billing/stores/invoices";
import type Invoice from "../../types";
import config from "@/const";
import { ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export interface UseInvoiceProps {
  invoice?: Ref<Invoice>;
  afterAction?: () => void;
}
/*
to send mail, add the following to the <template> :

    <InvoiceSendMail
      @clickDownloadPDF="() => downloadPdf(invoiceToSendMail as Invoice)"
      @close="invoiceToSendMail = null"
      :invoice="invoiceToSendMail"
    />
*/

export default function useInvoice(props?: UseInvoiceProps) {
  const { toast, confirm } = useUI();
  const { t } = useI18n();
  const router = useRouter();

  const invoiceStore = useInvoicesStore();

  const selected = ref<Array<Invoice>>([]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const _afterAction = props?.afterAction || (() => {});

  const invoiceToSendMail = ref<Invoice | null>();
  function sendMail(item?: Invoice) {
    const _invoice = (props?.invoice?.value || item) as Invoice;
    invoiceToSendMail.value = _invoice;
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
        _afterAction();
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
      _afterAction();
      selected.value = [];
    }
  }

  function edit(item: Invoice) {
    router.push(`/invoices/${item.id}/edit`);
  }

  return {
    invoiceStore,
    selected,
    setArchived,
    setArchivedSelection,
    downloadPdf,
    edit,
    sendMail,
    invoiceToSendMail,
  };
}
