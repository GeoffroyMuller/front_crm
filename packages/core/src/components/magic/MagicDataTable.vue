<template>
  <DataTable
    @update:selected="($selected) => $emit('update:selected', $selected)"
    :columns="columns"
    :items="items"
    :currentPage="(filters.page as number)"
    :itemsPerPage="(filters.pageSize as number)"
    @update:current-page="handleUpdateCurrentPage"
    @update:items-per-page="handleUpdateItemsPerPage"
    :nbPage="totalPages"
    :loading="loading"
    :selectable="selectable"
    :label="label"
  >
    <template v-for="(index, name) in $slots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </DataTable>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DataTable from "../DataTable.vue";
import type { Column } from "../types";
import type { Filters } from "../../types";
import type { APIStore } from "../../factories/store.factory";
import type { ID } from "../../types";

interface MagicDataTableProps<T> {
  filters?: Filters;
  store: APIStore<T>;
  hasLocalState?: boolean;
  columns?: Array<Column<T>> | null;
  selectable?: boolean;
  label?: string;
  itemsKey?: ID;
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
