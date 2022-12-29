<template>
  <DataTable
    @row-click="($item) => $emit('row-click', $item)"
    :columns="columns"
    :items="items"
    :currentPage="(filters.page as number)"
    :itemsPerPage="(filters.pageSize as number)"
    @update:current-page="store.setPage"
    @update:items-per-page="store.setPageSize"
    :nbPage="totalPages"
    :loading="loading"
  >
    <template v-for="(index, name) in $slots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </DataTable>
</template>
<script setup lang="ts">
import type { Store } from "pinia";
import { computed, onMounted, ref } from "vue";
import DataTable from "@/core/components/DataTable.vue";
import type { Column } from "../types";
import type { PaginateResult } from "@/core/helpers/vue/store/types";

interface MagicDataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  store: Store<
    string,
    {
      filters: { [key: string]: string | number };
      list: Array<T>;
      totalPages: number;
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    {
      fetchList: () => Promise<PaginateResult<T>>;
      setPage: (page: number) => void;
      setPageSize: (pageSize: number) => void;
    }
  >;
  columns?: Array<Column<T>> | null;
}

const props = withDefaults(defineProps<MagicDataTableProps<any>>(), {});

const loading = ref(false);

const filters = computed(() => props.store.filters);
const items = computed(() => props.store.list);
const totalPages = computed(() => props.store.totalPages);

onMounted(() => {
  if (!items.value.length) {
    loading.value = true;
  }
  props.store
    .fetchList()
    .then(() => {
      loading.value = false;
    })
    .catch((err) => {
      console.error(err);
      loading.value = false;
    });
});
</script>
