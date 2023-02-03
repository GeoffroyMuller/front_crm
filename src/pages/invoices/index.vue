<template>
  <Page :title="$t('invoices')" class="invoice-page">
    <InvoiceFilters />
    <MagicDataTable
      :store="useInvoicesStore()"
      :columns="[
        {
          title: $t('ID'),
          key: 'identifier',
        },
        {
          title: $t('customer'),
          key: 'client',
          sortable: true,
        },
        {
          title: $t('title'),
          key: 'name',
          sortable: true,
        },
        {
          title: $t('price_without_vat'),
          key: 'price',
          sortable: true,
        },
        {
          title: $t('price_with_vat'),
          key: 'price2',
          sortable: true,
        },
        {
          title: $t('payments'),
          key: 'payments',
          sortable: true,
        },
      ]"
      @row-click="(i) => $router.push(`/invoices/${i.id}`)"
      v-model:selected="selected"
      selectable
    >
      <template #head>
        <Flex align-items="center" justify-content="space-between">
          <div class="title">
            {{ $t("invoices") }}
          </div>
          <div
            :style="{
              visibility: !selected.length ? 'hidden' : 'initial',
              userSelect: !selected.length ? 'none' : 'initial',
            }"
          >
            <Button
              icon="archive"
              variant="text"
              color="primary"
              @click="setArchivedSelection"
            >
              {{ $t("archive") }}
            </Button>
          </div>
        </Flex>
      </template>
      <template #content-payments="{ item }">
        <InvoicePaymentsBar :invoice="item" />
      </template>
      <template #content-price2="{ item }">
        {{
          !item.price || !item.taxes
            ? "-"
            : $utils.formatPrice(item.price + item.taxes) || "-"
        }}
      </template>
      <template #content-price="{ item }">
        {{ $utils.formatPrice(item.price) || "-" }}
      </template>
      <template #content-client="{ item }">
        {{ item?.client?.firstname || "" }} {{ item?.client?.lastname || "" }}
      </template>
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click="$router.push(`/invoices/new/edit`)"
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
      <template #actions="{ item }">
        <InvoiceActionsMenu
          :item="item"
          @setArchived="setArchived"
          @preview="preview"
          @downloadPdf="downloadPdf"
          @sendMail="sendMail"
        />
      </template>
    </MagicDataTable>
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

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Button from "@/core/components/Button.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import Page from "@/components/Page.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { getJWT } from "@/core/helpers/utils";
import config from "@/const";
import useInvoicesStore from "@/stores/invoices";
import type Invoice from "@/types/invoice";
import InvoiceFilters from "@/components/invoices/InvoiceFilters.vue";
import InvoiceActionsMenu from "@/components/invoices/InvoiceActionsMenu.vue";
import InvoicePreview from "@/components/invoices/InvoicePreview.vue";
import InvoiceSendMail from "@/components/invoices/InvoiceSendMail.vue";
import InvoicePaymentsBar from "@/components/invoices/InvoicePaymentsBar.vue";
import Flex from "@/core/components/layouts/Flex.vue";

const { toast, confirm } = useUI();
const { t } = useI18n();

const selected = ref<Array<Invoice>>([]);

function downloadPdf(item: Invoice) {
  const url = `${config.API_URL}/invoices/${item.id}/pdf?token=${getJWT()}`;
  window.open(url, "_blank");
}

async function setArchived(item: Invoice) {
  const confirmed = await confirm(t("pages.invoices.sure_archive_invoice"));
  if (confirmed) {
    try {
      await invoiceStore.update(item.id, {
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
const invoiceToPreview = ref<Invoice | null>();
function preview(item: Invoice) {
  invoiceToPreview.value = item;
}

const invoiceToSendMail = ref<Invoice | null>();
function sendMail(item: Invoice) {
  invoiceToSendMail.value = item;
}

const invoiceStore = useInvoicesStore();
</script>

<style lang="scss">
.invoice-page {
  display: grid;
  gap: spacing(2);
  .actions {
    display: flex;
    align-items: center;
    gap: spacing(0.5);
  }
}
</style>
