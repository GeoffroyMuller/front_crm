<template>
  <Page :title="$t('invoices')" class="invoice-page">
    <InvoiceFilters />
    <MagicDataTable
      :store="invoiceStore"
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
import Page from "@/components/Page.vue";
import type Invoice from "@/types/invoice";
import InvoiceFilters from "@/components/invoices/InvoiceFilters.vue";
import InvoiceActionsMenu from "@/components/invoices/InvoiceActionsMenu.vue";
import InvoicePreview from "@/components/invoices/InvoicePreview.vue";
import InvoiceSendMail from "@/components/invoices/InvoiceSendMail.vue";
import InvoicePaymentsBar from "@/components/invoices/InvoicePaymentsBar.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import useInvoice from "../../components/invoices/invoice";

const {
  invoiceStore,
  downloadPdf,
  selected,
  setArchived,
  setArchivedSelection,
  preview,
  sendMail,
  invoiceToPreview,
  invoiceToSendMail,
} = useInvoice();
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
