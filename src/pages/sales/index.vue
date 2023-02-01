<template>
  <Page :title="$t('sales')">
    <MagicDataTable
      :store="salesStore"
      :columns="[
        {
          title: $t('id'),
          key: 'id',
          sortable: true,
        },
        {
          title: $t('customer'),
          key: 'customer',
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
          {{ dayjs(item.date).format("DD-MM-YYYY") }}
        </div>
      </template>
      <template #content-customer="{ item }">
        <Grid :gap="0.5" :columns="1">
          {{ `${item.customer.firstname} ${item.customer.lastname}` }}
          <div class="sale-customer-email" v-if="item.customer.email">
            {{ `${item.customer.email}` }}
          </div>
        </Grid>
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
<style lang="scss" scoped>
.sale-customer-email {
  @include typo(text2);
}
</style>
