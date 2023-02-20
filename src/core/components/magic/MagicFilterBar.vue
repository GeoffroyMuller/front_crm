<template>
  <Card :withPadding="false" class="magic-filter-bar">
    <template #title>
      <Icon name="filter_alt" />
      {{ $t("filters") }}
    </template>
    <MagicForm
      :columns="columns"
      :gap="gap"
      :model-value="filtersValues"
      :fields="filters"
      @inputChange="handleInputChange"
    >
      <template #footer></template>
      <template #fields>
        <Flex align-items="center" flex-wrap="wrap" :gap="gap">
          <template v-for="field of filters" :key="field.props.name">
            <div :style="{ flexGrow: 1 }">
              <MagicFormField v-bind="field" />
            </div>
          </template>
        </Flex>
      </template>
    </MagicForm>
  </Card>
</template>

<script setup lang="ts">
import type { APIStore } from "@/core/helpers/vue/store/store.factory";
import { debounce, get, set } from "lodash";
import { ref, watch } from "vue";
import Card from "../Card.vue";
import MagicForm from "./MagicForm.vue";
import type { MagicFormFieldProps } from "@/core/components/magic/MagicFormField.vue";
import type { GridColumnsOptions } from "../layouts/types";
import Icon from "../Icon.vue";
import Flex from "../layouts/Flex.vue";
import MagicFormField from "@/core/components/magic/MagicFormField.vue";

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

const props = withDefaults(defineProps<MagicFilterBarProps<any>>(), {});

const filtersValues = ref<any>(mapFiltersFromStore());

let controller = new AbortController();
watch(
  () => filtersValues.value,
  debounce(() => {
    controller.abort();
    controller = new AbortController();
    props.store.setFilters(mapFormFilters());
    props.store.fetchList(undefined, true, controller.signal);
  }, 500)
);

function handleInputChange({ name, value }: { name: string; value: any }) {
  //filtersValues.value[name] = value;
  filtersValues.value = { ...filtersValues.value, [name]: value };
}
</script>

<style lang="scss">
.magic-filter-bar {
  padding: spacing(2);
}
</style>
