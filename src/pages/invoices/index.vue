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
      ]"
      @row-click="(i) => $router.push(`/invoices/${i.id}`)"
    >
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
import { getJWT } from "@/core/helpers/utils";
import config from "@/const";
import useInvoicesStore from "@/stores/invoices";
import type Invoice from "@/types/invoice";
import InvoiceFilters from "@/components/invoices/InvoiceFilters.vue";

const { toast, confirm } = useUI();
const { t } = useI18n();

const selected = ref<Array<Invoice>>([]);

function downloadPdf(item: Invoice) {
  const url = `${config.API_URL}/invoices/${item.id}/pdf?token=${getJWT()}`;
  window.open(url, "_blank");
}

async function setArchived(item: any) {
  const confirmed = await confirm(t("pages.invoices.sure_archive_invoice"));
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
