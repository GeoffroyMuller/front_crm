<template>
  <Page :title="$t('quotes')">
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
          title: $t('status'),
          key: 'status',
        },
      ]"
      @row-click="(quote) => $router.push(`/quotes/${quote.id}`)"
    >
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
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click="$router.push(`/quotes/new`)"
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
      <template #actions="{ item }">
        <div class="actions">
          <div>
            <Button
              @click.stop="setArchived(item)"
              color="danger"
              icon="archive"
              v-tooltip="{ text: $t('archive'), placement: 'bottom' }"
              v-if="!item.archived"
            />
          </div>
          <div>
            <Button
              @click.stop="preview(item)"
              color="primary"
              icon="preview"
              v-tooltip="{ text: $t('preview'), placement: 'bottom' }"
            />
          </div>
          <div>
            <Button
              @click.stop="downloadPdf(item)"
              color="primary"
              icon="download"
              v-tooltip="{ text: $t('download'), placement: 'bottom' }"
            />
          </div>
        </div>
      </template>
    </MagicDataTable>
    <QuotePreview @close="() => (quoteToPreview = null)" :quote="quoteToPreview" />
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

const { toast, confirm } = useUI();
const { t } = useI18n();

const selected = ref<Array<Quote>>([]);
const quoteToPreview = ref<Quote | null>(null);

function preview(item: Quote) {
  quoteToPreview.value = item;
}

function downloadPdf(item: Quote) {
  const url = `${config.API_URL}/quotes/${item.id}/pdf?token=${getJWT()}`;
  window.open(url, "_blank");
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

async function setArchived(item: any) {
  const confirmed = await confirm(t("pages.quotes.sure_archive_quote"));
  if (confirmed) {
    try {
      await quotesStore.update(item.id, {
        archived: true,
      });
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

const quotesStore = useQuoteStore();
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  gap: spacing(0.5);
}
</style>
