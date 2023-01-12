<template>
  <div class="magicAutocomplete">
    <Autocomplete
      v-bind="autocompleteProps"
      :model-value="internalValue"
      @update:model-value="($event) => (internalValue = $event)"
      @search="onSearch"
      :options="options"
      :autoFilter="false"
    />
    <Button v-if="canAdd" variant="text" @click.stop="$emit('add')">
      {{ addText || $t("add") }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Autocomplete from "../form/Autocomplete.vue";
import type { AnySchema } from "yup";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import Button from "../Button.vue";
import { isEqual } from "lodash";
import type { Filters } from "@/core/helpers/vue/store/types";
import type { APIStore } from "@/core/helpers/vue/store/store.factory";

interface MagicAutocompleteProps /* extends AutocompleteProps */ {
  multiple?: boolean;

  optionKey?: string;
  getOptionLabel?: (opt: any) => string;

  // magic autocomplete props
  store: APIStore<any>;
  addText?: string;
  canAdd?: boolean;
  options?: Array<any>;
  getFilters?: (str: string) => Filters;

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

const emit = defineEmits(["update:modelValue", "update:options", "search"]);

const props = withDefaults(defineProps<MagicAutocompleteProps>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
  getFilters: () => ({}),
});

function _getOptionValue(opt: any) {
  if (props.optionKey != null) {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
  }
  return opt;
}

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const options = ref([]);
watch(
  () => props.options,
  () => {
    options.value = props.options;
  }
);
watch(
  () => options.value,
  () => {
    emit("update:options", options.value);
  }
);

const autocompleteProps = computed(() => {
  const result = { ...props };
  delete result.name;
  return result;
});

async function onSearch(q: string) {
  const response = await props.store.search(props.getFilters(q));
  options.value = response;
}

watch(
  () => internalValue.value,
  async () => {
    if (internalValue.value != null) {
      if (
        options.value.find((opt) =>
          isEqual(_getOptionValue(opt), internalValue.value)
        ) == null
      ) {
        const filters =
          props.optionKey == null
            ? { $eq: { id: internalValue.value.id } }
            : { $eq: { [props.optionKey]: internalValue.value } };
        const response = await props.store.search(filters);
        options.value = response;
      }
    }
  },
  { immediate: true }
);
</script>

<style>
.magicAutocomplete {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
