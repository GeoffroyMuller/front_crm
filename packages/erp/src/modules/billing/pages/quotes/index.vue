<template>
  <Page :title="$t('quotes')" icon="description">
    <template #head-end>
      <Button @click="add()" variant="outlined" color="success">
        {{ $t("add-menu.add-quote") }}
      </Button>
    </template>
    <QuoteFilters />
    <MagicDataTable
      :store="quotestore"
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
          title: $t('status'),
          key: 'validationStatus',
          sortable: true,
        },
      ]"
      @row-click="(item) => handleRowClick(item)"
      selectable
      v-model:selected="selected"
    >
      <template #content-validationStatus="{ item }">
        <QuoteStatusChips :quote="item" />
      </template>
      <template #content-price="{ item }">
        <Price :price="item?.price" />
      </template>
      <template #content-price2="{ item }">
        <Price
          :price="!item.price || !item.taxes ? null : item.price + item.taxes"
        />
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
        <QuoteActionsMenu
          :item="item"
          @setArchived="setArchived"
          @downloadPdf="downloadPdf"
          @sendMail="sendMail"
          @edit="edit"
          @invoice="createInvoiceFromQuote"
        />
      </template>
    </MagicDataTable>
    <QuoteSendMail
      @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
      @close="quoteToSendMail = null"
      :quote="quoteToSendMail"
    />
  </Page>
  <QuoteSidebar
    :open="quoteSidebarIsOpen"
    :model="quoteSidebarOpen"
    @close="quoteSidebarIsOpen = false"
    @setArchived="setArchived"
    @downloadPdf="downloadPdf"
    @sendMail="sendMail"
    @edit="edit"
    @invoice="createInvoiceFromQuote"
  />
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Button from "core/src/components/Button.vue";
import Page from "core/src/components/Page.vue";
import QuoteSendMail from "../../components/quotes/QuoteSendMail.vue";
import Media from "core/src/components/Media.vue";
import FloatingButton from "core/src/components/FloatingButton.vue";
import QuoteFilters from "../../components/quotes/QuoteFilters.vue";
import QuoteActionsMenu from "../../components/quotes/QuoteActionsMenu.vue";
import Price from "core/src/components/Price.vue";
import useQuote from "../../components/quotes/quote";
import type { Quote } from "../../types";
import QuoteStatusChips from "../../components/quotes/QuoteStatusChips.vue";
import QuoteSidebar from "../../components/quotes/QuoteSidebar.vue";
import { ref } from "vue";
import IconButton from "core/src/components/IconButton.vue";
import Badge from "core/src/components/Badge.vue";
import Card from "core/src/components/card/Card.vue";

const quoteSidebarOpen = ref<Quote>();
const quoteSidebarIsOpen = ref<boolean>(false);

function handleRowClick(item: Quote) {
  quoteSidebarOpen.value = item;
  quoteSidebarIsOpen.value = true;
}

const {
  quotestore,
  downloadPdf,
  selected,
  setArchived,
  setArchivedSelection,
  sendMail,
  quoteToSendMail,
  edit,
  createInvoiceFromQuote,
  add,
} = useQuote({
  afterAction: () => {
    quotestore.fetchList();
  },
});
</script>
