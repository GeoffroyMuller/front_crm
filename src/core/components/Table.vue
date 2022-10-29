<template>
  <component :is="isCard ? Card : 'div'" :withPadding="false">
    <table>
      <thead>
        <tr>
          <th v-for="column in internalColumns" :key="column.key">
            <div v-if="$slots[column.key as string]">
              {{ column.title }}
            </div>
            <slot :name="`title-${column.key as string}`" :column="column" />
            <slot name="title" :column="column" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          @click="$emit('row-click', item)"
        >
          <td v-for="column in columns" :key="column.key" :style="styleItem">
            <div v-if="!$slots[`content-${column.key as string}`]">
              {{
                (column?.data ? column?.data(item) : undefined) ||
                item[column.key]
              }}
            </div>
            <slot
              v-else
              :name="`content-${column.key as string}`"
              :column="column"
              :item="item"
            ></slot>
            <slot name="content" :column="column" :item="item" />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="internalColumns?.length">
            <slot class="table-footer" name="footer"></slot>
          </td>
        </tr>
      </tfoot>
    </table>
  </component>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, ref, watch, onMounted } from "vue";
import type { Column } from "./types";
import { isNil } from "lodash";
import Card from "./Card.vue";

export interface TableProps<T = any> {
  columns: Array<Column> | null;
  items: Array<T> | null;
  styleItem?: string;
  isCard?: boolean;
}

const props = withDefaults(defineProps<TableProps>(), {
  columns: null,
  items: null,
  isCard: true,
});

const internalColumns = ref<Array<Column> | null>(null);
const itemsIsInit = ref<boolean>(false);

const getColumnsByItems = () => {
  const columnsKey: string[] = [];
  props.items?.forEach((item) => {
    columnsKey.push(...Object.keys(item));
  });
  const columnsRes = Array.from(new Set(columnsKey)).map((colKey) => {
    return { key: colKey, title: colKey } as Column;
  });
  return columnsRes;
};

onMounted(() => {
  internalColumns.value = props.columns || getColumnsByItems();
});

watch(
  () => props.items,
  (val) => {
    if (isNil(val)) return;
    if (!itemsIsInit.value) {
      internalColumns.value = props.columns || getColumnsByItems();
    }
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
td,
th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0px 16px;
  height: 48px;
}
th {
  text-align: left;
  height: 56px;
}
table {
  font-size: 14px;
  width: 100%;
  border-collapse: collapse;
  tbody td {
    font-weight: 500;
  }
  tbody tr {
    transition: 0.3s;
    &:hover {
      background-color: color("primary", 50);
      cursor: pointer;
    }
  }
  tfoot tr td {
    padding-right: 25px;
    border-bottom: 0;
    height: 56px;
  }
}
.table-footer {
  width: 100%;
}
</style>
