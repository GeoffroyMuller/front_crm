<template>
  <!-- <div class="table">
    <div v-for="column in internalColumns" :key="column.key">
      {{ column.text }}
    </div>
    <div v-for="(item, index) in items" :key="index">
      <slot :name="['item', item].join('-')"></slot>
      {{ item }}
    </div>
    <slot name="text"></slot>
    <button @click="getColumnsByItems">TEST</button>
  </div> -->
  <table>
    <thead>
      <tr>
        <th v-for="column in internalColumns" :key="column.key">
          {{ column.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in itemsDisplayed" :key="index">
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
import { withDefaults, defineProps, computed } from "vue";

type Item = any;

interface Column {
  text: string;
  key: keyof Item;
}

interface TableProps<Item> {
  columns: Array<Column> | null;
  items: Array<Item>;
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
    return { key: colKey, text: colKey } as Column;
  });
  return columnsRes;
};

const internalColumns = props.columns || getColumnsByItems();

const itemsDisplayed = computed(() => {
  return props.items.map((item) => {
    const itemRes = {} as Item;
    for (const column of internalColumns) {
      itemRes[column.key] = item[column.key] || "";
    }
    return itemRes;
  });
});
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
