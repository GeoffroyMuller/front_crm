<template>
  <Page
    :title="`${$t('invoice')} ${invoice?.identifier || ''}`"
    back
    :loading="!invoice"
  >
    <Grid :gap="1">
      <Card>
        <div class="quote-actions">
          <Button
            variant="text"
            @click="$router.push(`/invoices/${id}/edit`)"
            icon="edit"
          >
            {{ $t("edit") }}
          </Button>
          <Button
            variant="text"
            @click="setArchived"
            icon="archive"
            color="danger"
          >
            {{ $t("archive") }}
          </Button>
          <Button
            variant="text"
            @click="downloadPdf"
            icon="download"
            color="black"
          >
            {{ $t("download") }}
          </Button>
          <Button variant="text" @click="sendMail" icon="mail" color="success">
            {{ $t("send_by_mail") }}
          </Button>
        </div>

        <PdfViewer
          :src="`${config.API_URL}/invoices/${
            invoice?.id || id
          }/pdf?token=${getJWT()}`"
        />
      </Card>

      <InvoicePayments :invoice="invoice" />
    </Grid>
    <InvoiceSendMail
      @clickDownloadPDF="() => downloadPdf(invoiceToSendMail as Invoice)"
      @close="invoiceToSendMail = null"
      :invoice="invoiceToSendMail"
    />
  </Page>
</template>

<script setup lang="ts">
import useEditPage from "@/components/editpage";
import useInvoice from "../../components/invoices/invoice";
import InvoicePayments from "../../components/invoices/InvoicePayments.vue";
import InvoiceSendMail from "../../components/invoices/InvoiceSendMail.vue";
import Page from "@/components/Page.vue";
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/card/Card.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import useInvoicesStore from "../../stores/invoices";
import type Invoice from "../../types";
import useUserStore from "@/stores/user";
import { computed, watch } from "vue";
import config from "@/const";
import { getJWT } from "core/src/helpers/utils";
import PdfViewer from "core/src/components/PdfViewer.vue";

const invoiceStore = useInvoicesStore();

const { model: invoice, id } = useEditPage<Invoice>({
  store: invoiceStore,
  populate: ["client.company", "lines.vat", "payments", "total"],
});

const userStore = useUserStore();
const responsible = computed(() =>
  userStore.getById(invoice.value.idResponsible)
);

watch(
  () => invoice.value,
  () => {
    if (invoice.value.idResponsible) {
      try {
        userStore.fetchById(invoice.value.idResponsible, {
          populate: ["company"],
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
);

const { downloadPdf, setArchived, invoiceToSendMail, sendMail } = useInvoice({
  invoice,
});
</script>
<style lang="scss" scoped>
.quote-actions {
  padding: spacing(1) spacing(1.5);
  display: flex;
  align-items: center;
  gap: spacing(1);
}
</style>
