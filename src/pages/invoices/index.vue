<template>
  <Page :title="$t('invoices')">
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
      ]"
      @row-click="(i) => $router.push(`/invoices/${i.id}`)"
    >
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
        <div class="actions">
          <div>
            <Button
              @click.stop="setArchived(item)"
              color="danger"
              icon="archive"
              v-tooltip="{ text: $t('archive'), placement: 'bottom' }"
              v-if="!item.archived"
              variant="outlined"
            />
          </div>
          <div>
            <Button
              @click.stop="downloadPdf(item)"
              color="primary"
              icon="download"
              v-tooltip="{ text: $t('download'), placement: 'bottom' }"
              variant="outlined"
            />
          </div>
        </div>
      </template>
    </MagicDataTable>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Chip from "@/core/components/Chip.vue";
import Button from "@/core/components/Button.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import Page from "@/components/Page.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import type { Quote } from "@/types/quote";
import { getJWT } from "@/core/helpers/utils";
import config from "@/const";
import useInvoicesStore from "@/stores/invoices";

const { toast, confirm } = useUI();
const { t } = useI18n();

const selected = ref<Array<Quote>>([]);

function downloadPdf(item: Quote) {
  const url = `${config.API_URL}/invoices/${item.id}/pdf?token=${getJWT()}`;
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
      await invoiceStore.update(item.id, {
        archived: true,
      });
      toast({
        type: "success",
        message: t(`archived`),
      });
      invoiceStore.fetchList();
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  }
}

const invoiceStore = useInvoicesStore();
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  gap: spacing(0.5);
}
</style>
