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
  >
    <template #title="{ column }">
      <slot
        v-if="!$slots.title"
        :name="`title-${column.key as string}`"
        :column="column"
      />
      <slot name="title" :column="column" />
    </template>
    <template #content="{ column, item }">
      <div v-if="!$slots.content && !$slots[`content-${column.key as string}`]">
        {{ (column?.data ? column?.data(item) : undefined) || item[column.key] }}
      </div>
      <slot
        v-else-if="!$slots.content"
        :name="`content-${column.key as string}`"
        :column="column"
        :item="item"
      ></slot>
      <slot name="content" :column="column" :item="item" />
    </template>

    <template #actions="{ item }" v-if="$slots['actions']">
      <slot name="actions" :item="item" />
    </template>
    <template #actions-title v-if="$slots['actions-title']">
      <slot name="actions-title" />
    </template>
  </DataTable>
</template>
<script setup lang="ts">
import type { Store } from "pinia";
import { computed, onMounted } from "vue";
import DataTable from "@/core/components/DataTable.vue";
import type { Column } from "../types";

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
      fetchList: () => Promise<Array<T>>;
      setPage: (page: number) => void;
      setPageSize: (pageSize: number) => void;
    }
  >;
  columns?: Array<Column<T>> | null;
}

const props = withDefaults(defineProps<MagicDataTableProps<any>>(), {});

const filters = computed(() => props.store.filters);
const items = computed(() => props.store.list);
const totalPages = computed(() => props.store.totalPages);

onMounted(() => {
  props.store?.fetchList().catch((err) => {
    console.error(err);
  });
});
</script>
