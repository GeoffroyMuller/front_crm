<template>
  <component
    :is="isCard ? Card : 'div'"
    :withPadding="false"
    class="magic-filter-bar"
  >
    <MagicForm
      v-model="filtersValues"
      :fields="filters"
      @inputChange="handleChange"
    >
      <template #footer></template>
    </MagicForm>
  </component>
</template>

<script setup lang="ts">
import type { APIStore } from "@/core/helpers/vue/store/store.factory";
import type { Filters } from "@/core/helpers/vue/store/types";
import { ref } from "vue";
import Card from "../Card.vue";
import MagicForm, { type MagicFormField } from "./MagicForm.vue";

export interface MagicFilterBarProps<T> {
  store: APIStore<T>;
  filters: Array<MagicFormField>;
  isCard?: boolean;

  mapFormFilters: (f: any) => Filters;
}

function handleChange() {
  props.store.setFilters(props.mapFormFilters(filtersValues.value));
}

const filtersValues = ref<any>({});

const props = withDefaults(defineProps<MagicFilterBarProps<any>>(), {
  isCard: true,
});
</script>

<style lang="scss">
.magic-filter-bar {
  padding: spacing(2);
}
</style>
