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
        {
          title: '',
          key: 'action',
        },
      ]"
      @row-click="(quote) => $router.push(`/quotes/${quote.id}`)"
    >
      <template #content-client="{ item }">
        {{ item.client.firstname }} {{ item.client.lastname }}
      </template>
      <template #content-status="{ item }">
        <Chip :color="getStatusColor(item.status)">
          {{ $t(`data.status.${item.status}`) }}
        </Chip>
      </template>
      <template #content-action="{ item }">
        <Button
          @click.stop="setArchived(item)"
          color="danger"
          icon="archive"
          v-tooltip="{ text: $t('to_archive'), placement: 'bottom' }"
          v-if="!item.archived"
        />
      </template>
    </MagicDataTable>
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

const { toast, confirm } = useUI();
const { t } = useI18n();

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
