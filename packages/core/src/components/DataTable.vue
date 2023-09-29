<template>
  <Table
    v-bind="$props"
    @row-click="($item) => $emit('row-click', $item)"
    @update:selected="($selected) => $emit('update:selected', $selected)"
  >
    <template #title="{ column }">
      <div
        class="column-title"
        :class="{ sortable: isSortableColumn(column) }"
        @click="handleClickTitle(column)"
      >
        {{ column.title }}
        <Icon
          v-if="isSortableColumn(column)"
          class="icons-chevron"
          :class="{ active: isActiveColumn(column), up: !sortDesc }"
          name="chevron_left"
        />
      </div>
      <slot
        v-if="!$slots.title"
        :name="`title-${column.key as string}`"
        :column="column"
      />
      <slot name="title" :column="column" />
    </template>
    <template v-for="(index, name) in $slots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
    <template #footer>
      <div class="md:flex justify-between items-center">
        <div :class="{ 'max-md:mb-2': $slots['data-actions'] }">
          <slot name="data-actions" />
        </div>
        <Pagination
          :current-page="currentPage"
          :itemsPerPage="itemsPerPage"
          :max="nbPage"
          @update:current-page="(val) => $emit('update:currentPage', val)"
          @update:items-per-page="(val) => $emit('update:itemsPerPage', val)"
        />
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
//v-if="isActiveColumn(column) && isSortableColumn(column)"
import { withDefaults, ref, watch, onBeforeMount } from "vue";
import Table from "./Table.vue";
import type { Column } from "./types";
import Pagination from "./Pagination.vue";
import Icon from "./Icon.vue";
import { isNil } from "lodash";
import type { ID } from "../types";

export interface DataTableProps<T = any> {
  columns: Array<Column<T>> | null;
  items: Array<T> | null;
  itemsPerPage?: number;
  itemsKey?: ID;
  nbPage?: number;
  currentPage?: number;
  activeColumn?: Column;
  loading?: boolean;
  selectable?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<DataTableProps>(), {
  columns: null,
  items: null,
});
const emit = defineEmits([
  "update:currentPage",
  "update:activeColumn",
  "update:itemsPerPage",
  "sort",
  "update:selected",
  "row-click",
]);

const sortDesc = ref<boolean | null>(null);
const internalActiveColumn = ref<Column | null>();
onBeforeMount(() => {
  internalActiveColumn.value = props.activeColumn;
});

const handleClickTitle = (column: Column) => {
  if (isSortableColumn(column)) {
    if (isActiveColumn(column)) {
      if (sortDesc.value === true) {
        internalActiveColumn.value = null;
        sortDesc.value = null;
        emitSort(null, null);
      } else {
        sortDesc.value = true;
        emitSort(internalActiveColumn.value, true);
      }
    } else {
      internalActiveColumn.value = column;
      sortDesc.value = false;
      emitSort(column, false);
    }
  }
};

const emitSort = (
  column: Column | null | undefined,
  _sortDesc: boolean | null
) => {
  emit("sort", { column, sortDesc: _sortDesc });
};
const isSortableColumn = (column: Column) => {
  return column.sortable === true;
};
const isActiveColumn = (column: Column) => {
  return internalActiveColumn.value?.key === column.key;
};

watch(
  () => internalActiveColumn.value,
  (val) => {
    if (isNil(val)) return;
    emit("update:activeColumn", val);
  }
);
</script>

<style lang="scss" scoped>
.column-title {
  display: flex;
  align-items: center;
  @include unselectable;
}
.column-title.sortable {
  cursor: pointer;
}
.icons-chevron {
  transform: rotate(90deg * 3);
  transition: all 0.2s;
  line-height: 0px;
  opacity: 0;
}
.icons-chevron.active {
  opacity: 100%;
}
.icons-chevron.up {
  transform: rotate(90deg * 5);
}
</style>
