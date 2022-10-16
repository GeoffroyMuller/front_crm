<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in internalColumns" :key="column.key">
          {{ column.title }}
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
          <div v-if="!$slots[`${column.key as string}`]">
            {{
              (column?.data ? column?.data(item) : undefined) ||
              item[column.key]
            }}
          </div>
          <slot
            v-else
            :name="`${column.key as string}`"
            :column="column"
            :item="item"
          ></slot>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import type { Column, Item } from "./types";

interface TableProps<Item> {
  columns: Array<Column> | null;
  items: Array<Item>;
  styleItem?: string;
}

const props = withDefaults(defineProps<TableProps<Item>>(), {
  columns: null,
  items: Array,
});

const getColumnsByItems = () => {
  const columnsKey: string[] = [];
  props.items.forEach((item) => {
    columnsKey.push(...Object.keys(item));
  });
  const columnsRes = Array.from(new Set(columnsKey)).map((colKey) => {
    return { key: colKey, title: colKey } as Column;
  });
  return columnsRes;
};

const internalColumns = props.columns || getColumnsByItems();
</script>

<style lang="scss" scoped>
td,
th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
}
th {
  text-align: left;
}
table {
  background-color: white;
  box-shadow: 10px 10px 5px 0px #f1f5f9;
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
    &:last-child td {
      border-bottom: 0;
    }
  }
}
</style>
