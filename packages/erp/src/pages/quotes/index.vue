<template>
  <Page :title="$t('quotes')" class="quotes-page">
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
          key: 'status',
        },
      ]"
      @row-click="(quote) => $router.push(`/quotes/${quote.id}`)"
      selectable
      v-model:selected="selected"
    >
      <template #head>
        <Flex align-items="center" justify-content="space-between">
          <Media up="md">
            <div class="typo-title">
              {{ $t("quotes") }}
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
      <template #content-price="{ item }">
        {{ $utils.formatPrice(item.price) || "-" }}
      </template>
      <template #content-price2="{ item }">
        {{
          !item.price || !item.taxes
            ? "-"
            : $utils.formatPrice(item.price + item.taxes) || "-"
        }}
      </template>
      <template #content-client="{ item }">
        {{ item?.client?.firstname || "" }} {{ item?.client?.lastname || "" }}
      </template>
      <template #content-status="{ item }">
        <Chip :color="getStatusColor(item.status)">
          {{ $t(`data.status.${item.status}`) }}
        </Chip>
      </template>
      <template #actions-title>
        <div>
          <Media up="md">
            <Button
              color="success"
              icon="add"
              v-tooltip="{
                text: $t('keyboardshortcuts.shift+alt+n'),
                placement: 'bottom',
              }"
              @click="$router.push(`/quotes/new/edit`)"
            >
              {{ $t("add") }}
            </Button>
          </Media>
          <Media down="md">
            <FloatingButton
              color="success"
              icon="add"
              @click="$router.push(`/quotes/new/edit`)"
            />
          </Media>
        </div>
      </template>
      <template #actions="{ item }">
        <QuoteActionsMenu
          :item="item"
          @setArchived="setArchived"
          @preview="preview"
          @downloadPdf="downloadPdf"
          @sendMail="sendMail"
          @edit="edit"
          @invoice="createInvoiceFromQuote"
        />
      </template>
    </MagicDataTable>
    <QuotePreview
      @close="() => (quoteToPreview = null)"
      :quote="quoteToPreview"
    />
    <QuoteSendMail
      @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
      @close="quoteToSendMail = null"
      :quote="quoteToSendMail"
    />
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Chip from "core/src/components/Chip.vue";
import Button from "core/src/components/Button.vue";
import Page from "@/components/Page.vue";
import QuotePreview from "@/components/quotes/QuotePreview.vue";
import QuoteSendMail from "@/components/quotes/QuoteSendMail.vue";
import Media from "core/src/components/Media.vue";
import FloatingButton from "core/src/components/FloatingButton.vue";
import QuoteFilters from "@/components/quotes/QuoteFilters.vue";
import QuoteActionsMenu from "@/components/quotes/QuoteActionsMenu.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useQuote from "@/components/quotes/quote";
import type { Quote } from "@/types/quote";
import useKeyboardShortcut from "core/src/composables/keyboardshortcut";
import { useRouter } from "vue-router";

const router = useRouter();

useKeyboardShortcut(["shift+alt+n"], (e) => {
  e.preventDefault();
  router.push(`/quotes/new/edit`);
});

function getStatusColor(status: string) {
  if (status === "refused") {
    return "danger";
  }
  if (status === "validated") {
    return "success";
  }
  return "white";
}

const {
  quotestore,
  downloadPdf,
  selected,
  setArchived,
  setArchivedSelection,
  preview,
  sendMail,
  quoteToPreview,
  quoteToSendMail,
  edit,
  createInvoiceFromQuote,
} = useQuote({
  afterAction: () => {
    quotestore.fetchList();
  },
});
</script>
