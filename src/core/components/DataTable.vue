<template>
  <Table>
    <template #footer>
      <Pagination />
    </template>
  </Table>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import Table from "./Table.vue";
import type { Column, Item } from "./types";
import Pagination from "./Pagination.vue";

interface DataTableProps<Item> {
  columns: Array<Column> | null;
  items: Array<Item>;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<DataTableProps<Item>>(), {
  columns: null,
  items: Array,
  itemsPerPage: 5,
  currentPage: 1,
});
</script>

<style lang="scss" scoped></style>
