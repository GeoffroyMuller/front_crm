<template>
  <Page :title="$t('invoices')">
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
          <Media up="md">
            <div class="title">
              {{ $t("invoices") }}
            </div>
          </Media>
          <Media down="md">
            {{ `${selected.length || 0} ${$t("selected")}` }}
          </Media>
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
          @edit="edit"
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
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Button from "core/src/components/Button.vue";
import Page from "@/components/Page.vue";
import type Invoice from "@/types/invoice";
import InvoiceFilters from "@/components/invoices/InvoiceFilters.vue";
import InvoiceActionsMenu from "@/components/invoices/InvoiceActionsMenu.vue";
import InvoicePreview from "@/components/invoices/InvoicePreview.vue";
import InvoiceSendMail from "@/components/invoices/InvoiceSendMail.vue";
import InvoicePaymentsBar from "@/components/invoices/InvoicePaymentsBar.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useInvoice from "../../components/invoices/invoice";
import Media from "core/src/components/Media.vue";

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
  edit,
} = useInvoice({
  afterAction: () => {
    invoiceStore.fetchList();
  },
});
</script>
