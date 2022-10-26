<template>
  <div class="select">
    <Menu @close="validate" :disabled="disabled">
      <template #activator="{ open }">
        <TextField
          :model-value="displayed"
          readonly
          :disabled="disabled"
          :label="label"
          :error="internalError || error ? true : false"
          @focus="isFocus = true"
          @blur="isFocus = false"
        >
          <template #icon>
            <Icon
              :name="!open ? 'expand_more' : 'expand_less'"
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
          :options="options"
        />
      </template>
    </Menu>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import type { Rules } from "@/core/helpers/rules";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { computed, ref } from "vue";
import Menu from "../Menu.vue";
import type { FormInputProps } from "../types";
import TextField from "./TextField.vue";
import { isEqual } from "lodash";
import Alert from "../Alert.vue";
import OptionsList from "../OptionsList.vue";
import Icon from "../Icon.vue";

const isFocus = ref(false);

interface SelectProps extends FormInputProps<any> {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
  getOptionLabel?: (opt: any) => string;

  options: Array<any>;

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

const props = withDefaults(defineProps<SelectProps>(), {
  multiple: false,
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
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

function isSelected(opt: any) {
  if (props.multiple) {
    return (
      internalValue.value.find((v: any) =>
        props.options.find((o) => isEqual(props.getOptionValue(o), v))
      ) != null
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
  if (props.multiple) {
    return selected.value.map((v: any) => props.getOptionLabel(v)).join(", ");
  }
  return props.getOptionLabel(selected.value);
});
</script>

<style lang="scss">
.select {
  display: grid;
  gap: spacing(1);
  width: 100%;
}
.select-option {
  cursor: pointer;
  padding-top: spacing(0.75);
  padding-bottom: spacing(0.75);
  &.selected {
    color: color("primary", 500);
  }
  &:hover {
    color: color("primary", 500);
  }
}
</style>
