<template>
  <div class="autocomplete">
    <Menu @close="handleClose" :close-on-second-click="false" :disabled="disabled">
      <template #activator="{ open }">
        <TextField
          v-model="search"
          :disabled="disabled"
          :label="label"
          :error="internalError || error ? true : false"
          @focus="isFocus = true"
          @blur="isFocus = false"
        >
          <template #icon>
            <Icon
              name="search"
              :color="!isFocus ? 'black' : internalError || error ? 'danger' : 'primary'"
            />
          </template>
        </TextField>
      </template>
      <template #default>
        <OptionsList
          :handle-click-option="handleClickOption"
          :get-option-value="getOptionValue"
          :get-option-label="getOptionLabel"
          :is-selected="isSelected"
          :options="optionsFiltered"
        />
      </template>
    </Menu>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Rules } from "@/core/helpers/rules";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { computed } from "vue";
import Menu from "../Menu.vue";
import type { FormInputProps } from "../types";
import TextField from "./TextField.vue";
import { isEqual } from "lodash";
import Alert from "../Alert.vue";
import OptionsList from "../OptionsList.vue";
import Icon from "../Icon.vue";

export interface AutocompleteProps extends FormInputProps<any> {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
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
  rules?: Rules;
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
  getOptionValue: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.value;
  },
});
const search = ref("");
const isFocus = ref();

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

function handleClose() {
  validate();
  search.value = displayed.value;
}

function isSelected(opt: any) {
  if (props.multiple) {
    return (
      internalValue.value.find((v: any) => isEqual(props.getOptionValue(opt), v)) != null
    );
  }
  return isEqual(props.getOptionValue(opt), internalValue.value);
}

function handleClickOption(opt: any) {
  if (props.multiple) {
    if (isSelected(opt)) {
      internalValue.value = internalValue.value.filter((v: any) => {
        return !isEqual(props.getOptionValue(opt), v);
      });
    } else {
      internalValue.value.push(props.getOptionValue(opt));
    }
  } else {
    if (isSelected(opt)) {
      internalValue.value = undefined;
    } else {
      internalValue.value = props.getOptionValue(opt);
    }
  }
  validate();
}

const selected = computed(() => {
  if (props.multiple) {
    return internalValue.value.map((v: any) =>
      props.options.find((o) => isEqual(props.getOptionValue(o), v))
    );
  }
  return props.options.find((o) => isEqual(props.getOptionValue(o), internalValue.value));
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

watch(
  () => search.value,
  (searchValue) => {
    if (searchValue !== displayed.value) {
      emit("search", searchValue);
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
</script>

<style lang="scss">
.autocomplete {
  display: grid;
  gap: spacing(1);
  width: 100%;
}
</style>
