<template>
  <Page
    :title="`${$t('invoice')} ${invoice?.identifier || ''}`"
    back
    :loading="!invoice"
  >
    <Grid :gap="1">
      <Card :withPadding="false">
        <Flex class="invoice-actions" :gap="1">
          <Button
            variant="text"
            @click="$router.push(`/invoices/${id}/edit`)"
            icon="edit"
          >
            {{ $t("edit") }}
          </Button>
          <Button variant="text" @click="setArchived" icon="archive">
            {{ $t("archive") }}
          </Button>
          <Button variant="text" @click="downloadPdf" icon="download">
            {{ $t("download") }}
          </Button>
          <Button variant="text" @click="sendMail" icon="mail">
            {{ $t("send_by_mail") }}
          </Button>
          <Button variant="text" @click.stop="preview" icon="preview">
            {{ $t("preview") }}
          </Button>
        </Flex>
        <div class="invoice-content">
          <Grid :gap="5" :columns="1">
            <div class="subtitle">{{ invoice.name }}</div>
            <Flex justify-content="space-between">
              <Flex
                direction="column"
                justify-content="center"
                align-items="flex-start"
              >
                <div class="invoice-user-title">{{ $t("responsible") }}:</div>
                <div class="text2">
                  {{ invoice.responsible.firstname }}
                  {{ invoice.responsible.lastname }}
                </div>
                <div class="text2">
                  {{ invoice.responsible.email }}
                </div>
              </Flex>
              <Flex
                direction="column"
                justify-content="center"
                align-items="flex-end"
              >
                <div>
                  <div class="invoice-user-title">{{ $t("customer") }}:</div>
                  <div class="text2">
                    {{ invoice.client?.firstname }}
                    {{ invoice.client?.lastname }}
                  </div>
                  <div class="text2">
                    {{ invoice.client?.address }}
                  </div>
                </div>
              </Flex>
            </Flex>

            <Grid :gap="1" :columns="1">
              <div v-for="line in invoice.lines" :key="line.id">
                <Card>
                  <Grid :gap="1" :columns="4">
                    <Grid :gap="1" :columns="1">
                      <div class="text">{{ $t("description") }}:</div>
                      <div class="text2" v-html="line.description"></div>
                    </Grid>
                    <Grid v-if="line.qty" :gap="1" :columns="1">
                      <div class="text">{{ $t("quantity") }}:</div>
                      <div class="text2">{{ line.qty }}</div>
                    </Grid>
                    <Grid v-if="line.unit_price" :gap="1" :columns="1">
                      <div class="text">{{ $t("unit-price") }}:</div>
                      <div class="text2">
                        {{ $utils.formatPrice(line.unit_price!) }}
                      </div>
                    </Grid>
                    <Grid v-if="line.vat" :gap="1" :columns="1">
                      <div class="text">{{ $t("vat") }}:</div>
                      <div class="text2">{{ line.vat.rate }}%</div>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            </Grid>
            <Grid v-if="invoice.modalities" :gap="1" :columns="1">
              <div class="text">{{ $t("modalities") }}:</div>
              <div class="text2" v-html="invoice.modalities"></div>
            </Grid>
            <Grid v-if="invoice.footer" :gap="1" :columns="1">
              <div class="text">{{ $t("footer") }}:</div>
              <div class="text2" v-html="invoice.footer"></div>
            </Grid>
          </Grid>
        </div>
      </Card>

      <InvoicePayments :invoice="invoice" />
    </Grid>
    <InvoicePreview
      @close="() => (invoiceToPreview = null)"
      :invoice="invoiceToPreview"
    />
    <InvoiceSendMail
      @clickDownloadPDF="() => downloadPdf(invoiceToSendMail as Invoice)"
      @close="invoiceToSendMail = null"
      :invoice="invoiceToSendMail"
    />
  </Page>
</template>

<script setup lang="ts">
import useEditPage from "@/components/editpage";
import useInvoice from "@/components/invoices/invoice";
import InvoicePayments from "@/components/invoices/InvoicePayments.vue";
import InvoicePreview from "@/components/invoices/InvoicePreview.vue";
import InvoiceSendMail from "@/components/invoices/InvoiceSendMail.vue";
import Page from "@/components/Page.vue";
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import useInvoicesStore from "@/stores/invoices";
import type Invoice from "@/types/invoice";

const invoiceStore = useInvoicesStore();

const { model: invoice, id } = useEditPage<Invoice>({
  store: invoiceStore,
  populate: [
    "client.company",
    "responsible.company",
    "lines.vat",
    "payments",
    "total",
  ],
});

const {
  downloadPdf,
  setArchived,
  invoiceToSendMail,
  invoiceToPreview,
  preview,
  sendMail,
} = useInvoice({ invoice });
</script>
<style lang="scss" scoped>
.invoice-actions {
  padding: spacing(0.5) spacing(2);
  background-color: color("primary", 50);
  min-height: 37px;
}
.invoice-content {
  padding: spacing(2);
  .invoice-user-title {
    @include typo(text);
    margin-bottom: spacing(1);
  }
}
</style>
