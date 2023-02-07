<template>
  <Page :title="$t('quotes')" class="quotes-page">
    <QuoteFilters />
    <MagicDataTable
      :store="quotesStore"
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
          <div class="title">
            {{ $t("quotes") }}
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
              v-tooltip="{ text: $t('add'), placement: 'bottom' }"
              @click="$router.push(`/quotes/new`)"
            >
              {{ $t("add") }}
            </Button>
          </Media>
          <Media down="md">
            <FloatingButton
              color="success"
              icon="add"
              @click="$router.push(`/quotes/new`)"
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
        />
      </template>
    </MagicDataTable>
    <QuotePreview
      @close="() => (quoteToPreview = null)"
      :quote="quoteToPreview"
    />
    <QuoteSendMail
      @clickDownloadPDF="() => downloadPdf(quoteToSendMail)"
      @close="quoteToSendMail = null"
      :quote="quoteToSendMail"
    />
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Chip from "@/core/components/Chip.vue";
import Button from "@/core/components/Button.vue";
import useQuoteStore from "@/stores/quotes";
import useUI from "@/core/helpers/vue/composables/ui";
import Page from "@/components/Page.vue";
import { useI18n } from "vue-i18n";
import QuotePreview from "@/components/quotes/QuotePreview.vue";
import { ref } from "vue";
import type { Quote } from "@/types/quote";
import { getJWT } from "@/core/helpers/utils";
import config from "@/const";
import QuoteSendMail from "@/components/quotes/QuoteSendMail.vue";
import Media from "@/core/Media.vue";
import FloatingButton from "@/core/components/FloatingButton.vue";
import QuoteFilters from "@/components/quotes/QuoteFilters.vue";
import QuoteActionsMenu from "@/components/quotes/QuoteActionsMenu.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import { useRouter } from "vue-router";

const { toast, confirm } = useUI();
const { t } = useI18n();
const router = useRouter();

const selected = ref<Array<Quote>>([]);
const quoteToPreview = ref<Quote | null>(null);
const quoteToSendMail = ref<Quote | null>(null);

function preview(item: Quote) {
  quoteToPreview.value = item;
}

function downloadPdf(item: Quote) {
  const url = `${config.API_URL}/quotes/${item.id}/pdf?token=${getJWT()}`;
  window.open(url, "_blank");
}

function sendMail(item: Quote) {
  quoteToSendMail.value = item;
}

function edit(item: Quote) {
  router.push(`/quotes/${item.id}`);
}

function getStatusColor(status: string) {
  if (status === "refused") {
    return "danger";
  }
  if (status === "validated") {
    return "success";
  }
  return "white";
}

async function setArchived(item: Quote) {
  const confirmed = await confirm(t("pages.quotes.sure_archive_quote"));
  if (confirmed) {
    try {
      await quotesStore.update(item.id, {
        archived: true,
      } as Quote);
      toast({
        type: "success",
        message: t(`archived`),
      });
      quotesStore.fetchList();
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
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
        await quotesStore.update(q.id, {
          archived: true,
        } as Quote);
        toast({
          type: "success",
          message: t(`archived`),
        });
      } catch (err) {
        toast({
          type: "danger",
          message: err.response.data.message,
        });
      }
    }
    quotesStore.fetchList();
    selected.value = [];
  }
}

const quotesStore = useQuoteStore();
</script>

<style lang="scss">
.quotes-page {
  display: grid;
  gap: spacing(2);
}
.actions {
  display: flex;
  align-items: center;
  gap: spacing(0.5);
}
</style>
