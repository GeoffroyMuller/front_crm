<template>
  <Page :title="$t('sales')">
    <MagicDataTable
      :store="salesStore"
      :columns="[
        {
          title: $t('pages.edit-sale.customer-name'),
          key: 'customer-name',
          sortable: true,
        },
        {
          title: $t('pages.edit-sale.customer-email'),
          key: 'customer-email',
          sortable: true,
        },
        {
          title: $t('date'),
          key: 'date',
          sortable: true,
        },
      ]"
      @row-click="(sale: Sale) => $router.push(`/sales/${sale.id}`)"
    >
      <template #content-date="{ item }">
        <div>
          {{ $_.isNil(item.date) ? "-" : $utils.formatDate(item.date) }}
        </div>
      </template>
      <template #content-customer-name="{ item }">
        {{ `${item.customer.firstname} ${item.customer.lastname}` }}
      </template>
      <template #content-customer-email="{ item }">
        <div>
          {{ `${item.customer.email}` }}
        </div>
      </template>
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click="$router.push(`/sales/new`)"
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
    </MagicDataTable>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import useSaleStore from "@/stores/sales";
import type { Sale } from "@/types/sale";
import dayjs, { type Dayjs } from "dayjs";
import Grid from "@/core/components/layouts/Grid.vue";

const salesStore = useSaleStore();
</script>
