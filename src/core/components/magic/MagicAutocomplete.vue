<template>
  <div class="magicAutocomplete">
    <Autocomplete
      v-bind="autocompleteProps"
      :model-value="internalValue"
      @update:model-value="($event) => (internalValue = $event)"
      @update:selected="($event) => $emit('update:selected', $event)"
      @search="onSearch"
      :options="options"
      :autoFilter="false"
      :error="!!internalError"
      :debounce="debounce"
    >
      <template v-for="(index, name) in $slots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </Autocomplete>
    <div class="footer" :class="{ alert: internalError || error }">
      <Alert v-if="internalError || error">
        {{ internalError || error }}
      </Alert>
      <Button v-if="canAdd" variant="text" @click.stop="$emit('add')">
        {{ addText || $t("add") }}
      </Button>
    </div>
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
import Alert from "../Alert.vue";

export interface MagicAutocompleteProps<T> /* extends AutocompleteProps */ {
  multiple?: boolean;

  optionKey?: string;
  getOptionLabel?: (T: any) => string;
  getOptionValue?: (opt: any) => any;

  // magic autocomplete props
  store: APIStore<T>;
  addText?: string;
  canAdd?: boolean;
  options?: Array<T>;
  getFilters?: (str: string) => Filters;
  debounce?: number;
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const emit = defineEmits([
  "update:modelValue",
  "update:options",
  "search",
  "update:selected",
]);

const props = withDefaults(defineProps<MagicAutocompleteProps<any>>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
  getFilters: () => ({}),
  debounce: 500,
});

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
  delete result.rules;
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
      if (!options.value?.length) {
        let filters: any = {};
        if (props.multiple) {
          filters = { $in: { [props.optionKey || "id"]: internalValue.value } };
        } else {
          filters =
            props.optionKey == null
              ? { $eq: { id: internalValue.value.id } }
              : { $eq: { [props.optionKey]: internalValue.value } };
        }
        const response = await props.store.search(filters);
        options.value = response;
        if (response?.[0] != null) {
          emit("update:selected", response[0]);
        }
      }
    }
    validate();
  },
  { immediate: true }
);
</script>

<style lang="scss">
.magicAutocomplete {
  .footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    align-items: center;
    margin-top: spacing(1);
    &.alert {
      justify-content: space-between;
    }
  }
}
</style>
