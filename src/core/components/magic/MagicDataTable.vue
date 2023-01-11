<template>
  <DataTable
    @row-click="($item) => $emit('row-click', $item)"
    :columns="columns"
    :items="items"
    :currentPage="(filters.page as number)"
    :itemsPerPage="(filters.pageSize as number)"
    @update:current-page="handleUpdateCurrentPage"
    @update:items-per-page="handleUpdateItemsPerPage"
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
import type { PaginateResult2, Filters } from "@/core/helpers/vue/store/types";

interface MagicDataTableProps<T> {
  filters: Filters;
  // eslint-disable-next-line @typescript-eslint/ban-types
  store: Store<
    string,
    {
      filters: Filters;
      list: Array<T>;
      totalPages: number;
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    {
      fetchList: (
        filters?: Filters,
        applyState?: boolean
      ) => Promise<PaginateResult2<T>>;
      setPage: (page: number) => void;
      setPageSize: (pageSize: number) => void;
    }
  >;
  hasLocalState?: boolean;
  columns?: Array<Column<T>> | null;
}

const props = withDefaults(defineProps<MagicDataTableProps<any>>(), {
  hasLocalState: false,
});

const loading = ref(false);

const _data = ref<any[]>([]);
const _totalPages = ref(1);
const _baseFilters = ref({
  page: 1,
  pageSize: 10,
});

const filters = computed(() =>
  props.hasLocalState
    ? {
        ...(props.filters || {}),
        ..._baseFilters.value,
      }
    : props.store.filters
);
const items = computed(() =>
  props.hasLocalState ? _data.value : props.store.list
);
const totalPages = computed(() =>
  props.hasLocalState ? _totalPages.value : props.store.totalPages
);

function handleUpdateItemsPerPage(pageSize: number) {
  if (props.hasLocalState) {
    _baseFilters.value.pageSize = pageSize;
    fetch();
  } else {
    props.store.setPageSize(pageSize);
  }
}

function handleUpdateCurrentPage(pageNumber: number) {
  if (props.hasLocalState) {
    _baseFilters.value.page = pageNumber;
    fetch();
  } else {
    props.store.setPage(pageNumber);
  }
}

async function fetch() {
  try {
    if (props.hasLocalState) {
      const { results, totalPages } = await props.store.fetchList(
        filters.value,
        false
      );
      _data.value = results;
      _totalPages.value = totalPages;
      loading.value = false;
    } else {
      await props.store.fetchList();
      loading.value = false;
    }
  } catch (err) {
    console.error(err);
    loading.value = false;
  }
}

onMounted(() => {
  if (!items.value.length) {
    loading.value = true;
  }
  fetch();
});
</script>
