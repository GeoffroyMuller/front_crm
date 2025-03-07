<template>
  <Page :title="$t('invoices')" icon="request_quote">
    <template #head-end>
      <Button @click="add()" variant="outlined" color="success">
        {{ $t("add-menu.add-invoice") }}
      </Button>
    </template>
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
      @row-click="(i) => handleRowClick(i)"
      v-model:selected="selected"
      selectable
    >
      <template #content-payments="{ item }">
        <InvoicePaymentsBar :invoice="item" />
      </template>
      <template #content-price2="{ item }">
        <Price
          :price="!item.price || !item.taxes ? null : item.price + item.taxes"
        />
      </template>
      <template #content-price="{ item }">
        <Price :price="item.price" />
      </template>
      <template #content-client="{ item }">
        {{ item?.client?.firstname || "" }} {{ item?.client?.lastname || "" }}
      </template>
      <template #actions-title>
        <div class="relative">
          <Card
            class="flex p-2 w-fit absolute gap-2 justify-end right-0 md:left-0 top-1/2 -translate-y-1/2 transform md:-translate-x-full"
            :style="{
              display: !selected.length ? 'none' : 'flex',
            }"
          >
            <Badge>
              {{ selected.length || 0 }}
            </Badge>
            <Button icon="download" variant="text" color="primary"> </Button>
            <Button
              icon="archive"
              variant="text"
              color="danger"
              @click="setArchivedSelection"
            >
            </Button>
          </Card>

          <IconButton
            color="success"
            name="add"
            v-tooltip="{
              text: $t('add'),
              placement: 'top',
            }"
            @click="add()"
          />
        </div>
        <Media down="md">
          <FloatingButton color="success" icon="add" @click="add()" />
        </Media>
      </template>
      <template #actions="{ item }">
        <InvoiceActionsMenu
          :item="item"
          @setArchived="setArchived"
          @downloadPdf="downloadPdf"
          @sendMail="sendMail"
          @edit="edit"
        />
      </template>
    </MagicDataTable>
    <InvoiceSendMail
      @clickDownloadPDF="() => downloadPdf(invoiceToSendMail as Invoice)"
      @close="invoiceToSendMail = null"
      :invoice="invoiceToSendMail"
    />
    <InvoiceSidebar
      :open="sidebarIsOpen"
      :model="sidebarOpen"
      @close="sidebarIsOpen = false"
      @setArchived="setArchived"
      @downloadPdf="downloadPdf"
      @sendMail="sendMail"
      @edit="edit"
    />
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Button from "core/src/components/Button.vue";
import Page from "core/src/components/Page.vue";
import type Invoice from "../../types";
import InvoiceFilters from "../../components/invoices/InvoiceFilters.vue";
import InvoiceActionsMenu from "../../components/invoices/InvoiceActionsMenu.vue";
import InvoiceSendMail from "../../components/invoices/InvoiceSendMail.vue";
import InvoicePaymentsBar from "../../components/invoices/InvoicePaymentsBar.vue";
import useInvoice from "../../components/invoices/invoice";
import Media from "core/src/components/Media.vue";
import IconButton from "core/src/components/IconButton.vue";
import Badge from "core/src/components/Badge.vue";
import Card from "core/src/components/card/Card.vue";
import FloatingButton from "core/src/components/FloatingButton.vue";
import InvoiceSidebar from "../../components/invoices/InvoiceSidebar.vue";
import { ref } from "vue";
import Price from "core/src/components/Price.vue";

const sidebarOpen = ref<Invoice>();
const sidebarIsOpen = ref<boolean>(false);

function handleRowClick(item: Invoice) {
  sidebarOpen.value = item;
  sidebarIsOpen.value = true;
}

const {
  invoiceStore,
  downloadPdf,
  selected,
  setArchived,
  setArchivedSelection,
  sendMail,
  invoiceToSendMail,
  edit,
  add,
} = useInvoice({
  afterAction: () => {
    invoiceStore.fetchList();
  },
});
</script>
