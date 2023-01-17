<template>
  <div
    class="autocomplete"
    ref="autocomplete"
    v-click-outside="() => (open = false)"
  >
    <TextField
      v-model="search"
      :disabled="disabled"
      :label="label"
      :error="internalError || error ? true : false"
      @focus="isFocus = true"
      @blur="handleBlur"
      @click="clickTextField"
    >
      <template #icon>
        <Icon
          name="search"
          :color="
            !isFocus ? 'black' : internalError || error ? 'danger' : 'primary'
          "
        />
      </template>
    </TextField>
    <Alert v-if="typeof (internalError || error) === 'string'">
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { computed } from "vue";
import Menu from "../Menu.vue";
import type { FormInputProps } from "../types";
import TextField from "./TextField.vue";
import { isEqual } from "lodash";
import Alert from "../Alert.vue";
import OptionsList from "../OptionsList.vue";
import Icon from "../Icon.vue";
import type { AnySchema } from "yup";
import useMenu from "@/core/helpers/vue/composables/menu";

export interface AutocompleteProps extends FormInputProps<any> {
  multiple?: boolean;

  optionKey?: string;
  getOptionLabel?: (opt: any) => string;

  options: Array<any>;

  autoFilter?: boolean;

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

const props = withDefaults(defineProps<AutocompleteProps>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
});

function _getOptionValue(opt: any) {
  if (props.optionKey != null) {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt[props.optionKey];
  }
  return opt;
}

const search = ref("");
const isFocus = ref();
const autocomplete = ref();

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const menuDisabled = computed(
  () => props.disabled || !props.options?.length || !search.value?.length
);

function handleClose() {
  validate();
  search.value = displayed.value;
}

function isSelected(opt: any) {
  if (props.multiple) {
    return (
      internalValue.value.find((v: any) => isEqual(_getOptionValue(opt), v)) !=
      null
    );
  }
  return isEqual(_getOptionValue(opt), internalValue.value);
}

function handleClickOption(opt: any) {
  if (props.multiple) {
    if (isSelected(opt)) {
      internalValue.value = internalValue.value.filter((v: any) => {
        return !isEqual(_getOptionValue(opt), v);
      });
    } else {
      internalValue.value.push(_getOptionValue(opt));
    }
  } else {
    if (isSelected(opt)) {
      internalValue.value = undefined;
    } else {
      internalValue.value = _getOptionValue(opt);
    }
    open.value = false;
  }
  validate();
}

const selected = computed(() => {
  if (props.multiple) {
    return internalValue.value.map((v: any) =>
      props.options.find((o) => isEqual(_getOptionValue(o), v))
    );
  }
  return props.options.find((o) =>
    isEqual(_getOptionValue(o), internalValue.value)
  );
});

const displayed = computed<string>(() => {
  if (selected.value == null) {
    return "";
  }
  if (props.multiple && selected.value?.length == 0)
    if (props.multiple) {
      return selected.value.map((v: any) => props.getOptionLabel(v)).join(", ");
    }
  return props.getOptionLabel(selected.value);
});

const optionsFiltered = computed(() => {
  if (props.autoFilter) {
    return props.options.filter((opt: any) =>
      props
        .getOptionLabel(opt)
        .toLowerCase()
        .includes((search.value || "").toLowerCase())
    );
  }
  return props.options;
});

function clickTextField() {
  if (optionsFiltered.value?.length) {
    open.value = true;
  }
}

watch(
  () => search.value,
  (searchValue) => {
    if (search.value.length === 0) {
      open.value = false;
    }
    if (searchValue !== displayed.value) {
      emit("search", searchValue);
      if (optionsFiltered.value?.length) {
        open.value = true;
      } else {
        open.value = false;
      }
    }
  }
);

watch(
  () => internalValue.value,
  (val) => {
    search.value = displayed.value;
  },
  {
    immediate: true,
  }
);

watch(
  () => optionsFiltered.value,
  () => {
    if (optionsFiltered.value?.length) {
      /* if (autocomplete.value.contains(document.activeElement)) { */
      if (isFocus.value) {
        open.value = true;
      } else {
        if (internalValue.value != null) {
          search.value = displayed.value;
        }
      }
    }
  }
);

function handleBlur() {
  isFocus.value = false;
  search.value = displayed.value;
}

const { open } = useMenu({
  activator: autocomplete,
  component: OptionsList,
  openOnHover: false,
  componentProps: {
    "handle-click-option": handleClickOption,
    "get-option-value": _getOptionValue,
    "get-option-label": props.getOptionLabel,
    "is-selected": isSelected,
    options: optionsFiltered,
  },
});
</script>

<style lang="scss">
.autocomplete {
  display: grid;
  gap: spacing(1);
  width: 100%;
}
</style>
