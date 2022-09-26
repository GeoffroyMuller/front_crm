<template>
  <!-- <div class="table">
    <div v-for="column in columnsInternal" :key="column.key">
      {{ column.title }}
    </div>
    <div v-for="(item, index) in items" :key="index">
      <slot :name="['item', item].join('-')"></slot>
      {{ item }}
    </div>
    <slot name="title"></slot>
    <button @click="getColumnsByItems">TEST</button>
  </div> -->
  <table>
    <thead>
      <tr>
        <th v-for="column in columnsInternal" :key="column.key">
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td
          v-for="(itemKey, index) in Object.keys(item)"
          :key="itemKey + index"
          class="p-1 align-top"
        >
          {{ item[itemKey] }}
        </td>
      </tr>
      <slot name="lines"></slot>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, ref } from "vue";

type T = any;

interface Column {
  title: string;
  key: string;
}

interface TableProps<T> {
  columns: Array<Column> | null;
  items: Array<T>;
  itemsPerPage: number;
}

const props = withDefaults(defineProps<TableProps<T>>(), {
  columns: null,
  items: Array,
  itemsPerPage: 5,
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
const columnsInternal = props.columns || getColumnsByItems();
</script>

<style lang="scss" scoped>
th {
  text-align: left;
}
table {
  background-color: aquamarine;
  & tbody tr {
    border-bottom: 1px solid gray;
    font-weight: 500;
  }
}
</style>
