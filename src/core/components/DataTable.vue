<template>
  <Table v-bind="$props">
    <template #footer>
      <div class="data-table-pagination">
        <Pagination
          :current-page="currentPage"
          @update:current-page="(val) => $emit('update:currentPage', val)"
        />
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, ref, watch } from "vue";
import Table from "./Table.vue";
import type { Column, Item } from "./types";
import Pagination from "./Pagination.vue";

interface DataTableProps<Item> {
  columns: Array<Column> | null;
  items: Array<Item>;
  itemsPerPage?: number;
  currentPage?: number;
}

const props = withDefaults(defineProps<DataTableProps<Item>>(), {
  columns: null,
  items: Array,
  itemsPerPage: 5,
});
const emit = defineEmits(["update:currentPage"]);
</script>

<style lang="scss" scoped>
.data-table-pagination {
  margin: auto;
  width: 100%;
}
</style>
