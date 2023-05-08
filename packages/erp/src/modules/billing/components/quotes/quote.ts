import { getJWT } from "core/src/helpers/utils";
import useUI from "core/src/composables/ui";
import useQuotesStore from "../../stores/quotes";
import type { Quote } from "../../types";
import config from "@/const";
import { ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useInvoicesStore from "@/modules/billing/stores/invoices";

export interface UseQuoteProps {
  quote?: Ref<Quote>;
  afterAction?: () => void;
}
/*
to send mail, and preview : add the following to the <template> :
    <QuoteSendMail
      @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
      @close="quoteToSendMail = null"
      :quote="quoteToSendMail"
    />
    <QuotePreview @close="quoteToPreview = null" :quote="quoteToPreview" />
*/

export default function useQuote(props?: UseQuoteProps) {
  const { toast, confirm } = useUI();
  const { t } = useI18n();
  const router = useRouter();

  const quotestore = useQuotesStore();
  const invoiceStore = useInvoicesStore();

  const selected = ref<Array<Quote>>([]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const _afterAction = props?.afterAction || (() => {});

  const quoteToSendMail = ref<Quote | null>();
  function sendMail(item?: Quote) {
    const _quote = (props?.quote?.value || item) as Quote;
    quoteToSendMail.value = _quote;
  }

  const quoteToPreview = ref<Quote | null>();
  function preview(item?: Quote) {
    const _quote = (props?.quote?.value || item) as Quote;
    quoteToPreview.value = _quote;
  }

  function downloadPdf(item?: Quote) {
    const _quote = (props?.quote?.value || item) as Quote;
    const url = `${config.API_URL}/quotes/${_quote.id}/pdf?token=${getJWT()}`;
    window.open(url, "_blank");
  }

  async function createInvoiceFromQuote(item?: Quote) {
    try {
      const _quote = (props?.quote?.value || item) as Quote;
      await invoiceStore.invoiceToCreateFromQuote(_quote.id);
      router.push("/invoices/new");
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: (err as any).response.data.message,
      });
    }
  }

  async function setArchived(item: Quote) {
    const _quote = (props?.quote?.value || item) as Quote;
    const confirmed = await confirm(t("pages.quotes.sure_archive_quote"));
    if (confirmed) {
      try {
        await quotestore.update(_quote.id, {
          archived: true,
        } as Quote);
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
      (await confirm(t("pages.quotes.sure_archive_selected")))
    ) {
      for (const q of selected.value) {
        try {
          await quotestore.update(q.id, {
            archived: true,
          } as Quote);
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

  function edit(item: Quote) {
    router.push({
      name: "quotes-id",
      params: {
        id: item.id,
      },
    });
  }
  function add() {
    router.push({
      name: "quotes-id",
      params: {
        id: "new",
      },
    });
  }

  return {
    quotestore,
    selected,
    setArchived,
    setArchivedSelection,
    downloadPdf,
    add,
    edit,
    sendMail,
    quoteToSendMail,
    preview,
    quoteToPreview,

    createInvoiceFromQuote,
  };
}
