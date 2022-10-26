<template>
  <Table v-bind="$props">
    <template #title="{ column }">
      <div>
        {{ column.title }}
        <Icon
          v-if="column.sortable === true"
          class="icons-chevron"
          :class="{'icons-chevron-active': internalActiveColumn?.key == column.key as string}"
          name="chevron_left"
        />
      </div>
    </template>
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
import {
  withDefaults,
  defineProps,
  ref,
  watch,
  computed,
  onBeforeMount,
} from "vue";
import Table from "./Table.vue";
import type { Column } from "./types";
import Pagination from "./Pagination.vue";
import Icon from "./Icon.vue";
import { isNil } from "lodash";

export interface DataTableProps<T = any> {
  columns: Array<Column<T>> | null;
  items: Array<T>;
  itemsPerPage?: number;
  currentPage?: number;
  activeColumn?: Column<T> | null;
}

const props = withDefaults(defineProps<DataTableProps>(), {
  columns: null,
  items: Array,
  itemsPerPage: 5,
  activeColumn: null,
});
const emit = defineEmits(["update:currentPage", "update:activeColumn"]);

const internalActiveColumn = ref<Column | null>();

onBeforeMount(() => {
  internalActiveColumn.value = props.activeColumn;
});
watch(
  () => internalActiveColumn.value,
  (val) => {
    if (isNil(val)) return;
    emit("update:activeColumn", val);
  }
);
</script>

<style lang="scss" scoped>
.data-table-pagination {
  margin: auto;
  width: 100%;
}
.icons-chevron {
  transform: rotate(90deg * 3);
}
.icons-chevron-active {
  transform: rotate(90deg * 5);
}
</style>
