<template>
  <Flex v-show="!isAdvancedFiltersDisplayed" :gap="1" align-items="end">
    <SearchBar
      :placeholder="searchBarPlaceholder"
      v-model="search"
      class="magic-filters-bar-search"
    />
    <Button
      v-if="hasAdvancedFilters"
      variant="text"
      icon="filter_alt"
      @click="isAdvancedFiltersDisplayed = true"
    >
      {{ $t("advanced_filters") }}
      <span v-if="+nbFilters > 0">({{ nbFilters }})</span>
    </Button>
  </Flex>
  <Card
    :withPadding="false"
    class="magic-filter-bar"
    v-show="isAdvancedFiltersDisplayed"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 typo-title2">
        <Icon name="filter_alt" />
        {{ $t("filters") }}
      </div>
      <IconButton
        @click="isAdvancedFiltersDisplayed = false"
        name="close"
        class="close-button"
        size="xl"
      />
    </div>
    <MagicForm
      :columns="columns"
      :gap="gap"
      :initial-value="filtersValues"
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
import type { APIStore } from "../../factories/store.factory";
import { debounce, get, set } from "lodash";
import { computed, ref, watch } from "vue";
import Card from "../card/Card.vue";
import MagicForm from "./MagicForm.vue";
import type { MagicFormFieldProps } from "./MagicFormField.vue";
import type { GridColumnsOptions } from "../layouts/types";
import Icon from "../Icon.vue";
import Flex from "../layouts/Flex.vue";
import MagicFormField from "./MagicFormField.vue";
import SearchBar from "../form/SearchBar.vue";
import Button from "../Button.vue";
import IconButton from "../IconButton.vue";

export interface MagicFilterBarProps<T> {
  store: APIStore<T>;
  filters: Array<MagicFormFieldProps>;
  columns?: GridColumnsOptions;
  gap?: number;
  map: { [key: string]: string | Array<string> };
  mapSearch?: string | Array<string>;
  searchBarPlaceholder?: string;
}

const search = ref("");
const isAdvancedFiltersDisplayed = ref(false);

const hasAdvancedFilters = computed(() => {
  return props.filters.length > 0;
});

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
  if (props.mapSearch != null) {
    const searchValue = search.value;
    if (!search.value.length) return res;
    if (Array.isArray(props.mapSearch)) {
      props.mapSearch.forEach((sk) => {
        set(res, sk, searchValue);
      });
    } else {
      set(res, props.mapSearch, searchValue);
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
  searchBarPlaceholder: "",
});

const filtersValues = ref<any>(mapFiltersFromStore());

const nbFilters = computed(() => props.store.getNbFilters);

let controller = new AbortController();
const debounceFetch = debounce(() => {
  controller.abort();
  controller = new AbortController();
  props.store.setFilters(mapFormFilters());
  props.store.fetchList(undefined, true, controller.signal);
}, 500);
watch(() => search.value, debounceFetch);
watch(() => filtersValues.value, debounceFetch);

function handleInputChange({ name, value }: { name: string; value: any }) {
  //filtersValues.value[name] = value;
  filtersValues.value = { ...filtersValues.value, [name]: value };
}
</script>

<style lang="scss">
.magic-filter-bar {
  padding: spacing(2);
}

.magic-filters-bar-search {
  max-width: 800px;
}
</style>
