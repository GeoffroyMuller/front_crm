<template>
  <Table
    bordered
    :items="invoice.payments || []"
    :columns="[
      {
        key: 'created_at',
        title: 'date',
      },
      {
        key: 'amount',
        title: 'amount',
      },
    ]"
  >
    <template #actions-title>
      <IconButton name="add" color="success" />
    </template>
    <template #content-amount="{ item }">
      <Price :price="item?.amount" />
    </template>
    <template #content-created_at="{ item }">
      {{ $utils.formatDate(item.created_at) }}
    </template>
  </Table>
</template>
<script setup lang="ts">
import Table from "core/src/components/table/Table.vue";
import type Invoice from "../../types";
import Price from "core/src/components/Price.vue";
import IconButton from "core/src/components/IconButton.vue";

defineProps<{ invoice: Invoice }>();
</script>
