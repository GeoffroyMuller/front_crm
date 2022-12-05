<template>
  <Autocomplete
    v-bind="$props"
    :model-value="modelValue"
    @update:model-value="($event) => $emit('update:modelValue', $event)"
    @search="onSearch"
    :options="options"
    :autoFilter="false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Autocomplete, { type AutocompleteProps } from "../form/Autocomplete.vue";
import type { AnySchema } from "yup";

interface MagicAutocompleteProps /* extends AutocompleteProps */ {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
  getOptionLabel?: (opt: any) => string;

  // magic autocomplete props
  store: any;

  /*
    TODO : this is a duplicate of props in FormInputProps<string | number>
          need to found why extends do not work proprely
    */
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const emit = defineEmits(["update:modelValue", "search"]);

const props = withDefaults(defineProps<MagicAutocompleteProps>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
  getOptionValue: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.value;
  },
});

const options = ref([]);

// TODO :  do not fetchAll, fetch the required string
async function onSearch(q: string) {
  const response = await props.store.search({ q });
  options.value = response;
}
</script>
