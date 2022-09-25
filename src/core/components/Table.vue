<template>
  <div class="table">
    <div v-for="header in headers" :key="header.key">
      {{ header.text }}
    </div>
    <!-- <div v-for="(item, index) in items" :key="index">
      <slot :name="['item', item].join('-')"></slot>
    </div> -->
    <slot name="title"></slot>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

type T = any;

interface HeaderTable<T> {
  text: string;
  key: keyof T;
}

interface TableProps<T> {
  headers: Array<HeaderTable<T>>;
  items: Array<T>;
  itemsPerPage: number;
}

const props = withDefaults(defineProps<TableProps<T>>(), {
  headers: Array,
  items: Array,
  itemsPerPage: 5,
});
</script>

<style lang="scss" scoped>
.table {
  background-color: red;
}
</style>
