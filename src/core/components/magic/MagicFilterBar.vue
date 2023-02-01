<template>
  <Card :withPadding="false" class="magic-filter-bar">
    <template #title>
      <Icon name="filter_alt" />
      {{ $t("filters") }}
    </template>
    <MagicForm
      :columns="columns"
      :gap="gap"
      v-model="filtersValues"
      :fields="filters"
      @inputChange="handleInputChange"
    >
      <template #footer></template>
    </MagicForm>
  </Card>
</template>

<script setup lang="ts">
import type { APIStore } from "@/core/helpers/vue/store/store.factory";
import { get, set } from "lodash";
import { ref, watch } from "vue";
import Card from "../Card.vue";
import MagicForm from "./MagicForm.vue";
import type { MagicFormFieldProps } from "@/core/components/magic/MagicFormField.vue";
import type { GridColumnsOptions } from "../layouts/types";
import Icon from "../Icon.vue";

export interface MagicFilterBarProps<T> {
  store: APIStore<T>;
  filters: Array<MagicFormFieldProps>;
  columns?: GridColumnsOptions;
  gap?: number;
  map: { [key: string]: string | Array<string> };
}

function mapFormFilters() {
  const res = {};

  for (const storeFilterKey of Object.keys(props.map)) {
    const value = get(filtersValues.value, storeFilterKey);
    if (value) {
      const storeKeys = props.map[storeFilterKey];
      if (Array.isArray(storeKeys)) {
        storeKeys.forEach((sk) => {
          // @ts-ignore
          set(res, sk, value);
        });
      } else {
        // @ts-ignore
        set(res, storeKeys, value);
      }
    }
  }
  return res;
}

function mapFiltersFromStore() {
  const res = {};
  for (const storeFilterKey of Object.keys(props.map)) {
    // @ts-ignore
    const value = get(
      props.store.filters,
      Array.isArray(props.map[storeFilterKey])
        ? props.map[storeFilterKey][0]
        : props.map[storeFilterKey]
    );
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

function handleInputChange({ name, value }: { name: string; value: any }) {
  filtersValues.value[name] = value;
  props.store.setFilters(mapFormFilters());
  props.store.fetchList();
}
</script>

<style lang="scss">
.magic-filter-bar {
  padding: spacing(2);
}
</style>
