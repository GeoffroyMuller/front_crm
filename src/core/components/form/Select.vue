<template>
  <div class="select" ref="selectRef" v-click-outside="() => (open = false)">
    <TextField
      :model-value="displayed"
      readonly
      :disabled="disabled"
      :label="label"
      :error="internalError || error ? true : false"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @click="open = !open"
    >
      <template #icon>
        <Icon
          :name="!open ? 'expand_more' : 'expand_less'"
          :color="
            !isFocus ? 'black' : internalError || error ? 'danger' : 'primary'
          "
          v-if="required || multiple || internalValue == null"
        />
        <IconButton name="close" v-else @click.stop="internalValue = null" />
      </template>
      <!-- <template #content v-if="multiple">
        {{ internalValue }}
      </template> -->
    </TextField>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { computed, ref, type Component } from "vue";

import TextField from "./TextField.vue";
import { isEqual } from "lodash";
import Alert from "../Alert.vue";
import OptionsList from "../OptionsList.vue";
import Icon from "../Icon.vue";
import type { AnySchema } from "yup";
import useMenu from "@/core/helpers/vue/composables/menu";
import IconButton from "../IconButton.vue";

export interface SelectProps  {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
  getOptionLabel?: (opt: any) => string;

  options: Array<any>;

  option?: Component;

  required?: boolean;

  
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const props = withDefaults(defineProps<SelectProps>(), {
  multiple: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number" || opt === null) {
      return opt;
    }
    return opt?.label;
  },
  getOptionValue: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number" || opt === null) {
      return opt;
    }
    return opt?.value;
  },
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);

const isFocus = ref(false);
const selectRef = ref();

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const menuDisabled = computed(() => props.disabled || !props.options?.length);

function isSelected(opt: any) {
  if (props.multiple) {
    if (!internalValue.value?.length) return false;
    return (
      internalValue.value.find((v: any) =>
        isEqual(props.getOptionValue(opt), v)
      ) != null
    );
  }
  return isEqual(props.getOptionValue(opt), internalValue.value);
}

const { open } = useMenu({
  activator: selectRef,
  component: OptionsList,
  openOnHover: false,
  fullActivatorWidth: true,
  componentProps: {
    "handle-click-option": handleClickOption,
    "get-option-value": props.getOptionValue,
    "get-option-label": props.getOptionLabel,
    "is-selected": isSelected,
    option: props.option,
    options: props.options,
    multiple: props.multiple,
  },
});

function handleClickOption(opt: any) {
  if (props.multiple) {
    if (isSelected(opt)) {
      internalValue.value = internalValue.value.filter((v: any) => {
        return !isEqual(props.getOptionValue(opt), v);
      });
    } else {
      if (!internalValue.value) internalValue.value = [];
      internalValue.value = [...internalValue.value, props.getOptionValue(opt)];
    }
  } else {
    if (isSelected(opt)) {
      internalValue.value = undefined;
    } else {
      internalValue.value = props.getOptionValue(opt);
    }
    open.value = false;
  }
  validate();
}

const selected = computed(() => {
  if (props.multiple) {
    if (!internalValue.value?.length) return [];
    return internalValue.value.map((v: any) =>
      props.options.find((o) => isEqual(props.getOptionValue(o), v))
    );
  }
  return props.options.find((o) =>
    isEqual(props.getOptionValue(o), internalValue.value)
  );
});

const displayed = computed<string>(() => {
  if (props.multiple) {
    return selected.value.map((v: any) => props.getOptionLabel(v)).join(", ");
  }
  if (
    selected.value === null &&
    props.options.find((opt) => opt == null) !== undefined
  ) {
    return props.getOptionLabel(selected.value);
  }
  return selected.value != null ? props.getOptionLabel(selected.value) : "";
});
</script>

<style lang="scss">
.select {
  display: grid;
  gap: spacing(1);
  width: 100%;
  height: fit-content;
  input {
    cursor: pointer;
  }
}
</style>
