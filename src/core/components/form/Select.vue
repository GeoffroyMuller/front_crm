<template>
  <Menu>
    <template #activator="{ open }">
      <TextField
        :full-width="fullWidth"
        :model-value="displayed"
        :readonly="readonly"
        :disabled="disabled"
        :error="internalError"
        :label="label"
        :icon="!open ? 'expand_more' : 'expand_less'"
      />
    </template>
    <template #default>
      <div
        class="select-option"
        :class="{
          selected: isSelected(opt),
        }"
        v-for="opt of options"
        :key="getOptionValue(opt)"
        @click="handleClickOption(opt)"
      >
        {{ getOptionLabel(opt) }}
      </div>
    </template>
  </Menu>
</template>
<script setup lang="ts">
import type { Rules } from "@/core/helpers/rules";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { computed } from "vue";
import Menu from "../Menu.vue";
import type { FormInputProps } from "../types";
import TextField from "./TextField.vue";
import { isEqual } from "lodash";

interface SelectProps extends FormInputProps<any> {
  fullWidth?: boolean;

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
  fullWidth: true,
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
  return props.options.find((o) =>
    isEqual(props.getOptionValue(o), internalValue.value)
  );
});

const displayed = computed<string>(() => {
  if (props.multiple) {
    return selected.value.map((v: any) => props.getOptionLabel(v)).join(", ");
  }
  return props.getOptionLabel(selected.value);
});
</script>

<style lang="scss">
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
