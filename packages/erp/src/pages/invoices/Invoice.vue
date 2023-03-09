<template>
  <Page
    :title="`${$t('invoice')} ${invoice?.identifier || ''}`"
    back
    :loading="!invoice"
  >
    <Grid :gap="1">
      <Card :withPadding="false" action-on-top>
        <template #actions>
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
            <Button
              variant="text"
              @click="sendMail"
              icon="mail"
              color="success"
            >
              {{ $t("send_by_mail") }}
            </Button>
            <Button
              variant="text"
              @click.stop="preview"
              icon="preview"
              color="black"
            >
              {{ $t("preview") }}
            </Button>
          </div>
        </template>
        <div class="invoice-content">
          <Grid :gap="5" :columns="1">
            <div class="typo-subtitle">{{ invoice.name }}</div>
            <Flex justify-content="space-between">
              <Flex
                direction="column"
                justify-content="center"
                align-items="flex-start"
              >
                <div class="invoice-user-title">{{ $t("responsible") }}:</div>
                <div class="typo-text2">
                  {{ responsible?.firstname || "" }}
                  {{ responsible?.lastname || "" }}
                </div>
                <div class="typo-text2">
                  {{ responsible?.email || "" }}
                </div>
              </Flex>
              <Flex
                direction="column"
                justify-content="center"
                align-items="flex-end"
              >
                <div>
                  <div class="invoice-user-title">{{ $t("customer") }}:</div>
                  <div class="typo-text2">
                    {{ invoice.client?.firstname }}
                    {{ invoice.client?.lastname }}
                  </div>
                  <div class="typo-text2">
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
                      <div class="typo-text">{{ $t("description") }}:</div>
                      <div class="typo-text2" v-html="line.description"></div>
                    </Grid>
                    <Grid v-if="line.qty" :gap="1" :columns="1">
                      <div class="typo-text">{{ $t("quantity") }}:</div>
                      <div class="typo-text2">{{ line.qty }}</div>
                    </Grid>
                    <Grid v-if="line.unit_price" :gap="1" :columns="1">
                      <div class="typo-text">{{ $t("unit-price") }}:</div>
                      <div class="typo-text2">
                        {{ $utils.formatPrice(line.unit_price!) }}
                      </div>
                    </Grid>
                    <Grid v-if="line.vat" :gap="1" :columns="1">
                      <div class="typo-text">{{ $t("vat") }}:</div>
                      <div class="typo-text2">{{ line.vat.rate }}%</div>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            </Grid>
            <Grid v-if="invoice.modalities" :gap="1" :columns="1">
              <div class="typo-text">{{ $t("modalities") }}:</div>
              <div class="typo-text2" v-html="invoice.modalities"></div>
            </Grid>
            <Grid v-if="invoice.footer" :gap="1" :columns="1">
              <div class="typo-text">{{ $t("footer") }}:</div>
              <div class="typo-text2" v-html="invoice.footer"></div>
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
import useUserStore from "@/stores/user";
import { computed, watch } from "vue";

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
.quote-actions {
  padding: spacing(1) spacing(1.5);
  display: flex;
  align-items: center;
  gap: spacing(1);
}
.invoice-content {
  padding: spacing(1.5);

  .invoice-user-title {
    @include typo(text);
    margin-bottom: spacing(1);
  }
}
</style>
