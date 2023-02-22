<template>
  <div class="list">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <p v-if="!$slots.default">
          {{ getLabel ? getLabel(item) : item }}
        </p>
        <slot v-else :item="item" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
export interface ListProps {
  list: Array<any> | null;
  getLabel?: (item: any) => string;
}
const props = withDefaults(defineProps<ListProps>(), {});
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
}
</style>
