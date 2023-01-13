<template>
  <component
    :is="isCard ? Card : 'div'"
    :withPadding="false"
    class="magic-filter-bar"
  >
    <MagicForm
      :columns="columns"
      :gap="gap"
      v-model="filtersValues"
      :fields="filters"
    >
      <template #footer></template>
    </MagicForm>
  </component>
</template>

<script setup lang="ts">
import type { APIStore } from "@/core/helpers/vue/store/store.factory";
import { get, set } from "lodash";
import { ref, watch } from "vue";
import Card from "../Card.vue";
import MagicForm from "./MagicForm.vue";
import type { MagicFormFieldProps } from "@/core/components/magic/MagicFormField.vue";
import type { GridColumnsOptions } from "../layouts/Grid.vue";

export interface MagicFilterBarProps<T> {
  store: APIStore<T>;
  filters: Array<MagicFormFieldProps>;
  columns?: GridColumnsOptions;
  gap?: number;
  isCard?: boolean;
  map: { [key: string]: string };
}

function mapFiltersFromStore() {
  const res = {};

  for (const storeFilterKey of Object.keys(props.map)) {
    const value = get(props.store.filters, storeFilterKey);
    if (value) {
      // @ts-ignore
      set(res, props.map[storeFilterKey], value);
    }
  }
  return res;
}

function mapFormFilters() {
  const res = {};
  for (const storeFilterKey of Object.keys(props.map)) {
    // @ts-ignore
    const value = get(filtersValues.value, props.map[storeFilterKey]);
    if (value) {
      set(res, storeFilterKey, value);
    }
  }
  return res;
}

const props = withDefaults(defineProps<MagicFilterBarProps<any>>(), {
  isCard: true,
});

const filtersValues = ref<any>(mapFiltersFromStore());
watch(
  () => filtersValues.value,
  () => {
    props.store.setFilters(mapFormFilters());
  }
);
</script>

<style lang="scss">
.magic-filter-bar {
  padding: spacing(2);
}
</style>
