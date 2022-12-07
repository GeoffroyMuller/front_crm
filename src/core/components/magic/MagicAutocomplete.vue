<template>
  <Autocomplete
    v-bind="autocompleteProps"
    :model-value="internalValue"
    @update:model-value="($event) => (internalValue = $event)"
    @search="onSearch"
    :options="options"
    :autoFilter="false"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Autocomplete, { type AutocompleteProps } from "../form/Autocomplete.vue";
import type { AnySchema } from "yup";
import useValidatable from "@/core/helpers/vue/composables/validatable";

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

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const options = ref([]);

const autocompleteProps = computed(() => {
  const result = { ...props };
  delete result.name;
  return result;
});

// TODO :  do not fetchAll, fetch the required string
async function onSearch(q: string) {
  const response = await props.store.search({ q });
  options.value = response;
}

onMounted(() => {
  if (internalValue.value != null) {
    onSearch(internalValue.value);
  }
});
</script>
