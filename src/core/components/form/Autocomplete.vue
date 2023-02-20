<template>
  <div class="autocomplete">
    <Menu stop-open-on-click-activator v-model:open="open">
      <template #activator>
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
                !isFocus
                  ? 'black'
                  : internalError || error
                  ? 'danger'
                  : 'primary'
              "
              v-if="multiple || internalValue == null"
            />
            <IconButton
              name="close"
              v-else
              @click.stop="internalValue = null"
            />
          </template>
        </TextField>
      </template>
      <template #content>
        <SelectOptions
          :is-selected="isSelected"
          :get-option-value="_getOptionValue"
          :get-option-label="props.getOptionLabel"
          :options="optionsFiltered"
          :multiple="props.multiple"
          @select="handleClickOption"
        >
          <template
            v-if="$slots.options"
            #default="{
              isSelected: _isSelected,
              select: _select,
              options: _options,
            }"
          >
            <slot
              name="options"
              :options="_options"
              :isSelected="_isSelected"
              :select="_select"
            />
          </template>
        </SelectOptions>
      </template>
    </Menu>

    <Alert v-if="typeof (internalError || error) === 'string'">
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { computed } from "vue";

import TextField from "./TextField.vue";
import { debounce, isEqual } from "lodash";
import Alert from "../Alert.vue";
import Icon from "../Icon.vue";
import type { AnySchema } from "yup";
import IconButton from "../IconButton.vue";
import Menu from "../Menu.vue";
import SelectOptions from "../SelectOptions.vue";

export interface AutocompleteProps {
  multiple?: boolean;

  optionKey?: string;
  getOptionLabel?: (opt: any) => string;
  getOptionValue?: (opt: any) => any;

  options: Array<any>;

  autoFilter?: boolean;
  debounce?: number;
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const emit = defineEmits(["update:modelValue", "search", "update:selected"]);

const props = withDefaults(defineProps<AutocompleteProps>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
  debounce: 500,
});

function _getOptionValue(opt: any) {
  if (props.getOptionValue) {
    return props.getOptionValue(opt);
  }
  if (typeof opt === "string" || typeof opt === "number") {
    return opt;
  }
  if (props.optionKey != null) {
    return opt[props.optionKey];
  }
  return opt;
}

const search = ref("");
const isFocus = ref();
const open = ref(false);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

function handleClose() {
  open.value = false;
  validate();
  search.value = displayed.value;
}

function isSelected(opt: any) {
  if (props.multiple) {
    if (!internalValue.value?.length) return false;
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
      if (!internalValue.value) internalValue.value = [];
      internalValue.value = [...internalValue.value, _getOptionValue(opt)];
    }
  } else {
    if (isSelected(opt)) {
      internalValue.value = undefined;
    } else {
      internalValue.value = _getOptionValue(opt);
    }
    handleClose();
  }
  validate();
}

const selected = computed(() => {
  if (props.multiple) {
    if (!internalValue.value?.length) return [];
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

  if (props.multiple) {
    return selected.value.map((v: any) => props.getOptionLabel(v)).join(", ");
  }
  return props.getOptionLabel(selected.value);
});

const optionsFiltered = computed(() => {
  let res: any[] = [];
  if (props.autoFilter) {
    res = props.options.filter((opt: any) =>
      props
        .getOptionLabel(opt)
        .toLowerCase()
        .includes((search.value || "").toLowerCase())
    );
  }
  res = props.options;

  if (storedOpt.value != null) {
    if (
      !props.multiple &&
      !res.find((o) =>
        isEqual(_getOptionValue(o), _getOptionValue(storedOpt.value))
      )
    ) {
      res.push(storedOpt.value);
    }
  }

  return res;
});

function clickTextField() {
  if (optionsFiltered.value?.length && search.value?.length) {
    open.value = true;
  }
}

watch(
  () => search.value,
  debounce(() => {
    if (search.value !== displayed.value) {
      emit("search", search.value);
      if (optionsFiltered.value?.length) {
        open.value = true;
      } else {
        open.value = false;
      }
    }
    if (!search.value.length) {
      open.value = false;
    }
  }, props.debounce)
);

// here to store the option that correspond to the current value
const storedOpt = ref();

watch(
  () => internalValue.value,
  (val) => {
    search.value = displayed.value;
    storedOpt.value = selected.value;
    emit("update:selected", selected.value);
  },
  {
    immediate: true,
  }
);

watch(
  () => optionsFiltered.value,
  () => {
    if (optionsFiltered.value?.length) {
      if (isFocus.value) {
        if (search.value?.length) open.value = true;
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
</script>

<style lang="scss">
.autocomplete {
  display: grid;
  gap: spacing(1);
  width: 100%;
}
</style>
